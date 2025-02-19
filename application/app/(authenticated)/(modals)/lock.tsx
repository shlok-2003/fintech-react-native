import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";

export default function LockScreen() {
    const router = useRouter();
    const { user } = useUser();

    const codeLength = Array(6).fill(0);
    const [code, setCode] = useState<number[]>([]);

    const offset = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        };
    });

    const TIME = 80;
    const OFFSET = 20;

    useEffect(() => {
        if (code.length === 6) {
            if (code.join("") === "111111") {
                router.replace("/(authenticated)/(tabs)/home");
                setCode([]);
            } else {
                offset.value = withSequence(
                    withTiming(-OFFSET, { duration: TIME / 2 }),
                    withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
                    withTiming(0, { duration: TIME / 2 }),
                );
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error,
                );
                setCode([]);
            }
        }
    }, [code, offset, router]);

    const onNumberPress = (number: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode([...code, number]);
    };

    const numberBackspace = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCode(code.slice(0, -1));
    };

    const onBiometricAuthPress = async () => {
        const { success } = await LocalAuthentication.authenticateAsync();
        if (success) {
            router.replace("/(authenticated)/(tabs)/home");
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <SafeAreaView>
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginTop: 80,
                    alignSelf: "center",
                }}
            >
                Welcome back, {user?.firstName}
            </Text>

            <Animated.View
                style={[
                    {
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 20,
                        marginVertical: 100,
                    },
                    style,
                ]}
            >
                {codeLength.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            { width: 20, height: 20, borderRadius: 10 },
                            {
                                backgroundColor: code[index]
                                    ? Colors.primary
                                    : Colors.lightGray,
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            <View
                style={{
                    marginHorizontal: 80,
                    gap: 60,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {[1, 2, 3].map((number) => (
                        <TouchableOpacity
                            key={number}
                            onPress={() => onNumberPress(number)}
                        >
                            <Text style={{ fontSize: 32 }}>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {[4, 5, 6].map((number) => (
                        <TouchableOpacity
                            key={number}
                            onPress={() => onNumberPress(number)}
                        >
                            <Text style={{ fontSize: 32 }}>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {[7, 8, 9].map((number) => (
                        <TouchableOpacity
                            key={number}
                            onPress={() => onNumberPress(number)}
                        >
                            <Text style={{ fontSize: 32 }}>{number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity onPress={onBiometricAuthPress}>
                        <MaterialCommunityIcons
                            name="face-recognition"
                            size={26}
                            color="black"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onNumberPress(0)}>
                        <Text style={{ fontSize: 32 }}>0</Text>
                    </TouchableOpacity>

                    <View style={{ minWidth: 30 }}>
                        {code.length > 0 && (
                            <TouchableOpacity onPress={numberBackspace}>
                                <Text style={{ fontSize: 32 }}>
                                    <MaterialCommunityIcons
                                        name="backspace-outline"
                                        size={26}
                                        color="black"
                                    />
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <Text
                    style={{
                        alignSelf: "center",
                        color: Colors.primary,
                        fontWeight: "500",
                        fontSize: 18,
                    }}
                >
                    Forgot your passcode?
                </Text>
            </View>
        </SafeAreaView>
    );
}
