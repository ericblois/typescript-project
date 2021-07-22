import React, { Component } from "react";
import { View, Text, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData, FlatList, ActivityIndicator, } from "react-native";
import PropTypes from 'prop-types';
import { SearchBar, } from "react-native-elements";
import { styleValues, colors, defaults } from "../HelperFiles/StyleSheet";
import { BusinessCard, BusinessCardBrowseList, BusinessResult, PageContainer, ScrollContainer, TextInputBox } from "../HelperFiles/CompIndex";
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
    loading: boolean
}

export default class CustomerBrowsePage extends Component<Props, State> {
    constructor (props: Props) {
        super(props)
        this.state = {
          userData: undefined,
          searchText: "",
          businessResults: [],
          showSearchResults: false,
          loading: false
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
                <BusinessResult
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

    renderFavorites() {
      if (this.state.userData) {
        return (
          <View style={{width: "100%", marginBottom: styleValues.mediumPadding}}>
            <Text
              style={{...defaults.largeTextHeader, ...{textAlign: "left"}}}
            >Favorites</Text>
            <BusinessCardBrowseList
              businessIDs={this.state.userData.favorites}
              onCardPress={(publicData) => this.props.navigation.navigate("businessShop", {businessData: publicData})}
              showLoading={true}
            />
          </View>
        )
      }
    }

    renderFeaturedBusinesses() {
      if (this.state.userData) {
        return (
          <View style={{width: "100%", marginBottom: styleValues.mediumPadding}}>
            <Text
              style={{...defaults.largeTextHeader, ...{textAlign: "left"}}}
            >Featured Businesses</Text>
            <BusinessCardBrowseList
              businessIDs={this.state.userData.favorites}
              onCardPress={(publicData) => this.props.navigation.navigate("businessShop", {businessData: publicData})}
              showLoading={true}
            />
          </View>
        )
      }
    }

    renderPopularBusinesses() {
      if (this.state.userData) {
        return (
          <View style={{width: "100%", marginBottom: styleValues.mediumPadding}}>
            <Text
              style={{...defaults.largeTextHeader, ...{textAlign: "left"}}}
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
            <ScrollContainer>
              {this.renderFavorites()}
              {this.renderFeaturedBusinesses()}
              {this.renderPopularBusinesses()}
            </ScrollContainer>
            {this.renderBusinessCards(this.state.businessResults)}
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
