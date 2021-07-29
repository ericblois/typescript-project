import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, TextInput, KeyboardAvoidingView } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import CurrencyInput, { CurrencyInputProps } from "react-native-currency-input"

type CurrencyInputBoxProps = {
    style?: ViewStyle,
    textStyle?: TextStyle,
    boxProps?: Partial<KeyboardAvoidingView['props']>,
    currencyProps?: Partial<CurrencyInputProps>,
    avoidKeyboard?: boolean
}

type State = {
    value: number | null,
    shouldAvoid: boolean
}

export default class CurrencyInputBox extends Component<CurrencyInputBoxProps, State> {

    constructor(props: CurrencyInputBoxProps) {
        super(props)
        this.state = {
            value: props.currencyProps?.value ? props.currencyProps?.value : null,
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
                <CurrencyInput
                    value={this.state.value}
                    style={[defaults.inputText, this.props.textStyle]}
                    keyboardType={"number-pad"}
                    disableFullscreenUI={true}
                    focusable={true}
                    textAlign={"center"}
                    textAlignVertical={"center"}
                    autoCorrect={false}
                    prefix={"$"}
                    delimiter={","}
                    separator={"."}
                    {...this.props.currencyProps}
                    onFocus={(e) => {
                        this.setState({shouldAvoid: true})
                        if (this.props.currencyProps?.onFocus) {
                            this.props.currencyProps.onFocus(e)
                        }
                    }}
                    onEndEditing={(e) => {
                        this.setState({shouldAvoid: false})
                        if (this.props.currencyProps?.onEndEditing) {
                            this.props.currencyProps.onEndEditing(e)
                        }
                    }}
                    onChangeValue={(value) => {
                        this.setState({value: value})
                        if (this.props.currencyProps?.onChangeValue) {
                            this.props.currencyProps.onChangeValue(value)
                        }
                    }}
                ></CurrencyInput>
            </KeyboardAvoidingView>
            )
    }
}
