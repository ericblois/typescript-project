import React, { Component } from "react";
import { View, ScrollView, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import { TextInputBox, DateScrollPicker, TextDropdown } from "../HelperFiles/CompIndex";
import { auth, googleAPIKey } from "../HelperFiles/Constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from '@react-navigation/stack';
import { UserSignupStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import ServerData from "../HelperFiles/ServerData";
import { UserData } from "../HelperFiles/DataTypes";
import DropDownPicker from 'react-native-dropdown-picker';

type CustomerInfoNavigationProp = StackNavigationProp<UserSignupStackParamList, "customerInfo">;

type CustomerInfoRouteProp = RouteProp<UserSignupStackParamList, "customerInfo">;

type Props = {
    navigation: CustomerInfoNavigationProp,
    route: CustomerInfoRouteProp
    infoUpdateCallback?: (email?: string, password?: string, userData?: UserData) => void
}

type State = {
    nameText: string,
    validName: boolean,
    emailText: string,
    validEmail: boolean,
    passText: string,
    validPass: boolean,
    confirmPassText: string,
    validConfirm: boolean,
    birthdayValue: Date,
    birthDayText: string,
    birthMonthText: string,
    birthYearText: string,
    ageValue: number,
    validBirthday: boolean,
    genderText: "male" | "female" | "nonbinary" | null,
    validGender: boolean,
    countryText: "canada" | "united_states",
    validCountry: boolean,
    responseText: string,
    lastInvalid: string,  
}


export default class CustomerInfoPage extends Component<Props, State> {

    defaultTextProps: TextInput['props'] = {
        autoCorrect: false,
        autoCapitalize: "none",
        clearButtonMode: "while-editing",
    }
    today = new Date();

    state: Readonly<State> = {
        nameText: "",
        validName: false,
        emailText: "",
        validEmail: false,
        passText: "",
        validPass: false,
        confirmPassText: "",
        validConfirm: false,
        birthdayValue: this.today,
        ageValue: 0,
        birthDayText: "",
        birthMonthText: "",
        birthYearText: "",
        validBirthday: false,
        genderText: null,
        validGender: false,
        countryText: "canada",
        validCountry: false,
        responseText: "",
        lastInvalid: "",
    }

    sendBackValues() {
        // Check for invalid inputs
        if (!this.state.validName) {
            this.setState({responseText: "Please enter a name.", lastInvalid: "name"});
        } else if (!this.state.validEmail) {
            this.setState({responseText: "Please enter a valid email.", lastInvalid: "email"});
        } else if (!this.state.validPass) {
            this.setState({responseText: "Please enter a valid password.", lastInvalid: "pass"});
        } else if (!this.state.validConfirm) {
            this.setState({responseText: "Your password does not match the confirmation.", lastInvalid: "confirm"});
        } else if (!this.state.validBirthday) {
            this.setState({responseText: "You must be 13 years of age or older to use this service.", lastInvalid: "confirm"});
        } else if (!this.state.validGender) {
            this.setState({responseText: "Please select a gender.", lastInvalid: "confirm"});
        } else if (!this.state.validCountry) {
            this.setState({responseText: "Please select a country.", lastInvalid: "confirm"});
        } else {
            const userData: UserData = {
                name: this.state.nameText,
                gender: this.state.genderText!,
                age: this.state.ageValue,
                birthDay: this.state.birthDayText,
                birthMonth: this.state.birthMonthText,
                birthYear: this.state.birthYearText,
                country: this.state.countryText,
                businessIDs: [],
                defaultAddressIndex: 0,
                shippingAddresses: []
            }
            // Send values up to navigator screen
            if (this.props.infoUpdateCallback) {
                this.props.infoUpdateCallback(this.state.emailText, this.state.passText, userData)
                return
            }
        }
        // Send back no values to indicate there are invalid inputs
        if (this.props.infoUpdateCallback) {
            this.props.infoUpdateCallback(undefined, undefined, undefined)
        }
    }

  back = () => this.props.navigation.goBack();  

  render() {
        return (
        <View>
            <Text style={styles.signupHeader}>
                Sign Up
            </Text>
            <ScrollView 
                contentContainerStyle={defaults.pageContainer}
            >
                <Text style={styles.inputDescription}>
                    This will be used when messaging businesses.
                </Text>
                <TextInputBox
                    style={{borderColor: this.state.validName ? styleValues.validColor : styleValues.darkColor}}
                    textProps={{...this.defaultTextProps, ...{
                        onChangeText: async (text) => {
                            this.setState({nameText: text});
                            let validName = false
                            if (text.length > 0) {
                                validName = true
                                if (this.state.lastInvalid == "name") {
                                    this.setState({responseText: ""});
                                }
                            } else {
                                if (this.state.lastInvalid == "name") {
                                    this.setState({responseText: "Please enter a name."});
                                }
                            }
                            this.setState({validName: validName}, this.sendBackValues)
                        }},
                        placeholder: "Name",
                        autoCapitalize: "words",
                        textContentType: "name",
                        autoCompleteType: "name"
                    }}
                >
                    {this.state.nameText}
                </TextInputBox>
                <Text style={styles.inputDescription}>
                    This will be used to sign in to your account.
                </Text>
                <TextInputBox
                    style={{borderColor: this.state.validEmail ? styleValues.validColor : styleValues.invalidColor}}
                    textProps={{...this.defaultTextProps, ...{
                        onChangeText: (text) => {
                            this.setState({emailText: text});
                            let validEmail = false
                            // Regular expression for an email
                            if (/^[a-z0-9\.\_\-]+@[a-z0-9\.\-]+\.[a-z0-9]+$/m.test(text.toLowerCase())) {
                                validEmail = true
                                if (this.state.lastInvalid == "email") {
                                    this.setState({responseText: ""});
                                }
                            } else {
                                if (this.state.lastInvalid == "email") {
                                    this.setState({responseText: "Please enter a valid email."});
                                }
                            }
                            this.setState({validEmail: validEmail}, this.sendBackValues)
                        },
                        placeholder: "Email",
                        textContentType: "emailAddress",
                        autoCompleteType: "email",
                    }}}
                >
                    {this.state.emailText}
                </TextInputBox>
                <Text style={styles.inputDescription}>
                    Use at least 6 characters in your password.
                </Text>
                <TextInputBox
                    style={{borderColor: this.state.validPass ? styleValues.validColor : styleValues.invalidColor}}
                    textProps={{...this.defaultTextProps, ...{
                        onChangeText: (text) => {
                            this.setState({passText: text});
                            let validPass = false
                            if (text.length > 5) {
                                validPass = true
                                if (this.state.lastInvalid == "pass") {
                                    this.setState({responseText: ""});
                                }
                            } else {
                                if (this.state.lastInvalid == "pass") {
                                    this.setState({responseText: "Please enter a valid password."});
                                }
                            }
                            this.setState({validPass: validPass}, this.sendBackValues);
                        },
                        placeholder: "Password",
                        textContentType: "newPassword",
                        secureTextEntry: true,
                    }}}
                >
                    {this.state.passText}
                </TextInputBox>
                <TextInputBox
                    style={{borderColor: this.state.validConfirm ? styleValues.validColor : styleValues.invalidColor}}
                    textProps={{...this.defaultTextProps, ...{
                        onChangeText: (text) => {
                            this.setState({confirmPassText: text});
                            let validConfirm = false
                            if (text == this.state.passText) {
                                validConfirm = true
                                if (this.state.lastInvalid == "confirm") {
                                    this.setState({responseText: ""});
                                }
                            } else {
                                if (this.state.lastInvalid == "confirm") {
                                    this.setState({responseText: "Your password does not match the confirmation."});
                                }
                            }
                            this.setState({validConfirm: validConfirm}, this.sendBackValues);
                        },
                        placeholder: "Confirm password",
                        textContentType: "newPassword",
                        secureTextEntry: true,
                    }}}
                >
                    {this.state.confirmPassText}
                </TextInputBox>
                <Text style={styles.inputDescription}>
                    You must be 13 years of age or older to use this service.
                </Text>
                <DateScrollPicker
                    style={{borderColor: this.state.validBirthday ? styleValues.validColor : styleValues.invalidColor}}
                    extraProps={{
                        value: this.state.birthdayValue,
                        onChange: (event, date) => {
                            if (!date) {
                                throw new Error("No date object given when date changed");
                            }
                            const dateString = date.toLocaleDateString();
                            const dateDay = date.getDay().toString()
                            const dateMonth = date.getMonth().toString()
                            const dateYear = date.getFullYear().toString()
                            const today = new Date();
                            // Get number of days between today and birthday
                            const timeDiff = (today.getTime() - date.getTime())/(86400000);
                            // Check if this birthday is more than 13 years old (365.24*13=4748.12)
                            const isValid = timeDiff >= 4748.12
                            const age = Math.floor(timeDiff/365.24)
                            this.setState({birthDayText: dateDay, birthMonthText: dateMonth, birthYearText: dateYear, birthdayValue: date, ageValue: age, validBirthday: isValid}, this.sendBackValues)
                        }
                    }}
                ></DateScrollPicker>
                <Text style={styles.inputDescription}>
                    Select a gender.
                </Text>
                <TextDropdown
                    style={{borderColor: this.state.validGender ? styleValues.validColor : styleValues.invalidColor}}
                    items={[
                        {label: "Male", value: "male"},
                        {label: "Female", value: "female"},
                        {label: "Nonbinary", value: "nonbinary"}
                    ]}
                    extraProps={{
                        placeholder: "Gender",
                        onChangeItem: (item) => {
                            const value = item.value;
                            // Check if a gender has been selected, then update state
                            const isValid = value === "male" || value === "female" || value === "nonbinary";
                            this.setState({genderText: value, validGender: isValid}, this.sendBackValues);
                        },
                    }}
                ></TextDropdown>
                <TextDropdown
                    style={{borderColor: this.state.validCountry ? styleValues.validColor : styleValues.invalidColor}}
                    items={[
                        {
                            label: "Canada",
                            value: "canada"
                        },
                        {
                            label: "United States",
                            value: "united_states"
                        }
                    ]}
                    extraProps={{
                        placeholder: "Country",
                        onChangeItem: (item) => {
                            this.setState({countryText: item.value, validCountry: true})
                        }
                    }}
                />
                <Text style={styles.inputDescription}>
                    {this.state.responseText}
                </Text>
            </ScrollView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingScreen: {
        position: "absolute",
        top: 0,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
    signupHeader: {
        fontSize: styleValues.largerTextSize,
    },
    inputElement: {
        width: styleValues.winWidth-2*styleValues.mediumPadding,
        height: styleValues.winWidth/10,
        fontSize: styleValues.smallestTextSize,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        alignItems: "center"
    },
    pickerText: {
        textAlignVertical: "center",
        textAlign: "center",
        height: "100%",
        width: "100%",
    },
    inputDescription: {
        width: styleValues.winWidth-2*styleValues.mediumPadding,
        textAlign: "left",
        fontSize: styleValues.smallestTextSize,
        padding: styleValues.mediumPadding,
    },
    genderPicker: {
        // Must use individual border radii, as borderRadius does not work
        borderTopLeftRadius: styleValues.mediumPadding,
        borderTopRightRadius: styleValues.mediumPadding,
        borderBottomLeftRadius: styleValues.mediumPadding,
        borderBottomRightRadius: styleValues.mediumPadding,
        borderWidth: 0,
        height: "100%",
        width: "100%",
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: styles.inputElement,
    inputAndroid: styles.inputElement
})