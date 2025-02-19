import { useState } from "react";
import {
    Text,
    View,
    Keyboard,
    Platform,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";

import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";

import Sheet from "@/components/login-otp-bottom-sheet";

import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const PHONE_LENGTH = 7;
const COUNTRY_CODE_LENGTH = 1;

export default function SignUp() {
    const { signUp } = useSignUp();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [showBottomSheet, setShowBottomSheet] = useState<-1 | 0>(-1);

    const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

    const onSignUp = async () => {
        if (!countryCode) return;

        console.log(`+${countryCode}${phoneNumber}`);
        const phone_number = `+${countryCode}${phoneNumber}`;
        try {
            Keyboard.dismiss();
            await new Promise((resolve) => setTimeout(resolve, 200)); // For the keyboard to dismiss

            await signUp!.create({
                phoneNumber: phone_number,
            });
            await signUp!.preparePhoneNumberVerification();

            setShowBottomSheet(0);
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Let's get started!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your phone number. We will send you a confirmation
                    code there
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
                        onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9]/g, "");
                            setPhoneNumber(cleaned);
                        }}
                        maxLength={11}
                        numberOfLines={1}
                    />
                </View>

                <Link href={"/login"} replace asChild>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text style={defaultStyles.textLink}>
                            Already have an account? Log in
                        </Text>
                    </TouchableOpacity>
                </Link>

                <View style={{ flex: 1 }} />

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
                    onPress={onSignUp}
                >
                    <Text style={defaultStyles.buttonText}>Sign up</Text>
                </TouchableOpacity>
            </View>

            {showBottomSheet === 0 && (
                <Sheet
                    phoneNumber={phoneNumber}
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
