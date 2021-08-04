import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, Image, StyleSheet, FlatList, Text, ImageStyle } from "react-native";
import { defaults, textStyles, buttonStyles, icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import { accessPhotos } from "../HelperFiles/ClientFunctions"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import MapView, { LatLng, Marker, Overlay, Region } from "react-native-maps"
import IconButton from "../CustomComponents/IconButton"
import TextInputBox from "../CustomComponents/TextInputBox"

type Props = {
    initialText?: string,
    onTapAway?: () => void,
    onSaveText?: (text: string) => void,
    textInputProps?: TextInputBox['props']
}

type State = {
    currentText: string
}

export default class TextInputPopup extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            currentText: props.initialText ? props.initialText : ""
        }
    }

    renderSaveButton() {
        return (
            <IconButton
                iconSource={icons.checkBox}
                buttonStyle={styles.saveButton}
                iconStyle={{tintColor: colors.whiteColor}}
                buttonFunc={() => {
                    if (this.props.onSaveText) {
                        this.props.onSaveText(this.state.currentText)
                    }
                }}
                showLoading={true}
            />
        )
    }

    render() {
        return (
            <View
                style={styles.container}
            >
                <TouchableOpacity
                    style={styles.outsideTouchable}
                    onPress={this.props.onTapAway}
                >
                    <TextInputBox
                        style={{...buttonStyles.noColor, ...styles.textInput}}
                        textProps={{...{
                            onChangeText: (text) => {
                                this.setState({currentText: text})
                            },
                        }, ...this.props.textInputProps?.textProps}}
                        focusOnStart={true}
                        {...this.props.textInputProps}
                    />
                </TouchableOpacity>
                {this.renderSaveButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: styleValues.winWidth,
        height: styleValues.winHeight,
        padding: styleValues.mediumPadding,
        top: 0,
        left:  0,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    outsideTouchable: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {

    },
    saveButton: {
        position: "absolute",
        top: "55%",
        right: styleValues.mediumPadding
    }
})