import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { NativeRouter, Route, Link } from "react-router-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import List from "./Views/ListView";
import ViewProtein from "./Views/ViewProtein";

const Home = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        style={styles.finger}
        size={200}
        name="fingerprint"
      />
      <Text style={styles.text}>Place your finger in your ass</Text>
      <StatusBar style="auto" />
    </View>
  );
};
export default function App() {
  // React.useEffect(() => {
  //   const test = async () => {
  //     const { biometryType } = await ReactNativeBiometrics.isSensorAvailable();
  //     console.log(biometryType);
  //   };
  //   test();
  // }, []);
  return (
    <NativeRouter>
      <Route exact path="/" component={Home} />
      <Route path="/list" component={List} />
      <Route path="/ViewProtein" component={ViewProtein} />
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c0c5ce",
    alignItems: "center",
    justifyContent: "center",
  },
  finger: {
    width: 300,
    height: 300,
    textAlign: "center",
    padding: 40,
    borderRadius: 150,
    // borderWidth: 1,
    backgroundColor: "gray",
    overflow: "hidden",
    color: "#fff",
  },
  text: {
    color: "#fff",
    lineHeight: 60,
  },
});
