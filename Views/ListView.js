import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import data from "./ligands.json";
const List = () => {
  // const [data, setdata] = React.useState([]);
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c0c5ce",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    padding: 10,
  },
  list: {
    width: "100%",
  },
});
export default List;
