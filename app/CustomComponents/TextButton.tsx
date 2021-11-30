import React, { Component, Fragment } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, Image, GestureResponderEvent, ImageStyle, ActivityIndicatorProps, Animated } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { defaults, textStyles, buttonStyles, styleValues, colors, fonts } from "../HelperFiles/StyleSheet";
import LoadingCover from "./LoadingCover";

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
    touchableProps?: TouchableOpacity['props'],
    showLoading?: boolean,
}

type State = {
    loading: boolean
}

export default class TextButton extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false
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
        let defaultIconStyle = {...styles.iconStyle}
        // Update default icon style
        if (this.props.appearance === "light") {
            defaultIconStyle.tintColor = colors.mainColor
        } else if (this.props.appearance === "color") {
            defaultIconStyle.tintColor = colors.whiteColor
        }
        if (this.props.leftIconSource) {
            return (
                <Image
                    source={this.props.leftIconSource}
                    style = {{
                        ...defaultIconStyle,
                        ...(this.props.textStyle?.color ? {tintColor: this.props.textStyle?.color} : undefined),
                        ...this.props.leftIconStyle,
                    }}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                />
            )
        }
        return undefined
    }

    renderRightIcon() {
        let defaultIconStyle = {...styles.iconStyle}
        // Update default icon style
        if (this.props.appearance === "light") {
            defaultIconStyle.tintColor = colors.mainColor
        } else if (this.props.appearance === "color") {
            defaultIconStyle.tintColor = colors.whiteColor
        }
        if (this.props.rightIconSource) {
            return (
                <Image
                    source={this.props.rightIconSource}
                    style = {{
                        ...defaultIconStyle,
                        ...(this.props.textStyle?.color ? {tintColor: this.props.textStyle?.color} : undefined),
                        ...this.props.rightIconStyle,
                    }}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                />
            )
        }
        return undefined
    }

    render() {
        let defaultButtonStyle = {...buttonStyles.noColor}
        let defaultTextStyle = {...styles.textStyle}
        // Update default button style
        if (this.props.appearance === "color") {
            defaultButtonStyle = buttonStyles.mainColor
        }
        // Add a shadow
        if (this.props.shadow !== false) {
            defaultButtonStyle = {
                ...defaultButtonStyle,
                ...defaults.smallShadow
            }
        }
        // Update default text style
        if (this.props.appearance === "light") {
            defaultTextStyle.color = colors.mainColor
            defaultTextStyle.fontFamily = fonts.medium
        } else if (this.props.appearance === "color") {
            defaultTextStyle.color = colors.whiteColor
        }
        defaultTextStyle.fontFamily = fonts.regular
        return (
            <TouchableOpacity
            style={{...defaultButtonStyle, ...this.props.buttonStyle, ...{
                justifyContent: this.props.rightIconSource != undefined || this.props.rightIconSource != undefined ? "space-between" : "center"
            }}}
            onPress={async () => {
                if (this.props.buttonFunc) {
                  if (this.props.showLoading === true) {
                    this.setState({loading: true})
                  }
                  await this.props.buttonFunc()
                  if (this.props.showLoading === true) {
                    this.setState({loading: false})
                  }
                }
              }}
            {...this.props.touchableProps}
            >
                {!this.state.loading ?
                    <>
                        {this.renderLeftIcon()}
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <Text style = {[defaultTextStyle, this.props.textStyle]} {...this.props.textProps}>
                                {this.props.text}
                            </Text>
                            {this.renderSubtext()}
                        </View>
                        {this.renderRightIcon()}
                    </> :
                    <LoadingCover
                        size={"small"}
                        style={{backgroundColor: "transparent"}}
                        indicatorProps={{
                            // Match the indicator color to the text color
                            color: this.props.textStyle?.color ? this.props.textStyle.color : defaultTextStyle.color
                        }}
                    />
                }
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
