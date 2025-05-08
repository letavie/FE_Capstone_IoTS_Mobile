import {
  BaseToast,
  ErrorToast,
  SuccessToast,
  InfoToast,
  BaseToastProps,
} from "react-native-toast-message";
import { StyleSheet } from "react-native";

const toastStyles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff", // Matching the website's backgroundColor: #ffffff
    borderRadius: 8, // Matching the website's borderRadius: 8px
    borderWidth: 1,
    borderColor: "#f0f0f0", // Matching the website's border: 1px solid #f0f0f0
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10, // Matching the website's boxShadow: 0px 4px 10px rgba(0, 0, 0, 0.1)
    width: 350, // Matching the website's width: 350px
    marginHorizontal: 20, // Ensure it fits well on mobile screens
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  text2: {
    fontSize: 14,
    color: "#333333",
  },
});

export const toastConfig = {
  success: (
    props: BaseToastProps // Add type for props
  ) => (
    <SuccessToast
      {...props}
      style={toastStyles.container}
      text1Style={toastStyles.text1}
      text2Style={toastStyles.text2}
    />
  ),
  error: (
    props: BaseToastProps // Add type for props
  ) => (
    <ErrorToast
      {...props}
      style={toastStyles.container}
      text1Style={toastStyles.text1}
      text2Style={toastStyles.text2}
    />
  ),
  info: (
    props: BaseToastProps // Add type for props
  ) => (
    <InfoToast
      {...props}
      style={toastStyles.container}
      text1Style={toastStyles.text1}
      text2Style={toastStyles.text2}
    />
  ),
  warning: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={[toastStyles.container, { borderLeftColor: "orange" }]}
      text1Style={toastStyles.text1}
      text2Style={toastStyles.text2}
    />
  ),
};
