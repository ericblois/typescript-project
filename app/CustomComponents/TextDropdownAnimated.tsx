import React, { Component, useRef } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle, View, GestureResponderEvent, Platform, UIManager, LayoutAnimation, TextStyle } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, fonts, } from "../HelperFiles/StyleSheet";
import { TextInput } from "react-native-gesture-handler";
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';
import TextButton from "./TextButton";

type TextDropdownAnimatedProps = {
    placeholderText: string,
    items: {
        text: string,
        value: any
    }[],
    showValidSelection?: boolean,
    enableMultiple?: boolean,
    onSelect?: (selections: {text: string, value: any}[]) => void,
    style?: ViewStyle,
    textStyle?: TextStyle,
}

type State = {
    expanded: boolean,
    selections: {text: string, value: any}[]
}

export default class TextDropdownAnimated extends CustomComponent<TextDropdownAnimatedProps, State> {

    constructor(props: TextDropdownAnimatedProps) {
        super(props)
        this.state = {
            expanded: false,
            selections: []
        }
        
    }

    dropdownHeight = new Animated.Value(0)
    dropdownOpacity = new Animated.Value(0)

    expand() {
        Animated.sequence([
            Animated.timing(this.dropdownHeight, {
                toValue: styleValues.winWidth*0.1,
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.dropdownOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false
            })
        ]).start()
    }

    collapse() {
        Animated.sequence([
            Animated.timing(this.dropdownOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.dropdownHeight, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            })
        ]).start()
    }

    renderItems() {
        const selectedNames = this.state.selections.map(({text}) => text)
        return (
            this.props.items.map(({text, value}, index) => {
                return (
                    <Animated.View
                        style={{
                            height: this.dropdownHeight,
                            opacity: this.dropdownOpacity,
                        }}
                        key={index.toString()}
                    >
                        <TextButton
                            text={text}
                            appearance={selectedNames.includes(text) ? "light" : "no-color"}
                            buttonStyle={{
                                height: undefined,
                                paddingVertical: 0,
                                flex: 1,
                                marginTop: styleValues.minorPadding,
                                marginBottom: 0,
                                borderColor: colors.mainColor,
                                borderWidth: selectedNames.includes(text) ? styleValues.minorBorderWidth : 0
                            }}
                            textStyle={{
                                ...textStyles.smaller,
                                fontFamily: selectedNames.includes(text) ? fonts.medium : fonts.regular,
                                ...this.props.textStyle
                            }}
                            buttonFunc={() => {
                                if (this.props.enableMultiple !== true) {
                                    this.collapse()
                                    this.setState({
                                        selections: [{text: text, value: value}],
                                        expanded: false
                                    }, () => {
                                        if (this.props.onSelect) {
                                            this.props.onSelect(this.state.selections)
                                        }
                                    })
                                } else {
                                    let newSelections = this.state.selections
                                    // Check if option was already selected
                                    const optionIndex = this.state.selections.findIndex((selection) => {
                                        return selection.text === text
                                    })
                                    if (optionIndex > -1) {
                                        // Remove selection
                                        newSelections.splice(optionIndex)
                                    } else {
                                        // Add selection
                                        newSelections.push({text: text, value: value})
                                    }
                                    this.setState({
                                        selections: newSelections
                                    }, () => {
                                        if (this.props.onSelect) {
                                            this.props.onSelect(this.state.selections)
                                        }
                                    })
                                }
                                
                            }}
                        />
                    </Animated.View>
                )
            })
        )
    }

    render() {
        let mainText = this.state.selections.length > 0 ? `${this.props.placeholderText}: ${this.state.selections[0].text}` : this.props.placeholderText
        return (
            <>
            <View style={{
                width: "100%",
                marginBottom: styleValues.mediumPadding,
                ...this.props.style
            }}>
                <TextButton
                    text={mainText}
                    buttonStyle={{
                        ...defaults.inputBox,
                        marginBottom: 0,
                    }}
                    textStyle={{
                        ...textStyles.small,
                        ...this.props.textStyle,
                        fontFamily: this.state.selections.length > 0 && this.props.showValidSelection === true ? fonts.medium : fonts.regular,
                        color: this.state.selections.length > 0 && this.props.showValidSelection === true ? colors.mainColor : colors.blackColor
                    }}
                    buttonFunc={() => {
                        if (this.state.expanded) {
                            this.collapse()
                        } else {
                            this.expand()
                        }
                        this.setState({expanded: !this.state.expanded})
                    }}
                />
                {this.renderItems()}
            </View>
            </>
        )
    }
}
