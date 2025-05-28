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
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@/i18n";
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// console.disableYellowBox = true;

// ! configure Google Sign-In
// GoogleSignin.configure({
//   offlineAccess: true,
//   iosClientId: "383898926660-2nmio2r5vifq2nmene4c5oq4d25gmr91.apps.googleusercontent.com",
//   webClientId: "383898926660-2f02cdkjgnllc1n6qa0cjj59ga8g4s78.apps.googleusercontent.com"
// });


export default function RootLayout() {
  // useInitialAndroidBarSync();
  const { colorScheme } = useColorScheme();
  const queryClient = new QueryClient();
   
  console.log('theme: ', colorScheme);
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
        style={colorScheme}
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
