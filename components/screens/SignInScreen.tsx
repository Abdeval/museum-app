
import React, { useState } from "react"
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
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as AppleAuthentication from "expo-apple-authentication"
import Animated, { FadeInDown } from "react-native-reanimated"
import { COLORS } from "@/constants/Colors"
import { validateEmail, validateForm, validatePassword } from "@/utils/validate-forms"
import { useSession } from "@/context/AuthProvider"

// Ensure WebBrowser redirects properly
WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false)
  const { signIn } = useSession();

  // ! Form validation states
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  // Check if Apple Authentication is available
  React.useEffect(() => {
    const checkAppleAuth = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync()
      setAppleAuthAvailable(isAvailable)
    }
    checkAppleAuth()
  }, [])

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID", // Replace with your actual client ID
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  })

  // todo: Handle Google sign-in response
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      // Here you would send the authentication.accessToken to your backend
      console.log("Google auth successful:", authentication)
      handleSuccessfulLogin("Google")
    }
  }, [response])

  // ! Handle login with email/password
  const handleLogin = async () => {
    if (!validateForm("SIGNIN", { email, password }, setErrors)) {
      return
    }

    setIsLoading(true)

    try {
      // todo: Here you would integrate with your authentication service
      // todo: For example, Firebase, Supabase, or your custom backend
      signIn({ email, password});
      // If successful, proceed
      handleSuccessfulLogin("Email")
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert("Login Failed", "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ! Handle Apple sign in
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      // Here you would send the credential to your backend
      console.log("Apple auth successful:", credential)
      handleSuccessfulLogin("Apple")
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        // User canceled the sign-in flow
        console.log("User canceled Apple sign in")
      } else {
        console.error("Apple sign in error:", error)
        Alert.alert("Sign In Failed", "There was a problem signing in with Apple. Please try again later.")
      }
    }
  }

  // Handle successful login
  const handleSuccessfulLogin = (method: string) => {
    console.log(`Logged in with ${method}`)
    router.replace("/home")
  }

  return (
    <ImageBackground
      source={require("@/assets/images/sign-in-image.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 bg-primary/50">
            {/* Header */}
            <View className="pt-16 pb-6 px-6">
              <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full self-start">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Form Container */}
            <Animated.View
              entering={FadeInDown.duration(800)}
              className="bg-background/95 rounded-t-3xl flex-1 px-6 pt-8 pb-6"
            >
              <Text className="text-foreground/80 text-3xl font-bold mb-2">Welcome Back</Text>
              <Text className="text-foreground/70 text-base mb-8">Sign in to continue your museum experience</Text>

              {/* Form Fields */}
              <View className="space-y-4">
                {/* Email Field */}
                <View>
                  <Text className="text-foreground/90 mb-2 font-medium">Email</Text>
                  <View
                    className={`bg-white rounded-lg px-4 py-3 flex-row items-center ${errors.email ? "border border-red-500" : ""}`}
                  >
                    <Ionicons name="mail-outline" size={20} color={COLORS.light.primary} />
                    <TextInput
                      className="flex-1 text-foreground ml-2"
                      placeholder="Enter your email"
                      placeholderTextColor={COLORS.light.icon}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text)
                        if (errors.email) {
                          setErrors({ ...errors, email: validateEmail(text) })
                        }
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={() => setErrors({ ...errors, email: validateEmail(email) })}
                    />
                  </View>
                  {errors.email ? <Text className="text-red-500 mt-1 text-xs">{errors.email}</Text> : null}
                </View>

                {/* Password Field */}
                <View>
                  <Text className="text-foreground/90 mb-2 font-medium">Password</Text>
                  <View
                    className={`bg-white rounded-lg px-4 py-3 flex-row items-center ${errors.password ? "border border-red-500" : ""}`}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.light.primary} />
                    <TextInput
                      className="flex-1 text-foreground ml-2"
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.light.icon}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text)
                        if (errors.password) {
                          setErrors({ ...errors, password: validatePassword(text) })
                        }
                      }}
                      secureTextEntry={!showPassword}
                      onBlur={() => setErrors({ ...errors, password: validatePassword(password) })}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="rgba(255, 255, 255, 0.7)"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password ? <Text className="text-red-500 mt-1 text-xs">{errors.password}</Text> : null}
                </View>

                {/* Forgot Password */}
                <TouchableOpacity className="self-end" onPress={() => console.log("Forgot password")}>
                  <Text className="text-primary">Forgot Password?</Text>
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
                    <Text className="text-primary-foreground text-center font-bold text-base">Sign In</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-white/20" />
                  <Text className="text-foreground/60 mx-4">or continue with</Text>
                  <View className="flex-1 h-[1px] bg-white/20" />
                </View>

                {/* Social Login Options */}
                <View className="flex-row justify-center space-x-4">
                  {/* Google Login */}
                  <TouchableOpacity
                    className="bg-white p-4 rounded-full"
                    onPress={() => promptAsync()}
                    disabled={!request}
                  >
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                  </TouchableOpacity>

                  {/* Apple Login */}
                  {appleAuthAvailable && (
                    <TouchableOpacity className="bg-white p-4 rounded-full" onPress={handleAppleSignIn}>
                      <Ionicons name="logo-apple" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Don't have an account */}
                <View className="flex-row justify-center mt-6">
                  <Text className="text-foreground/70">Don{"'"}t have an account? </Text>
                  <TouchableOpacity onPress={() => router.push("/sign-up")}>
                    <Text className="text-primary font-medium">Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
