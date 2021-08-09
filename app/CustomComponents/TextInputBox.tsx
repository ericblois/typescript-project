import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, TextInput, KeyboardAvoidingView } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";

type TextInputBoxProps = {
    style?: ViewStyle,
    textStyle?: TextStyle,
    boxProps?: KeyboardAvoidingView['props'],
    textProps?: TextInput['props'],
    avoidKeyboard?: boolean,
    focusOnStart?: boolean,
    shadow?: boolean,
    validateFunc?: (text: string) => boolean
}

type State = {
    text: string,
    isValid: boolean,
    shouldAvoid: boolean,
}

export default class TextInputBox extends CustomComponent<TextInputBoxProps, State> {

    textInput: TextInput | null = null

    constructor(props: TextInputBoxProps) {
        super(props)
        let isValid = false
        if (props.validateFunc) {
            if (props.textProps?.defaultValue) {
                isValid = props.validateFunc(props.textProps?.defaultValue)
            }
        }
        this.state = {
            text: "",
            isValid: isValid,
            shouldAvoid: false,
        }
    }

    render() {
        return (
            <KeyboardAvoidingView
                {...this.props.boxProps}
                style={{width: "100%"}}
                contentContainerStyle={{
                    ...defaults.inputBox,
                    borderColor: this.state.isValid ? colors.mainColor : colors.lighterGrayColor,
                    ...(this.props.shadow !== false ? defaults.smallShadow : undefined),
                    ...this.props.style
                }}
                behavior={"position"}
                enabled={this.state.shouldAvoid && this.props.avoidKeyboard === true}
            >
                <TextInput
                    style={[defaults.inputText, this.props.textStyle]}
                    disableFullscreenUI={true}
                    focusable={true}
                    textAlign={"center"}
                    textAlignVertical={"center"}
                    autoCorrect={false}
                    clearButtonMode={"while-editing"}
                    ref={(textInput) => {this.textInput = textInput}}
                    onLayout={() => {
                        if (this.props.focusOnStart === true && this.textInput !== null) {
                            this.textInput.focus()
                        }
                    }}
                    {...this.props.textProps}
                    onFocus={(e) => {
                        this.setState({shouldAvoid: true})
                        if (this.props.textProps?.onFocus) {
                            this.props.textProps.onFocus(e)
                        }
                    }}
                    onEndEditing={(e) => {
                        this.setState({shouldAvoid: false})
                        if (this.props.textProps?.onEndEditing) {
                            this.props.textProps.onEndEditing(e)
                        }
                    }}
                    onChangeText={(text) => {
                        let validText = false
                        if (this.props.validateFunc) {
                            validText = this.props.validateFunc(text)
                        }
                        this.setState({text: text, isValid: validText})
                        if (this.props.textProps?.onChangeText) {
                            this.props.textProps.onChangeText(text)
                        }
                    }}
                >
                    {this.props.children}
                </TextInput>
            </KeyboardAvoidingView>
            )
    }
}
