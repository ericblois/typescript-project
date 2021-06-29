import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View, Text } from "react-native";
import { CustomerInfoPage, AccountTypePage } from "./HelperFiles/PageIndex";
import { defaults, icons, styleValues } from "./HelperFiles/StyleSheet";
import { NavigationContainer, ParamListBase, Route } from "@react-navigation/native";
import { RootStack, CustomerMainTab, RootStackParamList } from "./HelperFiles/Navigation";
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
    enterEnabled: boolean
}

export default class UserSignupScreen extends Component<Props, State> {

    state: Readonly<State> = {
        enterEnabled: false
    }
    // Reference to child customer info page to call its functions
    infoPage: CustomerInfoPage | null = null

    accountType?: string = undefined
    email?: string = undefined
    password?: string = undefined
    userData?: UserData = undefined

    toggleEnter(routeName: string) {
        const enabled = (
            (routeName == "accountType" && this.accountType != undefined)
            || (routeName == "customerInfo" && this.email != undefined && this.password != undefined && this.userData != undefined)
        )
        this.setState({enterEnabled: enabled})
    }

    nextPage(navigation: StackNavigationProp<ParamListBase, string>, route: Route<string, object | undefined>) {
        if (route.name == "accountType" && this.accountType) {
            navigation.navigate("customerInfo")
        } else if (route.name == "customerInfo") {
            if (this.infoPage) {
                this.infoPage!.sendBackValues()
            }
            if (this.accountType != undefined && this.email != undefined && this.password != undefined && this.userData != undefined) {
                const navKey = this.accountType!.concat("Main")
                ServerData.createNewUser(this.email, this.password, this.userData).then(async (user) => {
                    if (this.accountType === "business") {
                        const businessID = await UserFunctions.createNewBusiness()
                        this.props.navigation.navigate("businessMain", {businessFuncs: new BusinessFunctions(businessID)})
                    }
                    this.props.navigation.navigate(navKey as keyof RootStackParamList)
                }, (e) => {throw e})
            } else {
                console.error("A required value for account sign up is missing.")
            }
        }
    }

    render() {
        return (
            <View style={defaults.screenContainer}>
                <UserSignupStack.Navigator
                    initialRouteName={"accountType"}
                    screenOptions={{
                        title: "Sign Up",
                        headerStatusBarHeight: 0,
                        header: (props) => (
                            <MenuBar
                                buttonProps={[
                                    {
                                        iconSource: icons.backArrow,
                                        buttonFunc: props.navigation.goBack,
                                    },
                                    {
                                        iconSource: icons.enter,
                                        iconStyle: {tintColor: this.state.enterEnabled ? styleValues.darkGreyColor : styleValues.lightGreyColor},
                                        buttonFunc: () => this.nextPage(props.navigation, props.scene.route),
                                        buttonProps: {
                                            activeOpacity: this.state.enterEnabled ? 0.2 : 1,
                                        }
                                    }
                                ]}
                                menuBarStyle={styles.headerBar}
                            />
                        )
                    }}
                >
                    <UserSignupStack.Screen
                        name={"accountType"}
                        children={(props) => <AccountTypePage {...props} selectCallback={(accountType: string) => {
                            this.accountType = accountType
                            this.toggleEnter(props.route.name)
                        }}/>}
                        listeners={{
                            focus: (event) => {
                                // Reset the enter button
                                if (event.target) {
                                    let name = event.target!.substring(0, event.target.indexOf("-"))
                                    this.toggleEnter(name)
                                }
                            }
                        }}
                    />
                    <UserSignupStack.Screen
                        name={"customerInfo"}
                        children={(props) => <CustomerInfoPage ref={infoPage => this.infoPage = infoPage} {...props}
                            infoUpdateCallback={(email?: string, password?: string, userData?: UserData) => {
                                this.email = email
                                this.password = password
                                this.userData = userData
                                this.toggleEnter(props.route.name)
                            }}
                        />}
                        listeners={{
                            focus: (event) => {
                                // Reset the enter button
                                if (event.target) {
                                    let name = event.target!.substring(0, event.target.indexOf("-"))
                                    this.toggleEnter(name)
                                }
                            }
                        }}
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