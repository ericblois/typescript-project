import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import { SearchPage, FavouritesPage, NotificationsPage, CustomerAccountPage, ProductShopScreen } from "./HelperFiles/PageIndex";
import BusinessShopScreen from "./BusinessShopScreen"
import { defaults, icons } from "./HelperFiles/StyleSheet";
import { CustomerMainTab } from "./HelperFiles/Navigation";
import TabIcon from "./CustomComponents/TabIcon";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "./HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';

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
        <CustomerMainTab.Navigator
            tabBarOptions={{
              style: defaults.tabBar,
              showLabel: false,
            }}
            sceneContainerStyle={defaults.screenContainer}
            initialRouteName={"search"}
        >
            <CustomerMainTab.Screen
                name={"search"}
                component={SearchPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.search} options={options}/>
                }}
            />
            <CustomerMainTab.Screen
                name={"fav"} 
                component={FavouritesPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.star} options={options}/>
                }}
            />
            <CustomerMainTab.Screen
                name={"notif"} 
                component={NotificationsPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.lines} options={options}/>
                }}
            />
            <CustomerMainTab.Screen
                name={"account"}
                component={CustomerAccountPage}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.profile} options={options}/>
                }}
            />
        </CustomerMainTab.Navigator>
    );
  }
}
