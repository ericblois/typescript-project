import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View, Text } from "react-native";
import { CustomerInfoPage, AccountTypePage } from "./HelperFiles/PageIndex";
import { defaults, icons, styleValues, colors } from "./HelperFiles/StyleSheet";
import { NavigationContainer, ParamListBase, Route } from "@react-navigation/native";
import { RootStack, CustomerMainStack, RootStackParamList } from "./HelperFiles/Navigation";
import { UserSignupStack, UserSignupStackParamList } from "./HelperFiles/Navigation";
import { StackHeaderProps, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import MenuBar from "./CustomComponents/MenuBar";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { UserData } from "./HelperFiles/DataTypes";
import IconButton from "./CustomComponents/IconButton";
import ServerData from "./HelperFiles/ServerData";
import UserFunctions from "./HelperFiles/UserFunctions";
import { BusinessFunctions } from "./HelperFiles/BusinessFunctions";

type UserSignupNavigationProp = StackNavigationProp<RootStackParamList, "userSignup">;

type UserSignupRouteProp = RouteProp<RootStackParamList, "userSignup">;

type Props = {
    navigation: UserSignupNavigationProp,
    route: UserSignupRouteProp
}

type State = {
}

export default class UserSignupScreen extends Component<Props, State> {

    render() {
        return (
            <View style={defaults.screenContainer}>
                <UserSignupStack.Navigator
                    initialRouteName={"accountType"}
                    screenOptions={{
                        title: "Sign Up",
                        headerStatusBarHeight: 0,
                        headerShown: false,
                    }}
                >
                    <UserSignupStack.Screen
                        name={"accountType"}
                        component={AccountTypePage}
                    />
                    <UserSignupStack.Screen
                        name={"customerInfo"}
                        component={CustomerInfoPage}
                    />
                </UserSignupStack.Navigator>
            </View>
        )
    }


}

const headerBarTop = styleValues.winHeight
    - styleValues.winWidth * 0.15
    - styleValues.mediumPadding

const styles = StyleSheet.create({
    headerBar: {
        bottom: undefined,
        top: headerBarTop,
    }
})