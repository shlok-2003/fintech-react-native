import { Text, View, TouchableOpacity } from "react-native";

import { Link } from "expo-router";
import { useAssets } from "expo-asset";
import { VideoView, useVideoPlayer } from "expo-video";

import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

export default function Index() {
    const [assets, error] = useAssets([require("@/assets/videos/intro.mp4")]);

    const source = assets ? assets[0].uri : null;

    const player = useVideoPlayer(source, (player) => {
        player.play();
        player.muted = true;
        player.loop = true;
    });

    if (error) {
        return null;
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "space-between",
            }}
        >
            <VideoView
                player={player}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                }}
                contentFit="cover"
                nativeControls={false}
            />

            <View style={{ marginTop: 80, padding: 20 }}>
                <Text
                    style={{
                        fontSize: 36,
                        color: "white",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        textShadowRadius: 3,
                        textShadowColor: "black",
                        textShadowOffset: { width: 2, height: 2 },
                    }}
                >
                    Ready to change the way you money?
                </Text>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 20,
                    marginBottom: 60,
                    paddingHorizontal: 20,
                }}
            >
                <Link
                    href="/login"
                    style={[
                        defaultStyles.pillButton,
                        {
                            flex: 1,
                            backgroundColor: Colors.dark,
                        },
                    ]}
                    asChild
                >
                    <TouchableOpacity activeOpacity={0.8}>
                        <Text
                            style={{
                                color: "white",
                                fontSize: 22,
                                fontWeight: "500",
                            }}
                        >
                            Log in
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link
                    href="/signup"
                    style={[
                        defaultStyles.pillButton,
                        {
                            flex: 1,
                            backgroundColor: "#ffffff",
                        },
                    ]}
                    asChild
                >
                    <TouchableOpacity activeOpacity={0.8}>
                        <Text style={{ fontSize: 22, fontWeight: "500" }}>
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
