import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, TextInput, KeyboardAvoidingView } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults } from "../HelperFiles/StyleSheet";

type TextInputBoxProps = {
    style?: ViewStyle,
    textStyle?: TextStyle,
    boxProps?: KeyboardAvoidingView['props'],
    textProps?: TextInput['props'],
    avoidKeyboard?: boolean
}

type State = {
    shouldAvoid: boolean
}

export default class TextInputBox extends Component<TextInputBoxProps, State> {

    constructor(props: TextInputBoxProps) {
        super(props)
        this.state = {
            shouldAvoid: false
        }
    }

    render() {
        return (
            <KeyboardAvoidingView
                {...this.props.boxProps}
                style={{width: "100%"}}
                contentContainerStyle={[defaults.inputBox, this.props.style]}
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
                >
                    {this.props.children}
                </TextInput>
            </KeyboardAvoidingView>
            )
    }
}
