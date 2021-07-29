import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View, GestureResponderEvent } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";

type DateScrollPickerProps = {
    style?: ViewStyle,
    extraProps?: (typeof DateTimePicker)['defaultProps'],
}

type State = {}

export default class DateScrollPicker extends Component<DateScrollPickerProps, State> {

    render() {
        return (
            <DateTimePicker
                    style={[defaults.dateScrollPicker, this.props.style]}
                    value={new Date()}
                    mode={"date"}
                    display={"spinner"}
                    {...this.props.extraProps}
                />
            )
    }
}
