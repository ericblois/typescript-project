import React, { Component } from "react";
import { View, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData, } from "react-native";
import PropTypes from 'prop-types';
import { SearchBar, } from "react-native-elements";
import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import { SearchResults } from "../HelperFiles/CompIndex";
import { firestore, getQueryTerms, PrivateBusinessData } from "../HelperFiles/Constants";
import ServerData from "../HelperFiles/ServerData";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CustomerMainTabParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';

type SearchNavigationProp = BottomTabNavigationProp<CustomerMainTabParamList, "search">;

type SearchRouteProp = RouteProp<CustomerMainTabParamList, "search">;

type Props = {
    navigation: SearchNavigationProp,
    route: SearchRouteProp,
}

type State = {
  searchText: string,
  businessResults: PrivateBusinessData[],
}

export default class SearchPage extends Component<Props, State> {

  state: Readonly<State> = {
    searchText: "",
    businessResults: []
  }

  onSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    try {
      const search = event.nativeEvent.text;
      ServerData.queryBusinesses(getQueryTerms(search)).then((results) => {
        this.setState({businessResults: results})
      })
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
        <View style={defaults.pageContainer}>
        <SearchResults navigation={this.props.navigation} businesses={this.state.businessResults}/>
        <SearchBar
          containerStyle={styles.searchBar}
          inputStyle={styles.searchBarInput}
          inputContainerStyle={styles.searchBarInputContainer}
          placeholder={"Search..."}
          onChangeText={(text) => this.setState({searchText: text})}
          onEndEditing={this.onSubmit}
          //onSubmitEditing={this.onSubmit}
        >
          {this.state.searchText}
        </SearchBar>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#fff",
    borderBottomColor: styleValues.bordColor,
    borderBottomWidth: styleValues.minorBorderWidth,
    borderColor: styleValues.bordColor,
    borderRadius: styleValues.bordRadius,
    borderTopColor: styleValues.bordColor,
    borderTopWidth: styleValues.minorBorderWidth,
    borderWidth: styleValues.minorBorderWidth,
    height: styleValues.winWidth * 0.125,
    width: styleValues.winWidth * 0.95,
    position: "absolute",
    top: styleValues.mediumPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarInput: {
    backgroundColor: "#fff",
  },
  searchBarInputContainer: {
    backgroundColor: "#fff",
    height: "100%",
  },
});
