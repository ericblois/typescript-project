import React, { Component, Fragment } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, Image, GestureResponderEvent, ImageStyle } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues } from "../HelperFiles/StyleSheet";

type Props = {
    text: string,
    textStyle?: TextStyle,
    subtext?: string,
    subtextStyle?: TextStyle,
    leftIconSource?: number,
    leftIconStyle?: ImageStyle,
    rightIconSource?: number,
    rightIconStyle?: ImageStyle,
    buttonStyle?: ViewStyle,
    buttonFunc?: (event?: GestureResponderEvent) => void
}

type State = {}

export default class TextButton extends Component<Props, State> {

    static createButtons(buttonData: Props[]) {
        const buttons = buttonData.map((button: Props, index) => {
        return <TextButton text={button.text} buttonFunc={button.buttonFunc} key={index}/>;
        })
        return buttons;
    }

    renderSubtext() {
        if (this.props.subtext) {
            return (
                <Text style = {[styles.subtextStyle, this.props.subtextStyle]}>
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
                    resizeMode={"center"}
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
        return (
            <TouchableOpacity
            style={{...styles.buttonStyle, ...this.props.buttonStyle}}
            onPress={this.props.buttonFunc}
            >
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text style = {[styles.textStyle, this.props.textStyle]}>
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
        fontSize: styleValues.smallTextSize,
        color: styleValues.majorTextColor,
    },
    subtextStyle: {
        textAlign: "center",
        fontSize: styleValues.smallestTextSize,
        color: styleValues.minorTextColor
    },
    iconStyle: {
        aspectRatio: 1,
        maxWidth: "10%",
        maxHeight: "50%",
        tintColor: styleValues.darkGreyColor,
        alignSelf: "center",
        flexWrap: "wrap"
    },
    buttonStyle: {
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        height: styleValues.winWidth*0.15
    },
});
