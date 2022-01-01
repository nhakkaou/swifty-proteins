import React, { useContext, useEffect } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import Feather from "react-native-vector-icons/Feather";
import { logoSmallDark, logoSmallLight } from "../../assets/icons";
import colors from "../../assets/colors";
import useOrientation from "../../hooks/useOrientation";
Feather.loadFont();

const ViewProteinsLayout = ({ children }) => {
	const colorScheme = useColorScheme();
	const orientation = useOrientation();

	useEffect(() => {
		console.log(orientation);
	}, [orientation]);

	const styles = StyleSheet.create({
		background: {
			flex: 1,
			backgroundColor: colors[colorScheme].background,
		},
		header: {
			marginHorizontal: 21,
			marginTop: 10,
			marginBottom: 25,
			flexDirection: "row",
			justifyContent: "space-between",
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
		},
		footer: {
			marginHorizontal: 21,
			marginVertical: 21,
			flexDirection: "row",
			justifyContent: "space-between",
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

	return (
		<View style={styles.background}>
			<SafeAreaView style={{ flex: 1 }}>
				{orientation === "portrait" ? (
					<View style={styles.header}>
						<TouchableOpacity style={styles.button}>
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
						<TouchableOpacity style={[styles.button, styles_landscape.go_back]}>
							<Feather
								name="chevron-left"
								size={24}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
					)}
					{children}
				</View>
				<View style={styles.footer}>
					<View style={styles.buttons_group}>
						<TouchableOpacity style={styles.buttons_group_item}>
							<Feather
								name="zoom-in"
								size={24}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttons_group_item}>
							<Feather
								name="zoom-out"
								size={24}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.buttons_group}>
						<TouchableOpacity style={styles.buttons_group_item}>
							<Text style={styles.buttons_group_item}>1</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttons_group_item}>
							<Text style={styles.buttons_group_item}>2</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttons_group_item}>
							<Text style={styles.buttons_group_item}>3</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttons_group_item}>
							<Text style={styles.buttons_group_item}>4</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.button}>
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
