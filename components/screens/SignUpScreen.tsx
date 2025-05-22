import { COLORS } from "@/constants/Colors"
import { auth } from "@/lib/api/axios-instance"
import { UserCredentials } from "@/types"
import { validateConfirmPassword, validateEmail, validateForm, validatePassword } from "@/utils/validate-forms"
import { Ionicons } from "@expo/vector-icons"
import * as AppleAuthentication from "expo-apple-authentication"
import * as Google from "expo-auth-session/providers/google"
import { useRouter } from "expo-router"
import * as WebBrowser from "expo-web-browser"
import React, { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

// Ensure WebBrowser redirects properly
WebBrowser.maybeCompleteAuthSession()

export default function SignUpScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false)

  // Form validation states
  const [errors, setErrors] = useState<UserCredentials>({
    email: "",
    password: "",
    confirmPassword: "",
  })

  // todo: Check if Apple Authentication is available
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
  });

  // Handle Google sign-in response
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      // Here you would send the authentication.accessToken to your backend
      // to create a user account or sign in the user
      console.log("Google auth successful:", authentication)
      handleSuccessfulSignUp("Google")
    }
  }, [response])

 

  // ! Handle sign up with email/password
  const handleSignUp = async () => {
    if (!validateForm({ email, password, confirmPassword }, setErrors)) {
      return
    }
    
    setIsLoading(true)

    try {
      console.log("before...", email, password, name);
      // ! Here you would integrate with your authentication service
      //  ! For example, Firebase, Supabase, or your custom backend
      const res = await auth.post('/signup', { email, password, name });
      console.log(res);
      // ! If successful, proceed
      handleSuccessfulSignUp("Email")
    } catch (error) {
      console.error("Sign up error:", error)
      Alert.alert("Sign Up Failed", "There was a problem creating your account. Please try again later.")
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

      // ! Here you would send the credential to your backend
      console.log("Apple auth successful:", credential)
      handleSuccessfulSignUp("Apple")
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

  // ! Handle successful sign up
  const handleSuccessfulSignUp = (method: string) => {
    Alert.alert("Account Created", `Your account has been successfully created with ${method}!`, [
      {
        text: "Continue",
        onPress: () => router.replace("/"),
      },
    ])
  }

  return (
    <ImageBackground
      source={require("@/assets/images/sign-in-image.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 bg-primary/40">
            {/* Header */}
            <View className="pt-16 pb-6 px-6">
              <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full self-start">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Form Container */}
            <Animated.View
              entering={FadeInDown.duration(800)}
              className="bg-background rounded-t-3xl flex-1 px-6 pt-8 pb-6"
            >
              <Text className="text-foreground/80 text-3xl font-bold mb-2">Create Account</Text>
              <Text className="text-foreground/70 text-base mb-8">
                Join AMUSE to explore our exhibits and get personalized recommendations
              </Text>

              {/* Form Fields */}
              <View className="space-y-4">
                {/* Email Field */}
                <View>
                  <Text className="text-foreground/90 mb-2 font-medium">Email</Text>
                  <View
                    className={`bg-primary-foreground rounded-[12px] px-4 py-3 flex-row items-center ${errors.email ? "border border-red-500" : ""}`}
                  >
                    <Ionicons name="mail-outline" size={20} color={COLORS.light.primary} />
                    <TextInput
                      className="flex-1 text-foreground ml-2"
                      placeholder="Enter your email"
                      placeholderTextColor={COLORS.light.icon}                value={email}
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

                {/* Name Field (Optional) */}
                <View>
                  <Text className="text-foreground/90 mb-2 font-medium">Name (Optional)</Text>
                  <View className="bg-primary-foreground rounded-lg
                   px-4 py-3 flex-row items-center">
                    <Ionicons name="person-outline" size={20} color={COLORS.light.primary} />
                    <TextInput
                      className="flex-1 text-foreground ml-2"
                      placeholder="Enter your name"
                      placeholderTextColor={COLORS.light.icon}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View>
                  <Text className="text-foreground/90 mb-2 font-medium">Password</Text>
                  <View
                    className={`bg-primary-foreground rounded-lg
                       px-4 py-3 flex-row items-center ${errors.password ? "border border-red-500" : ""}`}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.light.primary} />
                    <TextInput
                      className="flex-1 text-foreground ml-2"
                      placeholder="Create a password"
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
                        color={COLORS.light.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password ? <Text className="text-red-500 mt-1 text-xs">{errors.password}</Text> : null}
                </View>

                {/* Confirm Password Field */}
                <View>
                  <Text className="text-foreground/90 mb-2 font-medium">Confirm Password</Text>
                  <View
                    className={`bg-primary-foreground rounded-lg
                       px-4 py-3 flex-row items-center ${errors.confirmPassword ? "border border-red-500" : ""}`}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.light.primary} />
                    <TextInput
                      className="flex-1 text-foreground ml-2"
                      placeholder="Confirm your password"
                      placeholderTextColor={COLORS.light.icon}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text)
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: validateConfirmPassword(text, password) })
                        }
                      }}
                      secureTextEntry={!showConfirmPassword}
                      onBlur={() => setErrors({ ...errors, confirmPassword: validateConfirmPassword(confirmPassword, password) })}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={COLORS.light.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword ? (
                    <Text className="text-red-500 mt-1 text-xs">{errors.confirmPassword}</Text>
                  ) : null}
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  className="bg-primary py-4 rounded-lg mt-4"
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.light.background} />
                  ) : (
                    <Text className="text-primary-foreground text-center font-bold text-base">Create Account</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-foreground" />
                  <Text className="text-foreground/60 mx-4">or continue with</Text>
                  <View className="flex-1 h-[1px] bg-foreground" />
                </View>

                {/* Social Sign Up Options */}
                <View className="flex-row justify-center space-x-4">
                  {/* Google Sign Up */}
                  <TouchableOpacity
                    className="bg-primary-foreground p-4 rounded-full"
                    onPress={() => promptAsync()}
                    disabled={!request}
                  >
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                  </TouchableOpacity>

                  {/* Apple Sign Up */}
                  {appleAuthAvailable && (
                    <TouchableOpacity className="bg-secondary p-4 rounded-full" onPress={handleAppleSignIn}>
                      <Ionicons name="logo-apple" size={24} color={"black"} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Already have an account */}
                <View className="flex-row justify-center mt-6">
                  <Text className="text-foreground/70">Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.push("/sign-in")}>
                    <Text className="text-primary font-medium">Sign In</Text>
                  </TouchableOpacity>
                </View>

                {/* Terms and Privacy */}
                <Text className="text-foreground text-xs text-center mt-6">
                  By signing up, you agree to our{" "}
                  <Text className="text-primary" onPress={() => console.log("Terms pressed")}>
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text className="text-primary" onPress={() => console.log("Privacy pressed")}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
