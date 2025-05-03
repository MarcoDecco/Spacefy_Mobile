// Tela de Chat
import { Text, SafeAreaView } from "react-native";
import { chatStyles } from "../styles/ChatStyles";

export default function Chat() {
    return (
        <SafeAreaView style={chatStyles.container}>
            <Text style={chatStyles.title}>Chat</Text>
        </SafeAreaView>
    )
}