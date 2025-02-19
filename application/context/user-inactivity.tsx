import { useRef, useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";

import { useRouter } from "expo-router";
import { MMKV } from "react-native-mmkv";
import { useAuth } from "@clerk/clerk-expo";

const storage = new MMKV({
    id: "inactivity-storage",
});

export const UserInactivityProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const appState = useRef(AppState.currentState);

    const handleAppStateChange = useCallback(
        (state: AppStateStatus) => {
            if (state === "background") {
                start();
            } else if (
                state === "active" &&
                appState.current.match(/background/)
            ) {
                const elapsed =
                    Date.now() - (storage.getNumber("startTime") || 0);

                if (elapsed > 3000 && isSignedIn) {
                    router.push("/(authenticated)/(modals)/lock");
                }
            }

            appState.current = state;
        },
        [isSignedIn, router],
    );

    const start = () => {
        storage.set("startTime", Date.now());
    };

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange,
        );

        return () => {
            subscription.remove();
        };
    }, [handleAppStateChange]);

    return children;
};
