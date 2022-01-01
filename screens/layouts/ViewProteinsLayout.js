import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
	StatusBar as RNStatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import Feather from "react-native-vector-icons/Feather";
import { logoSmallDark, logoSmallLight } from "../../assets/icons";
import colors from "../../assets/colors";
import useOrientation from "../../hooks/useOrientation";
import { StatusBar } from "expo-status-bar";
import { captureScreen } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
Feather.loadFont();

const ViewProteinsLayout = ({ navigation, setMod, setZoom, children }) => {
	const colorScheme = useColorScheme();
	const orientation = useOrientation();

	const styles = StyleSheet.create({
		background: {
			flex: 1,
			backgroundColor: colors[colorScheme].background,
		},
		header: {
			paddingHorizontal: 21,
			paddingTop: 50,
			paddingBottom: 25,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			zIndex: 1,
			backgroundColor: colors[colorScheme].background,
		},
		button: {
			backgroundColor: colors[colorScheme].lightBackground,
			width: 50,
			height: 50,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 25,
			flexDirection: "row",
		},
		buttons_group: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			height: 50,
			backgroundColor: colors[colorScheme].lightBackground,
			borderRadius: 25,
		},
		buttons_group_item: {
			marginHorizontal: 10,
			fontFamily: "Bold",
			fontSize: 20,
			color: colors[colorScheme].primary,
		},
		qalb: {
			width: 50,
			height: 50,
		},
		content: {
			backgroundColor: "black",
			flex: 1,
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 0,
		},
		footer: {
			paddingHorizontal: 21,
			paddingVertical: 21,
			flexDirection: "row",
			justifyContent: "space-between",
			position: "absolute",
			bottom: 0,
			left: 0,
			zIndex: 1,
			backgroundColor: colors[colorScheme].background,
			width: "100%",
		},
		spinner: {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: [{ translateX: -10 }],
		},
	});

	const styles_landscape = StyleSheet.create({
		go_back: {
			position: "absolute",
			top: 20,
			left: 20,
			zIndex: 1,
		},
	});

	const snapshot = async () => {
		try {
			let uri = await captureScreen({
				format: "jpg",
				quality: 0.8,
			});
			await Sharing.shareAsync(uri, { dialogTitle: "Share this image" });
			let result = await MediaLibrary.requestPermissionsAsync(true);
			if (result.status === "granted") {
				let r = await MediaLibrary.saveToLibraryAsync(uri);
				console.log(r);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<View style={styles.background}>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				{orientation === "portrait" ? (
					<View style={styles.header}>
						<TouchableOpacity
							style={styles.button}
							onPress={() => {
								navigation.goBack();
							}}
						>
							<Feather
								name="chevron-left"
								size={24}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
						<SvgXml
							xml={colorScheme === "dark" ? logoSmallDark : logoSmallLight}
						/>
						<View style={styles.qalb}></View>
					</View>
				) : null}
				<View style={styles.content}>
					{orientation === "portrait" ? null : (
						<TouchableOpacity
							style={[styles.button, styles_landscape.go_back]}
							onPress={() => {
								navigation.goBack();
							}}
						>
							<Feather
								name="chevron-left"
								size={24}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
					)}
					<ActivityIndicator style={styles.spinner} />
					{children}
				</View>
				<View style={styles.footer}>
					<View style={styles.buttons_group}>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setZoom((zoom) => zoom + 1)}
						>
							<Feather
								name="zoom-in"
								size={24}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setZoom((zoom) => zoom - 1)}
						>
							<Feather
								name="zoom-out"
								size={24}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.buttons_group}>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setMod(1)}
						>
							<Text style={styles.buttons_group_item}>1</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setMod(2)}
						>
							<Text style={styles.buttons_group_item}>2</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setMod(3)}
						>
							<Text style={styles.buttons_group_item}>3</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons_group_item}
							onPress={() => setMod(4)}
						>
							<Text style={styles.buttons_group_item}>4</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.button} onPress={snapshot}>
						<Feather
							name="share-2"
							size={24}
							color={colors[colorScheme].primary}
						/>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
};

export default ViewProteinsLayout;
