import React, { Component } from "react";
import CustomComponent from "./CustomComponents/CustomComponent"
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import { BusinessAccountPage, BusinessEditMainPage, BusinessOrderPage, BusinessOrdersPage } from "./HelperFiles/PageIndex";
import { MenuBar, TabIcon } from "./HelperFiles/CompIndex"
import { styleValues, colors, tabBarStyles } from "./HelperFiles/StyleSheet"
import { defaults, textStyles, buttonStyles, icons } from "./HelperFiles/StyleSheet";
import { BusinessMainStack, CustomerMainStack } from "./HelperFiles/Navigation";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { StackNavigationProp, StackHeaderProps } from '@react-navigation/stack';
import { RootStackParamList } from "./HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { PrivateBusinessData, PublicBusinessData } from "./HelperFiles/DataTypes";
import { BusinessFunctions } from "./HelperFiles/BusinessFunctions";
import UserFunctions from "./HelperFiles/UserFunctions";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import BusinessEditScreen from "./BusinessMainPages/BusinessEditScreen"

type BusinessMainNavigationProp = StackNavigationProp<RootStackParamList, "businessMain">;

type BusinessMainRouteProp = RouteProp<RootStackParamList, "businessMain">;

type Props = {
    navigation: BusinessMainNavigationProp,
    route: BusinessMainRouteProp,
}

type State = {

}

export default class BusinessMainScreen extends CustomComponent<Props, State> {

  businessFuncs: BusinessFunctions

  constructor(props: Props) {
    super(props)
    this.businessFuncs = props.route.params.businessFuncs
  }

  render() {
    return (
        <View style={defaults.screenContainer}>
        <BusinessMainStack.Navigator
            initialRouteName={"businessEdit"}
            headerMode={"none"}
            screenOptions={{
                transitionSpec: {
                    open: {
                        animation: "timing",
                        config: {
                            duration: 50
                        }
                    }, close: {
                        animation: "timing",
                        config: {
                            duration: 50
                        }
                    }
                },
                cardStyleInterpolator: (props) => ({cardStyle: {opacity: props.current.progress}})
            }}
        >
          <BusinessMainStack.Screen
                name={"businessEdit"}
                children={(props) => <BusinessEditScreen {...props} businessFuncs={this.businessFuncs}/>}
                

          />
          <BusinessMainStack.Screen
                name={"orders"}
                children={(props) => <BusinessOrdersPage {...props} businessFuncs={this.businessFuncs}/>}
          />
          <BusinessMainStack.Screen
                name={"order"}
                children={(props) => <BusinessOrderPage {...props} businessFuncs={this.businessFuncs}/>}
          />
          <BusinessMainStack.Screen
                name={"account"}
                children={(props) => <BusinessAccountPage {...props} businessFuncs={this.businessFuncs}/>}
          />
        </BusinessMainStack.Navigator>
        </View>
    );
  }
}

const headerBarTop = styleValues.winHeight
    - defaults.tabBarLightColor.height
    - styleValues.mediumPadding*2

const styles = StyleSheet.create({
    headerBar: {
        bottom: undefined,
        top: headerBarTop,
    }
})