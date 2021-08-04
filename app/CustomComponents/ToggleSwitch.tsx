import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { Text, View, StyleSheet, TextStyle, GestureResponderEvent, ImageStyle, ViewStyle } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { Icon, SwitchProps } from "react-native-elements";
import { Switch } from "react-native-gesture-handler";

type ToggleSwitchProps = {
    style?: ViewStyle,
    text?: string,
    textStyle?: TextStyle,
    textProps?: Text["props"],
    switchStyle?: ViewStyle,
    switchProps?: SwitchProps,
    shadow?: boolean,
    onToggle?: (value: boolean) => void
}

type State = {
    switchValue: boolean
}

export default class ToggleSwitch extends CustomComponent<ToggleSwitchProps, State> {

    constructor(props: ToggleSwitchProps) {
        super(props)
        this.state = {
            switchValue: false
        }
    }

    renderText() {
        if (this.props.text) {
            return (
                <Text
                    style={{...textStyles.medium, ...this.props.textStyle}}
                >
                    {this.props.text}
                </Text>
            )
        }
    }

  render() {
    return (
        <View
            style={{
                ...defaults.inputBox,
                ...styles.container,
                ...(this.props.shadow === true ? defaults.smallShadow : undefined),
                ...this.props.style
            }}
        >
            {this.props.children}
            {this.renderText()}
            <Switch
                style={{...styles.switch, ...this.props.switchStyle}}
                value={this.state.switchValue}
                trackColor={{
                    true: colors.mainColor,
                    false: colors.darkGrayColor
                }}
                onValueChange={(value) => {
                    this.setState({switchValue: value})
                    if (this.props.onToggle) {
                        this.props.onToggle(value)
                    }
                }}
                {...this.props.switchProps}
            />
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: styleValues.winWidth*0.125,
        padding: styleValues.minorPadding,
        paddingHorizontal: styleValues.mediumPadding,
        borderRadius: styleValues.bordRadius,
        backgroundColor: colors.whiteColor
    },
    switch: {

    },
})
