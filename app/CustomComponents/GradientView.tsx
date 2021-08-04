import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, TextInput, KeyboardAvoidingView } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import CurrencyInput, { CurrencyInputProps } from "react-native-currency-input"
import { LinearGradient } from "expo-linear-gradient"
import { hexToRGBA } from "../HelperFiles/ClientFunctions";

type CurrencyInputBoxProps = {
    style?: ViewStyle,
    fadeTop?: boolean,
    fadeBottom?: boolean,
    fadeStartColor?: string,
    backgroundStartColor?: string,
    fadeEndColor?: string,
    backgroundEndColor?: string,
    fadeLength?: number,
    horizontal?: boolean
}

type State = {}

export default class CurrencyInputBox extends CustomComponent<CurrencyInputBoxProps, State> {

    fadeLength: number

    constructor(props: CurrencyInputBoxProps) {
        super(props)
        this.fadeLength = props.fadeLength ? props.fadeLength : styleValues.mediumPadding
    }

    renderTopFade(startColor: string, startBackground: string) {
        if (this.props.fadeTop !== false) {
            return (
                <LinearGradient
                    colors={[startColor, startBackground]}
                    locations={[0.2, 1]}
                    start={this.props.horizontal === true ? {x: 0, y: 0.5} : undefined}
                    end={this.props.horizontal === true ? {x: 1, y: 0.5} : undefined}
                    style={{
                        width: this.props.horizontal === true ? this.fadeLength : "100%",
                        height: this.props.horizontal === true ? "100%" : this.fadeLength
                    }}
                />
            )
        }
    }

    renderBottomFade(endColor: string, endBackground: string) {
        if (this.props.fadeBottom !== false) {
            return (
                <LinearGradient
                    colors={[endBackground, endColor]}
                    locations={[0, 0.8]}
                    start={this.props.horizontal === true ? {x: 0, y: 0.5} : undefined}
                    end={this.props.horizontal === true ? {x: 1, y: 0.5} : undefined}
                    style={{
                        width: this.props.horizontal === true ? this.fadeLength : "100%",
                        height: this.props.horizontal === true ? "100%" : this.fadeLength
                    }}
                />
            )
        }
    }

    render() {
        const startColor = this.props.fadeStartColor ? this.props.fadeStartColor : colors.backgroundColor
        const startBackground = this.props.backgroundStartColor ? hexToRGBA(this.props.backgroundStartColor, 0) : hexToRGBA(colors.backgroundColor, 0)
        const endColor = this.props.fadeEndColor ? this.props.fadeEndColor : colors.backgroundColor
        const endBackground = this.props.backgroundEndColor ? hexToRGBA(this.props.backgroundEndColor, 0) : hexToRGBA(colors.backgroundColor, 0)
        return (
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    flexDirection: this.props.horizontal === true ? "row" : "column",
                    justifyContent: "space-between",
                    ...this.props.style
                }}
                onStartShouldSetResponder={() => (false)}
                pointerEvents={"none"}
            >
                {this.renderTopFade(startColor, startBackground)}
                <View/>
                {this.renderBottomFade(endColor, endBackground)}
            </View>
        )
    }
}
