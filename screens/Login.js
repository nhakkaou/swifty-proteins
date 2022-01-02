import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, useColorScheme, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import colors from "../assets/colors";
import { logoDark, logoLight } from "../assets/icons";
import { SvgXml } from "react-native-svg";
import { AuthContext } from "../context/auth";
import axios from "axios";

const Login = ({ navigation }) => {
	const colorScheme = useColorScheme();
	const { changeAuth } = useContext(AuthContext);
	const [isSupported, setisSupported] = useState(false);

	useEffect(() => {
		if (LocalAuthentication.AuthenticationType.FINGERPRINT)
			setisSupported(true);
	}, []);

	useEffect(() => {
		const subscription = navigation.addListener("focus", () => {
			axios("https://www.google.com")
				.then((res) => {})
				.catch((er) => {
					Alert.alert("No Internet Connection");
					setisSupported(false);
				});
		});

		return () => subscription.remove();
	}, []);

	const authenticate = async () => {
		try {
			const res = await LocalAuthentication.authenticateAsync(
				LocalAuthentication.AuthenticationType.FINGERPRINT
			);
			if (res.success) {
				changeAuth(true);
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
