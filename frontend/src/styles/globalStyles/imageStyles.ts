import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const imageStyles = StyleSheet.create ({
    profileImageContainer: {
        marginTop: -70,
        marginBottom: 30,
        borderRadius: 100,
        backgroundColor: colors.white,
        padding: 6,
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
      },
    
      profileImage: {
        width: 90,
        height: 90,
      },
})
