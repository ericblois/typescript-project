import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import { defaults, textStyles, buttonStyles, icons, styleValues, colors, tabBarStyles } from "../HelperFiles/StyleSheet";
import { BusinessMainStackParamList, BusinessEditStack } from "../HelperFiles/Navigation";
import TabIcon from "../CustomComponents/TabIcon";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { CustomerMainStackParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BusinessEditMainPage, BusinessEditInfoPage, BusinessEditLocationPage, NotificationsPage, BusinessAccountPage, BusinessEditProductListPage, BusinessEditProductCategoryPage, BusinessEditProductPage, ProductEditOptionTypePage, ProductEditOptionPage } from "../HelperFiles/PageIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";

type BusinessEditStackNavigationProp = StackNavigationProp<BusinessMainStackParamList, "businessEdit">;

type BusinessEditStackRouteProp = RouteProp<BusinessMainStackParamList, "businessEdit">;

type Props = {
    navigation: BusinessEditStackNavigationProp,
    route: BusinessEditStackRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
}

export default class BusinessEditScreen extends CustomComponent<Props, State> {

  businessFuncs = this.props.businessFuncs

  render() {
    return (
        <BusinessEditStack.Navigator
            initialRouteName={"editMain"}
            headerMode={"none"}
        >
            <BusinessEditStack.Screen
              name={"editMain"}
              children={(props) => {
                return <BusinessEditMainPage {...props} businessFuncs={this.businessFuncs}/>
              }}
              listeners={{
                beforeRemove: (event) => {
                  if (event.target) {
                    if (event.target === "editInfo") {
                      this.setState({headerShown: false})
                    }
                  }
                }
              }}
            />
            <BusinessEditStack.Screen
                name={"editInfo"}
                children={(props) => {
                    return <BusinessEditInfoPage {...props} businessFuncs={this.businessFuncs}/>
                }}
                listeners={{
                    focus: (event) => {
                    this.setState({headerShown: false})
                    }
                }}
            />
            <BusinessEditStack.Screen
                name={"editProductList"}
                children={(props) => {
                    return <BusinessEditProductListPage {...props} businessFuncs={this.businessFuncs}/>
                }}
            />
            <BusinessEditStack.Screen
                name={"editProductCat"}
                children={(props) => {
                    return <BusinessEditProductCategoryPage {...props} businessFuncs={this.businessFuncs}/>
                }}
            />
            <BusinessEditStack.Screen
                name={"editProduct"}
                children={(props) => {
                    return <BusinessEditProductPage {...props} businessFuncs={this.businessFuncs}/>
                }}
            />
            <BusinessEditStack.Screen
                name={"editOptionType"}
                children={(props) => {
                    return <ProductEditOptionTypePage {...props} businessFuncs={this.businessFuncs}/>
                }}
            />
            <BusinessEditStack.Screen
                name={"editOption"}
                children={(props) => {
                    return <ProductEditOptionPage {...props} businessFuncs={this.businessFuncs}/>
                }}
            />
            <BusinessEditStack.Screen
                name={"editLocation"}
                children={(props) => {
                    return <BusinessEditLocationPage {...props} businessFuncs={this.businessFuncs}/>
                }}
            />
        </BusinessEditStack.Navigator>
    );
  }
}
