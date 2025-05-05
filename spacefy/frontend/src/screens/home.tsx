//Tela Home
import SearchBar from "../components/searchBar";
import Card from "../components/card"

import { ScrollView } from "react-native";

export default function Home() {
  return (
    <ScrollView>
      <SearchBar />
      <Card />
    </ScrollView>
  );
}