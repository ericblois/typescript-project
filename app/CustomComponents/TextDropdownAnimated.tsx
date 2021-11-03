import React, { Component, useRef } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle, View, GestureResponderEvent, Platform, UIManager, LayoutAnimation } from "react-native";
import PropTypes from 'prop-types';
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import { TextInput } from "react-native-gesture-handler";
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';
import TextButton from "./TextButton";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

type TextDropdownAnimatedProps = {
    placeholderText: string,
    items: {
        text: string,
        value: any
    }[],
    onSelect: (text: string, value: any) => void,
    style?: ViewStyle,
    dropdownProps?: (typeof DropDownPicker)['defaultProps'],
}

type State = {
    expanded: boolean,
    selectedText?: string,
    selectedValue?: any
}

export default class TextDropdownAnimated extends CustomComponent<TextDropdownAnimatedProps, State> {

    constructor(props: TextDropdownAnimatedProps) {
        super(props)
        this.state = {
            expanded: false,
            selectedText: undefined,
            selectedValue: undefined
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
        return (
            this.props.items.map(({text, value}, index) => {
                return (
                    <Animated.View
                        style={{
                            height: this.dropdownHeight,
                            opacity: this.dropdownOpacity
                        }}
                        key={index.toString()}
                    >
                        <TextButton
                            text={text}
                            buttonStyle={{
                                ...defaults.inputBox,
                                marginBottom: 0
                            }}
                            textStyle={{...textStyles.small}}
                            buttonFunc={() => {
                                this.collapse()
                                this.setState({
                                    selectedText: text,
                                    selectedValue: value,
                                    expanded: false
                                }, () => {
                                    if (this.props.onSelect) {
                                        this.props.onSelect(text, value)
                                    }
                                })
                                
                            }}
                        />
                    </Animated.View>
                )
            })
        )
    }

    render() {
        return (
            <>
            <View style={{width: "100%", marginBottom: styleValues.mediumPadding}}>
                <TextButton
                    text={this.props.placeholderText}
                    buttonStyle={{
                        ...defaults.inputBox,
                        marginBottom: 0,
                    }}
                    textStyle={{...textStyles.small}}
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
