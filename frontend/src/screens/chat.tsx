import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from 'react-native'
import { chatStyles as styles } from '../styles/chatStyles';

export default function Chat() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Chat</Text>
      </SafeAreaView>
    </>
  );
}