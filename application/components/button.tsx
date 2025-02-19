import {
    Text,
    View,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";

interface ButtonProps extends TouchableOpacityProps {
    icon: typeof Ionicons.defaultProps;
    text: string;
}

export default function Button({ icon, text, onPress }: ButtonProps) {
    return (
        <TouchableOpacity
            style={{
                alignItems: "center",
                gap: 10,
            }}
            onPress={onPress}
        >
            <View
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: Colors.lightGray,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Ionicons name={icon} size={30} color={Colors.dark} />
            </View>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: Colors.dark,
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
}
