import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Text, Image, TextStyle, ViewStyle, View, TextInput, KeyboardAvoidingView, ImageStyle } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, } from "../HelperFiles/StyleSheet";

type SearchBarProps = {
    barStyle?: ViewStyle,
    textStyle?: TextStyle,
    iconStyle?: ImageStyle,
    barProps?: KeyboardAvoidingView['props'],
    textProps?: TextInput['props'],
    iconProps?: Image["props"],
    avoidKeyboard?: boolean,
    onClearText?: () => void
}

type State = {
    searchText: string,
    shouldAvoid: boolean
}

export default class SearchBar extends CustomComponent<SearchBarProps, State> {

    constructor(props: SearchBarProps) {
        super(props)
        this.state = {
            searchText: "",
            shouldAvoid: false
        }
    }

    render() {
        return (
            <View
                {...this.props.barProps}
                style={{
                    ...defaults.inputBox,
                    ...defaults.mediumShadow,
                    position: "absolute",
                    top: styleValues.mediumPadding,
                    elevation: 10,
                    flexDirection: "row",
                    padding: styleValues.minorPadding,
                    borderWidth: 0,
                    ...this.props.barStyle
                }}
            >
                <Image
                    source={icons.search}
                    style={{
                        height: "80%",
                        flex: 0.1,
                        tintColor: colors.lightGrayColor,
                        ...this.props.iconStyle,
                    }}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                    {...this.props.iconProps}
                ></Image>
                <TextInput
                    style={{
                        ...defaults.inputText,
                        textAlign: "left",
                        ...this.props.textStyle
                    }}
                    disableFullscreenUI={true}
                    focusable={true}
                    textAlign={"center"}
                    textAlignVertical={"center"}
                    autoCorrect={false}
                    clearButtonMode={"while-editing"}
                    {...this.props.textProps}
                    onChangeText={(text) => {
                        if (text === "" && this.props.onClearText) {
                            this.props.onClearText()
                        }
                        if (this.props.textProps?.onChangeText) {
                            this.props.textProps?.onChangeText(text)
                        }
                    }}
                    onFocus={(e) => {
                        this.setState({shouldAvoid: true})
                        if (this.props.textProps?.onFocus) {
                            this.props.textProps.onFocus(e)
                        }
                    }}
                    onEndEditing={(e) => {
                        this.setState({shouldAvoid: false})
                        if (this.props.textProps?.onEndEditing) {
                            this.props.textProps.onEndEditing(e)
                        }
                    }}
                >
                    {this.props.children}
                </TextInput>
            </View>
            )
    }
}
