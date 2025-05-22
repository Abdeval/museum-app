// @@iconify-code-gen
import { NAV_THEME } from "@/theme";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/lib/useColorScheme";
import { SessionProvider } from "@/context/AuthProvider";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import "@/i18n";

// console.disableYellowBox = true;

export default function RootLayout() {
  // useInitialAndroidBarSync();
  const { colorScheme } = useColorScheme();
  const queryClient = new QueryClient();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    Regular: require("@/assets/fonts/Poppins-Regular.ttf"),
    Medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    semibold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    Bold: require("@/assets/fonts/Poppins-Bold.ttf"),
    Italic: require("@/assets/fonts/Poppins-Italic.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar
        // key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
        // style={isDarkColorScheme ? "light" : "dark"}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <SessionProvider>
                <Slot />
                <StatusBar style="auto" />
              </SessionProvider>
            </NavThemeProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </>
  );
}
