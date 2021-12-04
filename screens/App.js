import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "./navigator/Navigator";
import {
	useFonts,
	Montserrat_700Bold,
	Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";

export default function App() {
	const [loadFonts] = useFonts({
		Regular: Montserrat_400Regular,
		Bold: Montserrat_700Bold,
	});

	if (!loadFonts) return <AppLoading />;

	return <Navigator />;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
