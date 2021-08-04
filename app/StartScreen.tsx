import React, { Component } from "react";
import CustomComponent from "./CustomComponents/CustomComponent"
import { View, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "./HelperFiles/StyleSheet";
import { TextButton, IconButton } from "./HelperFiles/CompIndex";
import PropTypes from 'prop-types';
import { auth } from "./HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "./HelperFiles/Navigation";
import { RouteProp } from "@react-navigation/core";

type StartNavigationProp = StackNavigationProp<RootStackParamList, "start">;

type StartRouteProp = RouteProp<RootStackParamList, "start">;

type Props = {
    navigation: StartNavigationProp,
    route: StartRouteProp
}

type State = {
    showLogin: boolean,
    hideAll: boolean,
    userText: string,
    passText: string,
    responseText: string
}

export default class StartScreen extends CustomComponent<Props, State> {

    state: Readonly<State> = {
        showLogin: false,
        hideAll: false,
        userText: "",
        passText: "",
        responseText: ""
    }

    signinElements = () => {
        if (this.state.hideAll) {
            return <></>;
        } else if (this.state.showLogin) {
            return (
                <KeyboardAvoidingView style={styles.signinContainer} behavior={"position"}>
                            <TextInput
                                style={styles.signinElement}
                                onChangeText={(text) => {
                                    this.setState({userText: text})
                                }}
                                placeholder={"Email"}
                                textAlign={"center"}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                textContentType={"emailAddress"}
                                autoCompleteType={"email"}
                                clearButtonMode={"while-editing"}
                            >
                                {this.state.userText}
                            </TextInput>
                        <TextInput
                            style={styles.signinElement}
                            onChangeText={(text) => {
                                this.setState({passText: text})
                            }}
                            placeholder={"Password"}
                            textAlign={"center"}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            textContentType={"password"}
                            autoCompleteType={"password"}
                            secureTextEntry={true}
                            clearButtonMode={"while-editing"}
                        >
                            {this.state.passText}
                        </TextInput>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <IconButton
                                iconSource={icons.chevron}
                                iconStyle={{tintColor: "#fff"}}
                                buttonStyle={{marginBottom: styleValues.mediumPadding}}
                                buttonFunc={() => this.setState({showLogin: false, responseText: ""})}
                            />
                            <Text
                                style={{...textStyles.small, ...styles.responseText}}
                            >
                                {this.state.responseText}
                            </Text>
                            <IconButton
                                iconSource={icons.enter}
                                iconStyle={{tintColor: "#fff"}}
                                buttonStyle={{marginBottom: styleValues.mediumPadding}}
                                buttonFunc={() => this.attemptSignin()}
                            />
                        </View>
                </KeyboardAvoidingView>
            )
        // Buttons for different start options
        } else {
            return (
                <View style={styles.signinContainer}>
                    <TextButton
                        text={"Login"}
                        buttonStyle={buttonStyles.noColor}
                        textStyle={styles.buttonText}
                        buttonFunc={() => this.setState({showLogin: true})}
                    />
                    <TextButton
                        text={"Sign Up"}
                        buttonStyle={buttonStyles.noColor}
                        textStyle={styles.buttonText}
                        buttonFunc={() => this.props.navigation.navigate("userSignup")}
                    />
                    <TextButton
                        text={"Browse as Guest"}
                        buttonStyle={buttonStyles.noColor}
                        textStyle={styles.buttonText}
                        buttonFunc={() => {
                            auth.signInAnonymously().then(() => {
                                this.props.navigation.navigate("customerMain")
                            }, (e: any) => {
                                console.error(e)
                            })
                        }}
                    />
                </View>
            )
        }       
    }

    attemptSignin() {
        const user = this.state.userText;
        const pass = this.state.passText;
        this.setState({hideAll: true});
        auth.signInWithEmailAndPassword(user, pass).then(() => {
            this.props.navigation.navigate("customerMain")
        },
        (e: any) => {
            console.error(e);
            this.setState({hideAll: false, responseText: "Invalid email/password."});
        })
    }

  render() {
    return (
        <View style={[defaults.screenContainer, {backgroundColor: "#ff7070", alignItems: "center"}]}>
        <Image
            style={styles.logo}
            source={require("../assets/logoIcon.png")}
            resizeMethod={"resize"}
            resizeMode={"contain"}
        />
        {this.signinElements()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    signinContainer: {
        position: "absolute",
        bottom: "10%",
        width: styleValues.winWidth*2/3,
        alignItems: "center"
    },
    signinElement: {
        width: styleValues.winWidth*0.75,
        height: styleValues.winWidth/8,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#e34f4f",
        borderRadius: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding
    },
    buttonText: {
        color: "#ff7070",
        fontSize: styleValues.mediumTextSize,
    },
    responseText: {
        color: "#fff",
        height: styleValues.iconMediumSize,
    },
    logo: {
        position: "absolute",
        top: "20%",
        left: styleValues.winWidth*3/8,
        height: styleValues.winWidth/4,
        width: styleValues.winWidth/4,
        tintColor: "#fff"
    },
    background: {
        height: "100%",
        width: "100%"
    }
})