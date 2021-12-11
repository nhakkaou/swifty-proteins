import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Searchbar } from "react-native-paper";
import data from "./ligands.json";
import { useHistory } from "react-router-native";

const List = () => {
  const history = useHistory();
  const [listData, setdata] = React.useState(data);
  const [searchQuery, setSearchQuery] = React.useState("");
  const onHandleChange = (query) => {
    if (query === "") setdata(data);
    setSearchQuery(query);
    var regex = new RegExp(query, "g");
    let tmp = data.filter((el) => el.match(regex));
    setdata(tmp);
  };
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() =>
          history.push({
            pathname: "ViewProtein",
            ligand: item,
          })
        }
      >

        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onHandleChange}
        value={searchQuery}
      />
      <FlatList
        style={styles.list}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c0c5ce",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    textAlign: "left",
    padding: 10,
    fontSize: 15,
  },
  list: {
    width: "100%",
  },
});
export default List;
