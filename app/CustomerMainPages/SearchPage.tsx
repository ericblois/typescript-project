import React, { Component } from "react";
import { View, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData, FlatList, ActivityIndicator, } from "react-native";
import PropTypes from 'prop-types';
import { SearchBar, } from "react-native-elements";
import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import { BusinessCard, PageContainer, TextInputBox } from "../HelperFiles/CompIndex";
import { firestore } from "../HelperFiles/Constants";
import { getQueryTerms } from "../HelperFiles/ClientFunctions"
import ServerData from "../HelperFiles/ServerData";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CustomerMainStackParamList, CustomerTabParamList, RootStackParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import { StackNavigationProp } from "@react-navigation/stack";

type SearchNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerTabParamList, "search">,
  StackNavigationProp<CustomerMainStackParamList>
>

type SearchRouteProp = RouteProp<CustomerTabParamList, "search">;

type Props = {
    navigation: SearchNavigationProp,
    route: SearchRouteProp,
}

type State = {
  searchText: string,
  businessResults: PublicBusinessData[],
  loading: boolean
}

export default class SearchPage extends Component<Props, State> {

  state: Readonly<State> = {
    searchText: "",
    businessResults: [],
    loading: false
  }

  onSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    try {
      const search = event.nativeEvent.text;
      this.setState({loading: true})
      // Get current position
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const location = {latitude: pos.coords.latitude, longitude: pos.coords.longitude}
        const businesses = await ServerData.findLocalBusinessesInRange(getQueryTerms(search), location)
        this.setState({businessResults: businesses, loading: false})
      })
    } catch (e) {
      console.error(e);
    }
  }

  renderBusinessCards(businesses: PublicBusinessData[]) {
    if (this.state.businessResults.length > 0) {
      return (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.businessID}
          renderItem={({item}) => {
            return (
              <BusinessCard
                businessData={item}
                onPress={() => {
                  this.props.navigation.navigate("businessShop", {businessData: item})
                }}
              />
            )
          }}
        />
      )
    } else if (this.state.loading) {
      return (
        <View
          style={{flex: 1, alignItems: "center", justifyContent: "center"}}
        >
          <ActivityIndicator
            size={"large"}
          />
        </View>
      )
    }
  }

  render() {
    return (
        <PageContainer>
          <TextInputBox
            textProps={{
              placeholder: "Search...",
              value: this.state.searchText,
              onChangeText: (text) => {
                this.setState({searchText: text})
              },
              onSubmitEditing: this.onSubmit
            }}
          ></TextInputBox>
          {this.renderBusinessCards(this.state.businessResults)}
        {/*<SearchResults navigation={this.props.navigation} businesses={this.state.businessResults}/>
        <SearchBar
          containerStyle={{...defaults.textButtonNoColor, ...{
            position: "absolute",
            top: styleValues.mediumPadding,
          }}}
          inputStyle={styles.searchBarInput}
          inputContainerStyle={styles.searchBarInputContainer}
          placeholder={"Search..."}
          //onChangeText={(text) => this.setState({searchText: text})}
          onChangeText={(text) => {}}
          onSubmitEditing={(e) => this.onSubmit(e)}
          //onEndEditing={this.onSubmit}
          //onSubmitEditing={this.onSubmit}
        >
          {this.state.searchText}
        </SearchBar>*/}
        </PageContainer>
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
