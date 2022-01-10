import React, { useEffect, useContext, useRef } from "react";
import { AppState } from "react-native";
import Navigator from "./navigator/Navigator";
import {
	useFonts,
	Montserrat_700Bold,
	Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";
import { AuthContext, AuthProvider } from "./context/auth";

export default function App() {
	const [loadFonts] = useFonts({
		Regular: Montserrat_400Regular,
		Bold: Montserrat_700Bold,
	});

	if (!loadFonts) return <AppLoading />;

	return (
		<AuthProvider>
			<Navigator />
		</AuthProvider>
	);
}
