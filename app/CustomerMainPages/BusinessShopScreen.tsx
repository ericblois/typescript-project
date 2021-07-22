import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BusinessShopStack } from "../HelperFiles/Navigation";
import PropTypes from 'prop-types';
import { styleValues, colors, defaults, icons } from "../HelperFiles/StyleSheet";
import { IconButton, TabIcon } from "../HelperFiles/CompIndex";
import { BusinessInfoPage, BusinessProductsPage, ProductShopPage } from "../HelperFiles/PageIndex";
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomerMainStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import CustomerCartPage from "./CustomerCartPage";
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type BusinessShopNavigationProp = StackNavigationProp<CustomerMainStackParamList, "businessShop">;

type BusinessShopRouteProp = RouteProp<CustomerMainStackParamList, "businessShop">;

type Props = {
    navigation: BusinessShopNavigationProp,
    route: BusinessShopRouteProp
}

type State = {
  businessData: PublicBusinessData
}

export default class BusinessShopScreen extends Component<Props, State> {

    businessData = this.props.route.params.businessData

    render() {
        return (
          <BusinessShopStack.Navigator
            initialRouteName={"info"}
            screenOptions={(props) => ({
              headerStatusBarHeight: 0,
              headerShown: false,
            })}
          >
            <BusinessShopStack.Screen
                name={"info"}
                children={(props) => {
                  return (
                    <BusinessInfoPage {...props} businessData={this.businessData}/>
                  )
                }}
                options={{
                  animationEnabled: false
                }}
            />
            <BusinessShopStack.Screen
                name={"products"}
                children={(props) => {
                  return (
                    <BusinessProductsPage {...props} businessData={this.businessData}/>
                  )
                }}
                options={{
                  animationEnabled: false
                }}
            />
            <BusinessShopStack.Screen
                name={"productInfo"}
                children={(props) => {
                  return (
                    <ProductShopPage {...props}/>
                  )
                }}
            />
          </BusinessShopStack.Navigator>
      );
    }
}
