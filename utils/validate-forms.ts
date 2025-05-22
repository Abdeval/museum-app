import { UserCredentials } from "@/types";

// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const PASSWORD_REGEX = /[a-zA-Z0-9]{5,}/

// ! Validate email
export const validateEmail = (email: string) => {
  if (!email) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

// Validate password
export const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required";
  }
  if (!PASSWORD_REGEX.test(password)) {
    return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
  }
  return "";
};

// Validate confirm password
export const validateConfirmPassword = (confirmPassword: string, password: string) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (confirmPassword !== password) {
    return "Passwords do not match";
  }
  return "";
};

// Validate form
export const validateForm = (type: "SIGNUP" | "SIGNIN" , user: UserCredentials, setErrors: (user: UserCredentials) => void) => {
  const emailError = validateEmail(user.email);
  const passwordError = validatePassword(user.password);
  if(type === "SIGNIN"){
    setErrors({
      email: emailError,
      password: passwordError,
      // confirmPassword: confirmPasswordError,
    });
    return !emailError && !passwordError
  }else {
    const confirmPasswordError = validateConfirmPassword(user.confirmPassword as string, user.password);
    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
    return !emailError && !passwordError && !confirmPasswordError;
  }


};
