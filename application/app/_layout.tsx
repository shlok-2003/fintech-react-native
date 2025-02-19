import { useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { Link, Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "react-native-reanimated";

import { UserInactivityProvider } from "@/context/user-inactivity";
import { tokenCache } from "@/lib/cache";

import Colors from "@/constants/Colors";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const InitialLayout = () => {
    const router = useRouter();
    const segments = useSegments();
    const { isLoaded, isSignedIn } = useAuth();

    const [loaded, error] = useFonts({
        SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useEffect(() => {
        if (!isLoaded || !loaded) return;
        const inAuthGroup = segments[0] === "(authenticated)";

        if (isSignedIn && !inAuthGroup) {
            router.push("/home");
        } else if (!isSignedIn) {
            router.replace("/");
        }
    }, [isSignedIn, isLoaded, router, segments, loaded]);

    if (!loaded || !isLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="(auth)/signup"
                options={{
                    title: "",
                    headerBackTitle: "",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={router.back}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={34}
                                color={Colors.dark}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="(auth)/login"
                options={{
                    title: "",
                    headerBackTitle: "",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={router.back}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={34}
                                color={Colors.dark}
                            />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <Link href="/help" asChild>
                            <TouchableOpacity activeOpacity={0.8}>
                                <Ionicons
                                    name="help-circle-outline"
                                    size={34}
                                    color={Colors.dark}
                                />
                            </TouchableOpacity>
                        </Link>
                    ),
                }}
            />
            <Stack.Screen
                name="(auth)/help"
                options={{
                    title: "Help",
                    presentation: "modal",
                    headerBackTitle: "",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={router.back}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={34}
                                color={Colors.dark}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="(authenticated)/(tabs)"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="(authenticated)/(modals)/lock"
                options={{ headerShown: false, animation: "none" }}
            />
            <Stack.Screen
                name="(authenticated)/crypto/[id]"
                options={{
                    title: "",
                    headerLeft: () => (
                        <TouchableOpacity onPress={router.back}>
                            <Ionicons
                                name="arrow-back"
                                size={34}
                                color={Colors.dark}
                            />
                        </TouchableOpacity>
                    ),
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerRight: () => (
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity>
                                <Ionicons
                                    name="notifications-outline"
                                    color={Colors.dark}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons
                                    name="star-outline"
                                    color={Colors.dark}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
        </Stack>
    );
};

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!PUBLISHABLE_KEY) {
    throw new Error(
        "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
}

export default function RootLayout() {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
            <QueryClientProvider client={queryClient}>
                <UserInactivityProvider>
                    <ClerkLoaded>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <StatusBar style="dark" />
                            <InitialLayout />
                        </GestureHandlerRootView>
                    </ClerkLoaded>
                </UserInactivityProvider>
            </QueryClientProvider>
        </ClerkProvider>
    );
}
