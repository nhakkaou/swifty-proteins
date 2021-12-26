import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Home } from "../screens";
import { StyleSheet } from "react-native";
import { navigationRef } from "./RootNavigation";

const Stack = createNativeStackNavigator();

const Navigator = () => {
	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator
				initialRouteName="Login"
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Home" component={Home} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigator;

const styles = StyleSheet.create({});
