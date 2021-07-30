import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import { ProductShopPage, CustomerCartPage, CustomerOrderPage, CustomerEditShippingPage, CustomerEditAddressPage } from "./HelperFiles/PageIndex";
import BusinessShopScreen from "./CustomerMainPages/BusinessShopScreen"
import { defaults, textStyles, buttonStyles, icons } from "./HelperFiles/StyleSheet";
import { CustomerMainStack } from "./HelperFiles/Navigation";
import TabIcon from "./CustomComponents/TabIcon";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "./HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import CustomerTabScreen from "./CustomerMainPages/CustomerTabScreen";

type CustomerMainNavigationProp = StackNavigationProp<RootStackParamList, "customerMain">;

type CustomerMainRouteProp = RouteProp<RootStackParamList, "customerMain">;

type Props = {
    navigation: CustomerMainNavigationProp,
    route: CustomerMainRouteProp
}

type State = {
}

export default class CustomerMainScreen extends Component<Props, State> {

  state: Readonly<State> = {};

  render() {
    return (
      <View style={defaults.screenContainer}>
        <CustomerMainStack.Navigator
          initialRouteName={"customerTab"}
          screenOptions={(props) => ({
            headerStatusBarHeight: 0,
            headerShown: false,
          })}
        >
            <CustomerMainStack.Screen
              name={"customerTab"}
              component={CustomerTabScreen}
            />
            <CustomerMainStack.Screen
              name={"businessShop"}
              component={BusinessShopScreen}
            />
            <CustomerMainStack.Screen
                name={"cart"}
                children={(props) => {
                  return (
                    <CustomerCartPage {...props}/>
                  )
                }}
            />
            <CustomerMainStack.Screen
                name={"order"}
                component={CustomerOrderPage}
            />
            <CustomerMainStack.Screen
                name={"editShipping"}
                component={CustomerEditShippingPage}
            />
            <CustomerMainStack.Screen
                name={"editAddress"}
                component={CustomerEditAddressPage}
            />
        </CustomerMainStack.Navigator>
      </View>
    );
  }
}
