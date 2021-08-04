import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, TextInput, KeyboardAvoidingView } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, } from "../HelperFiles/StyleSheet";
import IconButton from "./IconButton";

type TextHeaderProps = {
    boxStyle?: ViewStyle,
    textStyle?: TextStyle,
    boxProps?: KeyboardAvoidingView['props'],
    textProps?: TextInput['props'],
    infoButton?: boolean,
    infoButtonFunc?: () => void,
    infoButtonStyle?: ViewStyle,
    leftButtonSource?: number,
    leftButtonFunc?: () => void,
    leftButtonStyle?: ViewStyle
}

type State = {

}

export default class TextHeader extends CustomComponent<TextHeaderProps, State> {

    constructor(props: TextHeaderProps) {
        super(props)
        this.state = {

        }
    }

    renderLeftIcon() {
        if (this.props.leftButtonSource) {
            return (
                <IconButton
                    iconSource={this.props.leftButtonSource}
                    buttonStyle={{
                        ...styles.iconButton,
                        ...this.props.leftButtonStyle
                    }}
                    buttonFunc={this.props.leftButtonFunc}
                />
            )
        } else {
            return (
                <View style={styles.iconButton}/>
            )
        }
    }

    renderInfoIcon() {
        if (this.props.infoButton !== false) {
            return (
                <IconButton
                    iconSource={icons.info}
                    buttonStyle={{
                        ...styles.iconButton,
                        ...this.props.infoButtonStyle
                    }}
                    buttonFunc={this.props.infoButtonFunc}
                />
            )
        } else {
            return (
                <View style={styles.iconButton}/>
            )
        }
    }

    render() {
        return (
            <View
                style={{
                    paddingBottom: styleValues.mediumPadding,
                    overflow: "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0
                }}
            >
                <View
                    style={{
                        ...defaults.textHeaderBox,
                        ...defaults.mediumShadow,
                        ...this.props.boxStyle,
                    }}
                    {...this.props.boxProps}
                >
                    {this.renderLeftIcon()}
                    <Text 
                        style={{
                            ...textStyles.largerHeader,
                            ...this.props.textStyle
                        }}
                        {...this.props.textProps}
                    >{this.props.children}</Text>
                    {this.renderInfoIcon()}
                </View>
            </View>
            )
    }
}

const styles = StyleSheet.create({
    iconButton: {
        width: "7%",
        aspectRatio: 1
    }
})