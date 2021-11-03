import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, GestureResponderEvent } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import { TextInput } from "react-native-gesture-handler";
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';

type TextDropdownProps = {
    items?: DropDownPickerProps["items"],
    style?: ViewStyle,
    dropdownProps?: (typeof DropDownPicker)['defaultProps'],
}

type State = {}

export default class TextDropdown extends CustomComponent<TextDropdownProps, State> {

    render() {
        return (
            <DropDownPicker
                containerStyle={[defaults.dropdownContainer, this.props.style]}
                style={{
                    borderWidth: 0,
                    margin: 0
                }}
                // Text Styles
                placeholderStyle={[defaults.dropdownText, {color: styleValues.minorTextColor}]}
                labelStyle={defaults.dropdownText}
                searchableStyle={defaults.dropdownText}
                activeLabelStyle={defaults.dropdownText}
                selectedLabelStyle={defaults.dropdownText}
                items={this.props.items ? this.props.items : []}
                {...this.props.dropdownProps}
            />
        )
    }
}
