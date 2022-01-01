import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Home, ViewProtein } from "../screens";
import { navigationRef } from "./RootNavigation";

const Stack = createNativeStackNavigator();

const Navigator = () => {
	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Home" component={Home} />
				<Stack.Screen name="Protein" component={ViewProtein} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigator;
