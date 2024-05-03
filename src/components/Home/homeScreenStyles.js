import { StyleSheet } from "react-native";
import colors from "../../helpers/colors";

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.commonBackground, justifyContent: "center", padding: 10 },
    scrollViewStyle: { flex: 1, backgroundColor: "#989898" },
    keyboardAvoidingView: { flex: 1, justifyContent: "center" },
    formContainer: { width: "100%", height: 400, backgroundColor: "#676767", flexDirection: "column", justifyContent: "center" },
    email: { width: "80%", height: 60, backgroundColor: "#FFFFFF", alignSelf: "center", padding: 5, margin: 2 },
    password: { width: "80%", height: 60, backgroundColor: "#FFFFFF", alignSelf: "center", padding: 5, margin: 2 },
    btn: { width: '50%', height: 50, backgroundColor: "#FFFFFF", justifyContent: "center", alignSelf: "center", alignItems: "center", marginTop: 20, fontFamily: "SFProText-Medium" }
})