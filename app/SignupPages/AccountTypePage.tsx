import React, { Component } from "react";
import { View, ScrollView, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, icons } from "../HelperFiles/StyleSheet";
import { IconButton, MenuBar } from "../HelperFiles/CompIndex";
import { auth, googleAPIKey } from "../HelperFiles/Constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from '@react-navigation/stack';
import { UserSignupStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import ServerData from "../HelperFiles/ServerData";
import { UserData } from "../HelperFiles/DataTypes";
import DropDownPicker from 'react-native-dropdown-picker';
import TextButton from "../CustomComponents/TextButton";

type AccountTypeNavigationProp = StackNavigationProp<UserSignupStackParamList, "accountType">;

type AccountTypeRouteProp = RouteProp<UserSignupStackParamList, "accountType">;

type Props = {
    navigation: AccountTypeNavigationProp,
    route: AccountTypeRouteProp,
}

type State = {
    typeSelection?: "customer" | "business"
}


export default class AccountTypePage extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            typeSelection: undefined
        }
    }

    render() {
        return (
            <View style={[defaults.pageContainer, {justifyContent: "center"}]}>
                <Text style={styles.titleText}>
                    Sign Up
                </Text>
                <TextButton
                    text={"Become a customer"}
                    subtext={"Start shopping from small businesses."}
                    buttonStyle={{
                        ...defaults.textButtonNoColor,
                        ...styles.accountTypeButton,
                        ...{borderWidth: this.state.typeSelection === "customer" ? styleValues.majorBorderWidth : styleValues.minorBorderWidth,
                            borderColor: this.state.typeSelection === "customer" ? colors.validColor : colors.grayColor,
                        }
                    }}
                    buttonFunc={() => {
                        this.setState({typeSelection: "customer"})
                    }}
                />
                <TextButton
                    text={"Start a business"}
                    subtext={"Create a business page to reach customers."}
                    buttonStyle={{
                        ...defaults.textButtonNoColor,
                        ...styles.accountTypeButton,
                        ...{borderWidth: this.state.typeSelection === "business" ? styleValues.majorBorderWidth : styleValues.minorBorderWidth,
                            borderColor: this.state.typeSelection === "business" ? colors.validColor : colors.grayColor,
                        }
                    }}
                    buttonFunc={() => {
                        this.setState({typeSelection: "business"})
                    }}
                />
                <MenuBar
                    buttonProps={[
                        {
                            iconSource: icons.backArrow,
                            buttonFunc: this.props.navigation.goBack,
                        },
                        {
                            iconSource: icons.enter,
                            iconStyle: {tintColor: this.state.typeSelection ? colors.darkGrayColor : colors.lightGrayColor},
                            buttonFunc: () => {
                                if (this.state.typeSelection) {
                                    this.props.navigation.navigate("customerInfo", {accountType: this.state.typeSelection})
                                }
                            },
                            buttonProps: {
                                // When enter is disabled, don't change opacity when pressed
                                activeOpacity: this.state.typeSelection ? 0.2 : 1,
                            }
                        }
                    ]}
                    menuBarStyle={defaults.menuBarNoColor}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleText: {
        position: "absolute",
        top: styleValues.majorPadding,
        fontSize: styleValues.largerTextSize
    },
    accountTypeButton: {
        margin: styleValues.mediumPadding,
        width: "60%",
        height: styleValues.winWidth*0.4,
        padding: styleValues.majorPadding
    }
})
