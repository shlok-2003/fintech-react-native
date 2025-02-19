import React, {
    useRef,
    useState,
    useEffect,
    Fragment,
    useCallback,
} from "react";
import {
    Text,
    StyleSheet,
    Platform,
    View,
    TextInput,
    Alert,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import {
    isClerkAPIResponseError,
    useSignIn,
    useSignUp,
} from "@clerk/clerk-expo";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
    Cursor,
    CodeField,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

type showValue = -1 | 0;

interface SheetProps {
    phoneNumber: string;
    signInBoolean?: boolean;
    showBottomSheet: showValue;
    setShowBottomSheet: React.Dispatch<React.SetStateAction<0 | -1>>;
}

const CELL_COUNT = 6;

export default function Sheet({
    phoneNumber,
    showBottomSheet,
    setShowBottomSheet,
    signInBoolean = false,
}: SheetProps) {
    const { signIn } = useSignIn();
    const { signUp, setActive } = useSignUp();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [code, setCode] = useState("");
    const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    console.log("loading");

    const verifyCode = useCallback(async () => {
        try {
            await signUp!.attemptPhoneNumberVerification({
                code,
            });
            await setActive!({ session: signUp!.createdSessionId });
        } catch (error) {
            console.error("Error verifying code:", error);
            if (isClerkAPIResponseError(error)) {
                Alert.alert("Error", error.errors[0].message);
            }
        }
    }, [code, setActive, signUp]);

    const verifySignIn = useCallback(async () => {
        try {
            await signIn!.attemptFirstFactor({
                strategy: "phone_code",
                code,
            });
            await setActive!({ session: signIn!.createdSessionId });
        } catch (error) {
            console.error("Error verifying code:", error);
            if (isClerkAPIResponseError(error)) {
                Alert.alert("Error", error.errors[0].message);
            }
        }
    }, [code, setActive, signIn]);

    useEffect(() => {
        if (code.length === 6) {
            if (signInBoolean === true) {
                verifySignIn();
            } else {
                verifyCode();
            }
        }
    }, [code, verifyCode, verifySignIn, signInBoolean]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={showBottomSheet}
            snapPoints={[500]}
            animateOnMount={true}
            enablePanDownToClose
            enableOverDrag={false}
            onClose={() => setShowBottomSheet(-1)}
            style={{ flex: 1, backgroundColor: Colors.dark }}
            handleStyle={{ backgroundColor: Colors.dark }}
            handleIndicatorStyle={{ backgroundColor: Colors.gray }}
        >
            <BottomSheetView
                style={[
                    defaultStyles.container,
                    { backgroundColor: Colors.dark },
                ]}
            >
                <Text
                    style={[defaultStyles.header, { color: Colors.lightGray }]}
                >
                    6-digit code
                </Text>
                <Text style={defaultStyles.descriptionText}>
                    Code sent to <FontAwesome5 name="asterisk" size={12} />
                    <FontAwesome5 name="asterisk" size={12} />
                    <FontAwesome5 name="asterisk" size={12} />
                    <FontAwesome5 name="asterisk" size={12} />
                    <Text style={{ fontWeight: "600" }}>
                        {phoneNumber.slice(-4)}
                    </Text>{" "}
                    unless you already have an account
                </Text>

                <CodeField
                    ref={ref}
                    {...props}
                    value={code}
                    onChangeText={setCode}
                    testID="my-code-input"
                    cellCount={CELL_COUNT}
                    keyboardType="number-pad"
                    InputComponent={TextInput}
                    textContentType="oneTimeCode"
                    autoComplete={Platform.select({
                        android: "sms-otp" as const,
                        ios: "one-time-code" as const,
                        default: "one-time-code" as const,
                    })}
                    rootStyle={{
                        marginTop: 20,
                    }}
                    renderCell={({ index, symbol, isFocused }) => (
                        <Fragment key={index}>
                            <View
                                key={index}
                                onLayout={getCellOnLayoutHandler(index)}
                                style={[
                                    styles.cellRoot,
                                    isFocused && styles.focusCell,
                                ]}
                            >
                                <Text style={styles.cellText}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            </View>
                            {index === 2 ? (
                                <View
                                    key={`separator-${index}`}
                                    style={styles.separator}
                                />
                            ) : null}
                        </Fragment>
                    )}
                />
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    focusCell: {
        borderColor: "#000",
    },
    separator: {
        height: 2,
        width: 10,
        backgroundColor: Colors.gray,
        alignSelf: "center",
    },
    cellText: {
        color: "#000",
        fontSize: 36,
        textAlign: "center",
    },
    cellRoot: {
        width: 45,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
    },
});
