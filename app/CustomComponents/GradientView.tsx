import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, TextInput, KeyboardAvoidingView } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import CurrencyInput, { CurrencyInputProps } from "react-native-currency-input"
import { LinearGradient } from "expo-linear-gradient"

type CurrencyInputBoxProps = {
    style?: ViewStyle,
    fadeColor?: string,
    horizontal?: boolean
}

type State = {}

export default class CurrencyInputBox extends Component<CurrencyInputBoxProps, State> {

    constructor(props: CurrencyInputBoxProps) {
        super(props)
    }

    render() {
        const fadeoutColor = this.props.fadeColor ? this.props.fadeColor : styleValues.whiteColor
        return (
            <LinearGradient
                colors={[fadeoutColor, 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', fadeoutColor]}
                locations={[0, 0.02, 0.98, 1]}
                start={this.props.horizontal === true ? {x: 0, y: 0.5} : undefined}
                end={this.props.horizontal === true ? {x: 1, y: 0.5} : undefined}
                style={{...{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0
                }, ...this.props.style}}
                pointerEvents={"none"}
            />
        )
    }
}
