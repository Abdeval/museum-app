import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/constants/Colors";
import {
  validateEmail,
  validateForm,
  validatePassword,
} from "@/utils/validate-forms";
import { useSession } from "@/context/AuthProvider";
import LRView from "../ui/LRView";
import TransText from "../ui/TransText";
import { useTranslation } from "react-i18next";
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";

// Ensure WebBrowser redirects properly
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSession();
  const { t, i18n } = useTranslation();
  // ! Form validation states
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Check if Apple Authentication is available
  // React.useEffect(() => {
  //   const checkAppleAuth = async () => {
  //     const isAvailable = await AppleAuthentication.isAvailableAsync();
  //     // setAppleAuthAvailable(isAvailable);
  //   };
  //   checkAppleAuth();
  // }, []);

  // Google Auth setup
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "383898926660-2f02cdkjgnllc1n6qa0cjj59ga8g4s78.apps.googleusercontent.com", // Replace with your actual client ID
  //   iosClientId:
  //     "383898926660-2nmio2r5vifq2nmene4c5oq4d25gmr91.apps.googleusercontent.com",
  //   androidClientId:
  //     "383898926660-g8mlcvancgq95cam4bdpv5gpss2e67n0.apps.googleusercontent.com",
  //   webClientId:
  //     "383898926660-2f02cdkjgnllc1n6qa0cjj59ga8g4s78.apps.googleusercontent.com",
  // });

  // // todo: Handle Google sign-in response
  // React.useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     // Here you would send the authentication.accessToken to your backend
  //     console.log("Google auth successful:", authentication);
  //     handleSuccessfulLogin("Google");
  //   }
  // }, [response]);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        // setState({ userInfo: response.data.user });
        console.log("Google auth successful:", response.data.user);
      } else {
        // sign in was cancelled by user
        console.log("you've canceled the process of logging...");
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        console.log(error);
        // an error that's not related to google sign in occurred
      }
    }
  };

  // ! Handle login with email/password
  const handleLogin = async () => {
    if (!validateForm("SIGNIN", { email, password }, setErrors)) {
      return;
    }

    setIsLoading(true);

    try {
      // todo: Here you would integrate with your authentication service
      // todo: For example, Firebase, Supabase, or your custom backend
      signIn({ email, password });
      // If successful, proceed
      handleSuccessfulLogin("Email");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ! Handle Apple sign in
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Here you would send the credential to your backend
      console.log("Apple auth successful:", credential);
      handleSuccessfulLogin("Apple");
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        // User canceled the sign-in flow
        console.log("User canceled Apple sign in");
      } else {
        console.error("Apple sign in error:", error);
        Alert.alert(
          "Sign In Failed",
          "There was a problem signing in with Apple. Please try again later."
        );
      }
    }
  };

  // Handle successful login
  const handleSuccessfulLogin = (method: string) => {
    console.log(`Logged in with ${method}`);
    router.replace("/home");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/sign-in-image.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 bg-primary/50 dark:bg-black/50">
            {/* Header */}
            <LRView className="pt-16 pb-6 px-6">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-white/20 p-2 rounded-full self-start"
              >
                <Ionicons
                  name={i18n.language === "ar" ? "arrow-forward" : "arrow-back"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </LRView>

            {/* Form Container */}
            <Animated.View
              entering={FadeInDown.duration(800)}
              className="bg-background/95 rounded-t-3xl flex-1 px-6 pt-8 pb-6"
            >
              <LRView>
                <TransText
                  title="signIn.title"
                  className="text-foreground/80 text-3xl font-bold mb-2"
                />
              </LRView>
              <LRView>
                <TransText
                  title="signIn.description"
                  className="text-foreground/70 text-base mb-8"
                />
              </LRView>
              {/* Form Fields */}
              <View className="space-y-4">
                {/* Email Field */}
                <View>
                  <LRView>
                    <TransText
                      title="user.email"
                      className="text-foreground/90 mb-2 font-medium"
                    />
                  </LRView>

                  <LRView
                    className={`bg-white gap-2 dark:bg-black rounded-lg px-4 py-3 items-center ${errors.email ? "border border-red-500" : ""}`}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS.light.primary}
                    />
                    <TextInput
                      className="flex-1 text-foreground ml-2"
                      placeholder={t("inputs.email.placeHolder")}
                      placeholderTextColor={COLORS.light.icon}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (errors.email) {
                          setErrors({ ...errors, email: validateEmail(text) });
                        }
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={() =>
                        setErrors({ ...errors, email: validateEmail(email) })
                      }
                    />
                  </LRView>
                  {errors.email ? (
                    <Text className="text-red-500 mt-1 text-xs">
                      {errors.email}
                    </Text>
                  ) : null}
                </View>

                {/* Password Field */}
                <View>
                  <LRView>
                    <TransText
                      title="user.password"
                      className="text-foreground/90 mb-2 font-medium"
                    />
                  </LRView>
                  <LRView
                    className={`justify-between bg-white dark:bg-black rounded-lg px-4 py-3  items-center ${errors.password ? "border border-red-500" : ""}`}
                  >
                    <LRView className="items-center gap-2">
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={COLORS.light.primary}
                      />
                      <TextInput
                        className="text-foreground"
                        placeholder={t("inputs.password.placeHolder")}
                        placeholderTextColor={COLORS.light.icon}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          if (errors.password) {
                            setErrors({
                              ...errors,
                              password: validatePassword(text),
                            });
                          }
                        }}
                        secureTextEntry={!showPassword}
                        onBlur={() =>
                          setErrors({
                            ...errors,
                            password: validatePassword(password),
                          })
                        }
                      />
                    </LRView>
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="rgba(255, 255, 255, 0.7)"
                      />
                    </TouchableOpacity>
                  </LRView>
                  {errors.password ? (
                    <Text className="text-red-500 mt-1 text-xs">
                      {errors.password}
                    </Text>
                  ) : null}
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  className="self-end"
                  onPress={() => console.log("Forgot password")}
                >
                  <LRView>
                    <TransText
                      title="signIn.forgetPassword"
                      className="text-primary"
                    />
                  </LRView>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  className="bg-primary py-4 rounded-lg mt-4"
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <TransText
                      title="signIn.button"
                      className="text-primary-foreground text-center font-bold text-base"
                    />
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-foreground/20" />
                  <TransText
                    title="signIn.continue"
                    className="text-foreground/60 mx-4"
                  />
                  <View className="flex-1 h-[1px] bg-foreground/20" />
                </View>

                {/* Social Login Options */}
                <View className="flex-row justify-center space-x-4">
                  {/* Google Login */}
                  <TouchableOpacity
                    className="bg-primary-foreground dark:bg-black p-4 rounded-full"
                    onPress={signInWithGoogle}
                    // disabled={!request}
                  >
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                  </TouchableOpacity>

                  {/* Apple Login */}
                  {/* {appleAuthAvailable && (
                    <TouchableOpacity
                      className="bg-white p-4 rounded-full"
                      onPress={handleAppleSignIn}
                    >
                      <Ionicons name="logo-apple" size={24} color="white" />
                    </TouchableOpacity>
                  )} */}
                </View>

                {/* Don't have an account */}
                <LRView className="justify-center mt-6">
                  <TransText
                    title="signIn.noAccount"
                    className="text-foreground/70"
                  />
                  <TouchableOpacity onPress={() => router.push("/sign-up")}>
                    <TransText
                      title="signUp.button"
                      className="text-primary font-medium"
                    />
                  </TouchableOpacity>
                </LRView>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
