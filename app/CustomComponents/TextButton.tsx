import React, { Component, Fragment } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, Image, GestureResponderEvent, ImageStyle } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { defaults, textStyles, buttonStyles, styleValues, colors, fonts } from "../HelperFiles/StyleSheet";

type Props = {
    text: string,
    textStyle?: TextStyle,
    appearance?: "light" | "color" | "no-color",
    shadow?: boolean,
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

    defaultButtonStyle = {...buttonStyles.noColor}
    defaultTextStyle = {...styles.textStyle}
    defaultIconStyle = {...styles.iconStyle}

    constructor(props: Props) {
        super(props)
        // Update default button style
        if (props.appearance === "light") {
            this.defaultButtonStyle = buttonStyles.lightColor
        } else if (props.appearance === "color") {
            this.defaultButtonStyle = buttonStyles.mainColor
        }
        // Add a shadow
        if (this.props.shadow !== false) {
            this.defaultButtonStyle = {
                ...this.defaultButtonStyle,
                ...defaults.smallShadow
            }
        }
        // Update default text style
        if (props.appearance === "light") {
            this.defaultTextStyle.color = colors.mainColor
        } else if (props.appearance === "color") {
            this.defaultTextStyle.color = colors.whiteColor
            this.defaultTextStyle.fontFamily = fonts.medium
        }
        // Update default icon style
        if (props.appearance === "light") {
            this.defaultIconStyle.tintColor = colors.mainColor
        } else if (props.appearance === "color") {
            this.defaultIconStyle.tintColor = colors.whiteColor
        }
    }

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
                    style = {{...this.defaultIconStyle, ...this.props.leftIconStyle}}
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
                    style = {{...this.defaultIconStyle, ...this.props.rightIconStyle}}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                />
            )
        }
        return undefined
    }

    render() {
        return (
            <TouchableOpacity
            style={{...this.defaultButtonStyle, ...this.props.buttonStyle, ...{
                justifyContent: this.props.rightIconSource != undefined || this.props.rightIconSource != undefined ? "space-between" : "center"
            }}}
            onPress={this.props.buttonFunc}
            {...this.props.touchableProps}
            >
                {this.renderLeftIcon()}
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text style = {[this.defaultTextStyle, this.props.textStyle]} {...this.props.textProps}>
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
        ...textStyles.medium,
        color: styleValues.majorTextColor,
    },
    subtextStyle: {
        ...textStyles.small,
        color: styleValues.minorTextColor
    },
    iconStyle: {
        aspectRatio: 1,
        maxWidth: "10%",
        maxHeight: "75%",
        tintColor: colors.grayColor,
        alignSelf: "center",
        flexWrap: "wrap",
    },
});
