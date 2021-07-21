import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import BusinessShopScreen from "./BusinessShopScreen"
import { defaults, icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import { CustomerMainStack, CustomerTab } from "../HelperFiles/Navigation";
import TabIcon from "../CustomComponents/TabIcon";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { CustomerMainStackParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import SearchPage from "./SearchPage";
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
              style: {...defaults.tabBar, ...{marginBottom: styleValues.mediumPadding}},
              showLabel: false,
              activeTintColor: colors.darkColor,
              inactiveTintColor: colors.lightGrayColor
            }}
            initialRouteName={"search"}
        >
            <CustomerTab.Screen
                name={"search"}
                component={SearchPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.search} options={options}/>
                }}
            />
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
