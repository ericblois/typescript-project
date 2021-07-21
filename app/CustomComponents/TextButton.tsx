import React, { Component, Fragment } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, Image, GestureResponderEvent, ImageStyle } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { defaults, styleValues, colors } from "../HelperFiles/StyleSheet";

type Props = {
    text: string,
    textStyle?: TextStyle,
    appearance?: "light" | "color" | "no-color"
    subtext?: string,
    subtextStyle?: TextStyle,
    leftIconSource?: number,
    leftIconStyle?: ImageStyle,
    rightIconSource?: number,
    rightIconStyle?: ImageStyle,
    buttonStyle?: ViewStyle,
    buttonFunc?: (event?: GestureResponderEvent) => void,
    textProps?: Text['props'],
    subtextProps?: Text['props'],
    touchableProps?: TouchableOpacity['props']
}

type State = {}

export default class TextButton extends Component<Props, State> {

    renderSubtext() {
        if (this.props.subtext) {
            return (
                <Text style = {[styles.subtextStyle, this.props.subtextStyle]} {...this.props.subtextProps}>
                    {this.props.subtext!}
                </Text>
            )
        }
        return undefined
    }

    renderLeftIcon() {
        if (this.props.leftIconSource) {
            return (
                <Image
                    source={this.props.leftIconSource}
                    style = {{...styles.iconStyle, ...this.props.leftIconStyle}}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                />
            )
        }
        return undefined
    }

    renderRightIcon() {
        if (this.props.rightIconSource) {
            return (
                <Image
                    source={this.props.rightIconSource}
                    style = {{...styles.iconStyle, ...this.props.rightIconStyle}}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                />
            )
        }
        return undefined
    }

    render() {
        let defaultButtonStyle = {...defaults.textButtonNoColor}
        if (this.props.appearance === "light") {
            defaultButtonStyle = defaults.textButtonLightColor
        } else if (this.props.appearance === "color") {
            defaultButtonStyle = defaults.textButtonMainColor
        }
        let defaultTextStyle = {...styles.textStyle}
        if (this.props.appearance === "color") {
            defaultTextStyle.color = colors.whiteColor
        }
        return (
            <TouchableOpacity
            style={{...defaultButtonStyle, ...this.props.buttonStyle, ...{
                justifyContent: this.props.rightIconSource != undefined || this.props.rightIconSource != undefined ? "space-between" : "center"
            }}}
            onPress={this.props.buttonFunc}
            {...this.props.touchableProps}
            >
                {this.renderLeftIcon()}
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text style = {[defaultTextStyle, this.props.textStyle]} {...this.props.textProps}>
                        {this.props.text}
                    </Text>
                    {this.renderSubtext()}
                </View>
                {this.renderRightIcon()}
            </TouchableOpacity>
            )
    }
}

const styles = StyleSheet.create({
    textStyle: {
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: styleValues.mediumTextSize,
        color: styleValues.majorTextColor,
    },
    subtextStyle: {
        textAlign: "center",
        fontSize: styleValues.smallTextSize,
        color: styleValues.minorTextColor
    },
    iconStyle: {
        aspectRatio: 1,
        maxWidth: "10%",
        maxHeight: "75%",
        tintColor: colors.darkGrayColor,
        alignSelf: "center",
        flexWrap: "wrap",
    },
});
