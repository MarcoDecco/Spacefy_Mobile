import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from 'react-native'

export default function Home() {
  return (
    <>
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-3xl text-green-800">Home</Text>
      </SafeAreaView>
    </>
  );
}