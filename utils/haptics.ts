import * as Haptics from "expo-haptics"

// Function to provide haptic feedback
export const vibrate = (type: "success" | "error" | "light" = "success") => {
  try {
    switch (type) {
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        break
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        break
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        break
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
  } catch (error) {
    console.log("Haptics not supported on this device")
  }
}
