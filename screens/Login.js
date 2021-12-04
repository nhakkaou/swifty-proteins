import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	useColorScheme,
	Image,
	Alert,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import colors from "../assets/colors";
import { logoDark, logoLight } from "../assets/icons";
import { SvgXml } from "react-native-svg";

const Login = ({ navigation }) => {
	const colorScheme = useColorScheme();
	const [isSupported, setisSupported] = useState(false);

	useEffect(() => {
		if (LocalAuthentication.AuthenticationType.FINGERPRINT)
			setisSupported(true);
	}, []);

	const authenticate = async () => {
		try {
			const res = await LocalAuthentication.authenticateAsync(
				LocalAuthentication.AuthenticationType.FINGERPRINT
			);
			if (res.success) {
				navigation.navigate("Home");
			} else {
				Alert.alert("Authentication failed");
			}
		} catch (err) {
			Alert.alert("Authentication failed");
		}
	};

	const styles = StyleSheet.create({
		bg: {
			backgroundColor: colors[colorScheme].background,
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		login_button: {
			width: 160,
			height: 40,
			backgroundColor: colors[colorScheme].primary,
			borderRadius: 20,
			marginTop: 30,
			justifyContent: "center",
			alignItems: "center",
		},
		button_text: {
			color: colors[colorScheme].text,
			fontFamily: "Bold",
		},
	});

	return (
		<View style={styles.bg}>
			<SafeAreaView style={styles.bg}>
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				{/* <Image source={colorScheme === "dark" ? logoDark : logoLight} /> */}
				<SvgXml xml={colorScheme === "dark" ? logoDark : logoLight} />
				{isSupported ? (
					<TouchableOpacity style={styles.login_button} onPress={authenticate}>
						<Text style={styles.button_text}>Login</Text>
					</TouchableOpacity>
				) : (
					<></>
				)}
			</SafeAreaView>
		</View>
	);
};

export default Login;
