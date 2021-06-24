import React, { Component } from "react";
import { View, ScrollView, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
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
    selectCallback?: (typeSelection: string) => void
}

type State = {
    typeSelection: string
}


export default class CustomerInfoPage extends Component<Props, State> {

    state: Readonly<State> = {
        typeSelection: ""
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
                        ...{borderWidth: this.state.typeSelection == "customer" ? styleValues.majorBorderWidth : styleValues.minorBorderWidth}
                    }}
                    buttonFunc={() => {
                        if (this.props.selectCallback) {
                            this.props.selectCallback!("customer")
                        }
                        this.setState({typeSelection: "customer"})
                    }}
                />
                <TextButton
                    text={"Start a business"}
                    subtext={"Create a business page to reach customers."}
                    buttonStyle={{
                        ...defaults.textButtonNoColor,
                        ...styles.accountTypeButton,
                        ...{borderWidth: this.state.typeSelection == "business" ? styleValues.majorBorderWidth : styleValues.minorBorderWidth}
                    }}
                    buttonFunc={() => {
                        if (this.props.selectCallback) {
                            this.props.selectCallback!("business")
                        }
                        this.setState({typeSelection: "business"})
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleText: {
        position: "absolute",
        top: styleValues.majorPadding,
        fontSize: styleValues.largestTextSize
    },
    accountTypeButton: {
        margin: styleValues.mediumPadding,
        width: "60%",
        height: styleValues.winWidth*0.4,
        padding: styleValues.majorPadding
    }
})
