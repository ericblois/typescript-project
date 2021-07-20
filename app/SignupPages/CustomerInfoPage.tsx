import React, { Component } from "react";
import { View, ScrollView, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import { TextInputBox, DateScrollPicker, TextDropdown, MenuBar, PageContainer } from "../HelperFiles/CompIndex";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, UserSignupStackParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import ServerData from "../HelperFiles/ServerData";
import { UserData } from "../HelperFiles/DataTypes";
import UserFunctions from "../HelperFiles/UserFunctions";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";

type CustomerInfoNavigationProp = CompositeNavigationProp<
    StackNavigationProp<UserSignupStackParamList, "customerInfo">,
    StackNavigationProp<RootStackParamList>
>

type CustomerInfoRouteProp = RouteProp<UserSignupStackParamList, "customerInfo">;

type Props = {
    navigation: CustomerInfoNavigationProp,
    route: CustomerInfoRouteProp
}

type State = {
    isLoading: boolean,
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
}


export default class CustomerInfoPage extends Component<Props, State> {

    defaultTextProps: TextInput['props']
    today: Date

    constructor(props: Props) {
        super(props)
        this.defaultTextProps = {
            autoCorrect: false,
            autoCapitalize: "none",
            clearButtonMode: "while-editing",
        }
        this.today = new Date();

        this.state = {
            isLoading: false,
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
        }
    }

    isEnterValid() {
        return (
            this.state.validName &&
            this.state.validEmail &&
            this.state.validPass &&
            this.state.validConfirm &&
            this.state.validBirthday &&
            this.state.validGender &&
            this.state.validCountry
        )
    }

    nextPage() {
        // Check for invalid inputs
        if (!this.state.validName) {
            this.setState({responseText: "Please enter a name."});
        } else if (!this.state.validEmail) {
            this.setState({responseText: "Please enter a valid email."});
        } else if (!this.state.validPass) {
            this.setState({responseText: "Please enter a valid password."});
        } else if (!this.state.validConfirm) {
            this.setState({responseText: "Your password does not match the confirmation."});
        } else if (!this.state.validBirthday) {
            this.setState({responseText: "You must be 13 years of age or older to use this service."});
        } else if (!this.state.validGender) {
            this.setState({responseText: "Please select a gender."});
        } else if (!this.state.validCountry) {
            this.setState({responseText: "Please select a country."});
        } else {
            this.setState({isLoading: true})
            const userData: UserData = {
                name: this.state.nameText,
                gender: this.state.genderText!,
                age: this.state.ageValue,
                birthDay: this.state.birthDayText,
                birthMonth: this.state.birthMonthText,
                birthYear: this.state.birthYearText,
                country: this.state.countryText,
                businessIDs: [],
                shippingAddresses: [],
                cartItems: [],
            }
            // Create an account
            ServerData.createNewUser(
                this.state.emailText,
                this.state.passText,
                userData
            ).then(async (cred) => {
                switch (this.props.route.params.accountType) {
                    case "business":
                        // Create a new business
                        const businessID = await UserFunctions.createNewBusiness()
                        const businessFuncs = new BusinessFunctions(businessID)
                        this.props.navigation.navigate("businessMain", {businessFuncs: businessFuncs})
                        // Go to business creation page
                        break;
                    case "customer":
                        // Go to main customer screen
                        this.props.navigation.navigate("customerMain")
                        break;
                }
                this.setState({isLoading: false})
            }).catch((e) => {
                this.setState({isLoading: false})
                throw e
            })
        }
    }

    renderLoadingView() {
        return !this.state.isLoading ? undefined : (
            <View
                style={{...defaults.pageContainer, ...{justifyContent: "center"}}}
            >
            <ActivityIndicator
                size={"large"}
            />
            </View>
        )
    }

  render() {
        return (
        <PageContainer>
            <Text style={styles.signupHeader}>
                Sign Up
            </Text>
            <ScrollView>
                <Text style={styles.inputDescription}>
                    This will be used when messaging businesses.
                </Text>
                <TextInputBox
                    style={{borderColor: this.state.validName ? styleValues.validColor : styleValues.darkColor}}
                    textProps={{...this.defaultTextProps, ...{
                        onChangeText: async (text) => {
                            let validName = text.length > 0
                            this.setState({nameText: text, validName: validName})
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
                            // Regular expression for an email
                            let validEmail = /^[a-z0-9\.\_\-]+@[a-z0-9\.\-]+\.[a-z0-9]+$/m.test(text.toLowerCase())
                            this.setState({emailText: text, validEmail: validEmail})
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
                            let validPass = text.length > 5
                            let validConfirm = text === this.state.confirmPassText
                            this.setState({passText: text, validPass: validPass, validConfirm: validConfirm});
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
                            let validConfirm = text === this.state.passText
                            this.setState({confirmPassText: text, validConfirm: validConfirm});
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
                            this.setState({birthDayText: dateDay, birthMonthText: dateMonth, birthYearText: dateYear, birthdayValue: date, ageValue: age, validBirthday: isValid})
                        }
                    }}
                ></DateScrollPicker>
                <Text style={styles.inputDescription}>
                    Select a gender.
                </Text>
                <View style={{
                    zIndex: 2
                }}>
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
                                this.setState({genderText: value, validGender: isValid});
                            }
                        }}
                    ></TextDropdown>
                </View>
                <View style={{
                    zIndex: 1
                }}>
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
                    ></TextDropdown>
                </View>
                <Text style={styles.inputDescription}>
                    {this.state.responseText}
                </Text>
            </ScrollView>
            {this.renderLoadingView()}
            <MenuBar
                menuBarStyle={{
                    bottom: styleValues.mediumPadding
                }}
                buttonProps={[
                    {
                        iconSource: icons.backArrow,
                        buttonFunc: () => this.props.navigation.goBack(),
                    },
                    {
                        iconSource: icons.enter,
                        iconStyle: {tintColor: this.isEnterValid() ? styleValues.darkGreyColor : styleValues.lightGreyColor},
                        buttonFunc: () => this.nextPage(),
                        buttonProps: {
                            // When enter is disabled, don't change opacity when pressed
                            activeOpacity: this.isEnterValid() ? 0.2 : 1,
                        }
                    }
                ]}
            ></MenuBar>
        </PageContainer>
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