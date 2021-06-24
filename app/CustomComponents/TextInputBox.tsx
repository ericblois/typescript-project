import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, GestureResponderEvent } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import { TextInput } from "react-native-gesture-handler";

type TextInputBoxProps = {
    style?: ViewStyle,
    textStyle?: TextStyle,
    extraBoxProps?: View['props'],
    extraTextProps?: TextInput['props']
}

type State = {}

export default class TextInputBox extends Component<TextInputBoxProps, State> {

    render() {
        return (
            <View
                {...this.props.extraBoxProps}
                style={[defaults.inputBox, this.props.style]}
            >
                <TextInput
                    {...this.props.extraTextProps}
                    style={[defaults.inputText, this.props.textStyle]}
                    disableFullscreenUI={true}
                    focusable={true}
                    textAlign={"center"}
                    textAlignVertical={"center"}
                >
                    {this.props.children}
                </TextInput>
            </View>
            )
    }
}
