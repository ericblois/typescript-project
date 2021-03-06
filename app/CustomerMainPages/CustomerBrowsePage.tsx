import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData, FlatList, ActivityIndicator, } from "react-native";
import PropTypes from 'prop-types';
import { styleValues, colors, defaults, textStyles, buttonStyles, fonts, menuBarHeight } from "../HelperFiles/StyleSheet";
import { BusinessCard, BusinessCardBrowseList, BusinessResult, LoadingCover, PageContainer, ScrollContainer, SearchBar, TextInputBox } from "../HelperFiles/CompIndex";
import { firestore } from "../HelperFiles/Constants";
import { getQueryTerms } from "../HelperFiles/ClientFunctions"
import ServerData from "../HelperFiles/ServerData";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CustomerMainStackParamList, CustomerTabParamList, RootStackParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { PublicBusinessData, UserData } from "../HelperFiles/DataTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import UserFunctions from "../HelperFiles/UserFunctions";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type CustomerBrowseNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<CustomerTabParamList, "browse">,
    StackNavigationProp<CustomerMainStackParamList>
>

type CustomerBrowseRouteProp = RouteProp<CustomerTabParamList, "browse">;

type Props = {
    navigation: CustomerBrowseNavigationProp,
    route: CustomerBrowseRouteProp,
}

type State = {
    userData?: UserData,
    searchText: string,
    businessResults: PublicBusinessData[],
    showSearchResults: boolean,
    searchLoading: boolean
}

export default class CustomerBrowsePage extends CustomComponent<Props, State> {
    constructor (props: Props) {
        super(props)
        this.state = {
          userData: undefined,
          searchText: "",
          businessResults: [],
          showSearchResults: false,
          searchLoading: false
        }
        props.navigation.addListener("focus", () => this.refreshData())
        this.refreshData()
    }

    async refreshData() {
      await UserFunctions.getUserDoc().then(async (data) => {
        this.setState({userData: data})
      })
    }

    onSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      try {
        const search = event.nativeEvent.text;
        this.setState({showSearchResults: true, searchLoading: true})
        // Get current position
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const location = {latitude: pos.coords.latitude, longitude: pos.coords.longitude}
          const businesses = await CustomerFunctions.findLocalBusinessesInRange(getQueryTerms(search), location)
          this.setState({businessResults: businesses, searchLoading: false})
          console.log(businesses)
        })
      } catch (e) {
        console.error(e);
      }
    }

    renderSearchResults() {
      if (this.state.showSearchResults) {
        if (this.state.searchLoading) {
          return (
            <LoadingCover size={"large"}/>
          )
        } else {
          return (
            <ScrollContainer
              containerStyle={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: colors.backgroundColor
              }}
              contentContainerStyle={{
                paddingTop: defaults.inputBox.height + styleValues.mediumPadding*2,
              }}
            >
              {this.state.businessResults.map((publicData) => {
                return (
                  <BusinessResult
                    businessData={publicData}
                    containerStyle={{
                      width: styleValues.winWidth - 2*styleValues.mediumPadding,
                      alignSelf: "center"
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("businessShop", {businessData: publicData})
                    }}
                    key={publicData.businessID}
                  />
                )
              })}
            </ScrollContainer>
          )
        }
      }
    }

    renderFavorites() {
      if (this.state.userData) {
        try {
          return (
            <View style={{width: "100%",}}>
              <Text 
                style={{...textStyles.large, ...{
                  textAlign: "left",
                  marginLeft: styleValues.mediumPadding,
                }}}
              >Favorites</Text>
              <BusinessCardBrowseList
                businessIDs={this.state.userData.favorites}
                onCardPress={(publicData) => this.props.navigation.navigate("businessShop", {businessData: publicData})}
                showLoading={false}
                style={{width: styleValues.winWidth, marginHorizontal: -styleValues.mediumPadding}}
              />
            </View>
          )
        } catch (e) {
          this.refreshData()
        }
      }
    }

    renderFeaturedBusinesses() {
      if (this.state.userData) {
        return (
          <View style={{width: "100%"}}>
            <Text
              style={{...textStyles.large, ...{
                textAlign: "left",
                marginLeft: styleValues.mediumPadding,
              }}}
            >Featured Businesses</Text>
            <BusinessCardBrowseList
              businessIDs={this.state.userData.favorites}
              onCardPress={(publicData) => this.props.navigation.navigate("businessShop", {businessData: publicData})}
              showLoading={true}
              style={{width: styleValues.winWidth, marginHorizontal: -styleValues.mediumPadding}}
            />
          </View>
        )
      }
    }

    renderPopularBusinesses() {
      if (this.state.userData) {
        return (
          <View style={{width: "100%",}}>
            <Text
              style={{...textStyles.large, ...{
                textAlign: "left",
                marginLeft: styleValues.mediumPadding,
              }}}
            >Popular Businesses</Text>
            <BusinessCardBrowseList
              businessIDs={this.state.userData.favorites}
              onCardPress={(publicData) => this.props.navigation.navigate("businessShop", {businessData: publicData})}
              showLoading={true}
            />
          </View>
        )
      }
    }

    render() {
      return (
          <PageContainer>
            <ScrollContainer
              contentContainerStyle={{
                paddingHorizontal: 0,
                paddingTop: defaults.inputBox.height + styleValues.mediumPadding*2,
                paddingBottom: menuBarHeight + styleValues.mediumPadding
              }}
              containerStyle={{
                width: styleValues.winWidth,
              }}
            >
              {this.renderFavorites()}
              {this.renderFeaturedBusinesses()}
              {this.renderPopularBusinesses()}
            </ScrollContainer>
            {this.renderSearchResults()}
            <SearchBar
              textProps={{
                placeholder: "Search...",
                value: this.state.searchText,
                onChangeText: (text) => {
                  this.setState({searchText: text})
                },
                onSubmitEditing: this.onSubmit
              }}
              onClearText={() => {
                this.setState({showSearchResults: false})
              }}
            ></SearchBar>
          </PageContainer>
      );
    }
}

const styles = StyleSheet.create({
    searchBar: {
      backgroundColor: "#fff",
      borderBottomColor: colors.grayColor,
      borderBottomWidth: styleValues.minorBorderWidth,
      borderColor: colors.grayColor,
      borderRadius: styleValues.bordRadius,
      borderTopColor: colors.grayColor,
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
