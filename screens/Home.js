import { StatusBar } from "expo-status-bar";
import React from "react";
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import colors from "../assets/colors";
import {
	iconDark,
	iconLight,
	logoSmallDark,
	logoSmallLight,
} from "../assets/icons";
import Feather from "react-native-vector-icons/Feather";
import data from "../assets/ligands.json";
import useOrientation from "../hooks/useOrientation";
Feather.loadFont();

const Home = ({ navigation }) => {
	const colorScheme = useColorScheme();
	const [list, setList] = React.useState(data);
	const [search, setSearch] = React.useState("");
	const orientation = useOrientation();

	const styles = StyleSheet.create({
		bg: {
			backgroundColor: colors[colorScheme].background,
			flex: 1,
		},
		header: {
			alignItems: "center",
			paddingVertical: 10,
		},
		search_container: {
			marginVertical: 10,
			marginHorizontal: 20,
			flexDirection: "row",
			justifyContent: "center",
		},
		search_input: {
			height: 40,
			borderColor: colors[colorScheme].border,
			borderWidth: 1,
			borderRadius: 20,
			paddingLeft: 20,
			width: "80%",
			color: colors[colorScheme].primary,
			fontFamily: "Regular",
		},
		search_button: {
			width: 40,
			height: 40,
			backgroundColor: "red",
			marginHorizontal: 10,
			borderRadius: 20,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: colors[colorScheme].lightBackground,
		},
		item: {
			paddingVertical: 20,
			flexDirection: "row",
			paddingHorizontal: 20,
			alignItems: "center",
		},
		separator: {
			height: 1,
			backgroundColor: colors[colorScheme].border,
			width: "80%",
			alignSelf: "center",
		},
		text: {
			marginHorizontal: 10,
			color: colors[colorScheme].primary,
			fontFamily: "Regular",
			fontSize: 20,
		},
		list_container: {
			flex: 1,
			backgroundColor: colors[colorScheme].background2,
		},
	});

	const styles_landscape = StyleSheet.create({
		bg: {
			flexDirection: "row",
			flex: 1,
		},
		header: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		list_container: {
			flex: 2,
		},
	});

	const handleSearch = (search) => {
		setSearch(search);
		if (search === "") setList(data);
		else {
			setList(
				data.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
			);
		}
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.item}
			onPress={() => navigation.navigate("Protein", { ligand: item })}
		>
			<SvgXml xml={colorScheme === "dark" ? iconDark : iconLight} />
			<Text style={styles.text}>{item}</Text>
		</TouchableOpacity>
	);

	const renderSeparator = () => <View style={styles.separator}></View>;

	return (
		<View style={styles.bg}>
			<SafeAreaView
				style={orientation === "portrait" ? styles.bg : styles_landscape.bg}
			>
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				<View
					style={
						orientation === "portrait" ? styles.header : styles_landscape.header
					}
				>
					{/* <Image source={colorScheme === "dark" ? logoDark : logoLight} /> */}
					<SvgXml
						xml={colorScheme === "dark" ? logoSmallDark : logoSmallLight}
					/>
					<View style={styles.search_container}>
						<TextInput
							placeholder="Search"
							style={styles.search_input}
							value={search}
							onChangeText={handleSearch}
						/>
						<TouchableOpacity style={styles.search_button}>
							<Feather
								name="search"
								size={20}
								color={colors[colorScheme].primary}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.list_container}>
					<FlatList
						style={styles.list}
						renderItem={renderItem}
						data={list}
						ItemSeparatorComponent={renderSeparator}
						keyExtractor={(item) => item}
					/>
				</View>
			</SafeAreaView>
		</View>
	);
};

export default Home;
