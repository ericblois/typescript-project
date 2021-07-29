import React, { Component } from "react";
import { Text, View, StyleSheet, TextStyle, GestureResponderEvent, ImageStyle, ViewStyle } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { Icon } from "react-native-elements";
import { Switch } from "react-native-gesture-handler";

type ToggleSwitchProps = {
    style?: ViewStyle,
    text?: string,
    textStyle?: TextStyle,
    textProps?: Text["props"],
    switchStyle?: ViewStyle,
    switchProps?: Switch['propTypes'],
    onToggle?: (value: boolean) => void
}

type State = {
    switchValue: boolean
}

export default class ToggleSwitch extends Component<ToggleSwitchProps, State> {

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
                    style={{...textStyles.small, ...this.props.textStyle}}
                >
                    {this.props.text}
                </Text>
            )
        }
    }

  render() {
    return (
        <View
            style={{...styles.container, ...this.props.style}}
        >
            {this.renderText()}
            <Switch
                style={{...styles.switch, ...this.props.switchStyle}}
                value={this.state.switchValue}
                onValueChange={(value) => {
                    this.setState({switchValue: value})
                    if (this.props.onToggle) {
                        this.props.onToggle(value)
                    }
                }}
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
        padding: styleValues.mediumPadding,
        borderRadius: styleValues.bordRadius,
        borderWidth: styleValues.minorBorderWidth,
        borderColor: colors.grayColor
    },
    switch: {

    },
})
