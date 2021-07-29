import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import BusinessShopScreen from "./BusinessShopScreen"
import { defaults, textStyles, buttonStyles, icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import { CustomerMainStack, CustomerTab } from "../HelperFiles/Navigation";
import TabIcon from "../CustomComponents/TabIcon";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { CustomerMainStackParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import CustomerBrowsePage from "./CustomerBrowsePage";
import FavouritesPage from "./FavouritesPage";
import NotificationsPage from "./NotificationsPage";
import CustomerAccountPage from "./CustomerAccountPage";
import { CustomerOrdersPage } from "../HelperFiles/PageIndex";

type CustomerTabNavigationProp = BottomTabNavigationProp<CustomerMainStackParamList, "customerTab">;

type CustomerTabRouteProp = RouteProp<CustomerMainStackParamList, "customerTab">;

type Props = {
    navigation: CustomerTabNavigationProp,
    route: CustomerTabRouteProp
}

type State = {
}

export default class CustomerTabScreen extends Component<Props, State> {

  state: Readonly<State> = {};

  render() {
    return (
        <CustomerTab.Navigator
            tabBarOptions={{
              style: defaults.tabBarLightColor,
              showLabel: false,
              activeTintColor: colors.mainColor,
              inactiveTintColor: colors.lightGrayColor
            }}
            initialRouteName={"browse"}
        >
            <CustomerTab.Screen
                name={"fav"} 
                component={FavouritesPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.star} options={options}/>
                }}
            />
            <CustomerTab.Screen
                name={"notif"} 
                component={NotificationsPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.lines} options={options}/>
                }}
            />
            <CustomerTab.Screen
                name={"browse"}
                component={CustomerBrowsePage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.store} options={options}/>
                }}
            />
            <CustomerTab.Screen
                name={"orders"} 
                component={CustomerOrdersPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.document} options={options}/>
                }}
            />
            <CustomerTab.Screen
                name={"account"}
                component={CustomerAccountPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.profile} options={options}/>
                }}
            />
        </CustomerTab.Navigator>
    );
  }
}
