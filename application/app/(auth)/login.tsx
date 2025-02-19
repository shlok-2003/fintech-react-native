import { useState } from "react";
import {
    Text,
    View,
    Alert,
    Keyboard,
    Platform,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSignIn } from "@clerk/clerk-expo";

import Sheet from "@/components/login-otp-bottom-sheet";

import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

import { isClerkAPIResponseError } from "@clerk/clerk-expo";

enum SignInType {
    Phone,
    Email,
    Google,
    Apple,
}

const PHONE_LENGTH = 7;
const COUNTRY_CODE_LENGTH = 1;

export default function Login() {
    const { signIn } = useSignIn();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [showBottomSheet, setShowBottomSheet] = useState<-1 | 0>(-1);

    const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

    const onSignIn = async (type: SignInType) => {
        if (type === SignInType.Phone) {
            if (!countryCode) return;

            Keyboard.dismiss();

            try {
                const phone_number = `+${countryCode}${phoneNumber}`;

                const { supportedFirstFactors } = await signIn!.create({
                    identifier: phone_number,
                });

                const firstPhoneFactor = supportedFirstFactors!.find(
                    (factor) => factor.strategy === "phone_code",
                )!;
                const { phoneNumberId } = firstPhoneFactor;

                await signIn!.prepareFirstFactor({
                    strategy: "phone_code",
                    phoneNumberId,
                });

                setShowBottomSheet(0);
            } catch (error) {
                console.error(error);
                if (
                    isClerkAPIResponseError(error) &&
                    error.errors[0].code === "form_identifier_not_found"
                ) {
                    Alert.alert("Error", error.errors[0].message);
                }
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Welcome Back</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter the phone number associated with your account
                </Text>

                <View
                    style={{
                        marginVertical: 40,
                        flexDirection: "row",
                        gap: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: Colors.lightGray,
                            borderRadius: 16,
                            overflow: "hidden",
                        }}
                    >
                        <View
                            style={{
                                paddingVertical: 20,
                                paddingLeft: 10,
                                zIndex: 1,
                            }}
                        >
                            <Text style={{ color: Colors.dark, fontSize: 20 }}>
                                +
                            </Text>
                        </View>

                        <TextInput
                            style={{
                                width: 55,
                                paddingVertical: 20,
                                paddingRight: 10,
                                fontSize: 20,
                                marginRight: 10,
                            }}
                            keyboardType="number-pad"
                            placeholder="91"
                            placeholderTextColor={Colors.gray}
                            value={`${countryCode}`}
                            onChangeText={(text) => {
                                const cleaned = text.replace(/[^0-9]/g, "");
                                setCountryCode(cleaned);
                            }}
                            maxLength={4}
                            numberOfLines={1}
                        />
                    </View>
                    <TextInput
                        style={{
                            flex: 1,
                            padding: 20,
                            fontSize: 20,
                            marginRight: 10,
                            borderRadius: 16,
                            backgroundColor: Colors.lightGray,
                        }}
                        keyboardType="phone-pad"
                        placeholder="Mobile Number"
                        placeholderTextColor={Colors.gray}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={11}
                        numberOfLines={1}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        defaultStyles.pillButton,
                        { marginBottom: 20 },
                        phoneNumber.length >= PHONE_LENGTH &&
                        countryCode.length >= COUNTRY_CODE_LENGTH
                            ? styles.enabled
                            : styles.disabled,
                    ]}
                    activeOpacity={0.8}
                    disabled={
                        phoneNumber.length < PHONE_LENGTH ||
                        countryCode.length < COUNTRY_CODE_LENGTH
                    }
                    onPress={() => onSignIn(SignInType.Phone)}
                >
                    <Text style={defaultStyles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            height: StyleSheet.hairlineWidth,
                            backgroundColor: Colors.gray,
                        }}
                    />
                    <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
                    <View
                        style={{
                            flex: 1,
                            height: StyleSheet.hairlineWidth,
                            backgroundColor: Colors.gray,
                        }}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => onSignIn(SignInType.Email)}
                    style={[
                        defaultStyles.pillButton,
                        {
                            flexDirection: "row",
                            gap: 16,
                            marginTop: 20,
                            backgroundColor: "#fff",
                        },
                    ]}
                >
                    <Ionicons name="mail" size={24} color={"#000"} />
                    <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
                        Continue with email{" "}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onSignIn(SignInType.Google)}
                    style={[
                        defaultStyles.pillButton,
                        {
                            flexDirection: "row",
                            gap: 16,
                            marginTop: 20,
                            backgroundColor: "#fff",
                        },
                    ]}
                >
                    <Ionicons name="logo-google" size={24} color={"#000"} />
                    <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
                        Continue with Google{" "}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onSignIn(SignInType.Apple)}
                    style={[
                        defaultStyles.pillButton,
                        {
                            flexDirection: "row",
                            gap: 16,
                            marginTop: 20,
                            backgroundColor: "#fff",
                        },
                    ]}
                >
                    <Ionicons name="logo-apple" size={24} color={"#000"} />
                    <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
                        Continue with Apple{" "}
                    </Text>
                </TouchableOpacity>
            </View>

            {showBottomSheet === 0 && (
                <Sheet
                    phoneNumber={phoneNumber}
                    signInBoolean={true}
                    showBottomSheet={showBottomSheet}
                    setShowBottomSheet={setShowBottomSheet}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
    },
});
