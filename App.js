import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
// import { NativeRouter, Route, Link } from "react-router-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import List from "./Views/ListView";
// import { useHistory } from "react-router-native";
import ViewProtein from "./Views/ViewProtein";

const Home = () => {
  // const [isSupported, setisSupported] = useState(false);
  // const history = useHistory();
  // useEffect(() => {
  //   if (LocalAuthentication.AuthenticationType.FINGERPRINT)
  //     setisSupported(true);
  //   LocalAuthentication.authenticateAsync(
  //     LocalAuthentication.AuthenticationType.FINGERPRINT
  //   )
  //     .then((r) => {
  //       if (r.success) history.push("/list");
  //       else {
  //         alert("Authentication failed");
  //         setisSupported(false);
  //       }
  //     })
  //     .catch((er) => console.log(er));
  // }, []);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        style={styles.finger}
        size={200}
        name={isSupported ? "fingerprint" : "fingerprint-off"}
      />
      <Text style={styles.text}>Place your finger</Text>
    </View>
  );
};
export default function App() {
  return (
    // <NativeRouter>
    //   <Route exact path="/" component={Home} />
    //   <Route path="/list" component={List} />
    //   <Route path="/ViewProtein" component={ViewProtein} />
    // </NativeRouter>
    <ViewProtein />
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
