import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, Image, StyleSheet, FlatList, Text, ImageStyle, TextStyle, ViewStyle } from "react-native";
import { defaults, textStyles, buttonStyles, icons, styleValues, colors, menuBarHeight } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import { accessPhotos } from "../HelperFiles/ClientFunctions"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import MapView, { LatLng, Marker, Overlay, Region } from "react-native-maps"
import IconButton from "../CustomComponents/IconButton"
import TextInputBox from "../CustomComponents/TextInputBox"

type Props = {
    headerText?: string,
    textStyle?: TextStyle,
    boxStyle?: ViewStyle,
    onExit?: () => void,
    textProps?: Text["props"]
}

type State = {}

export default class TextInfoPopup extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {

        }
    }

    renderExitButton() {
        return (
            <IconButton
                iconSource={icons.cross}
                buttonStyle={styles.exitButton}
                iconStyle={{tintColor: colors.whiteColor}}
                buttonFunc={() => {
                    if (this.props.onExit) {
                        this.props.onExit()
                    }
                }}
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
                    onPress={() => {
                        console.log("background")
                        if (this.props.onExit) {
                            this.props.onExit()
                        }
                    }}
                />
                <View style={{
                    position: "absolute",
                    padding: styleValues.iconSmallSize,
                    paddingBottom: styleValues.iconSmallSize + menuBarHeight
                }}>
                    <View
                        style={{
                            ...defaults.inputBox,
                            height: undefined,
                            maxWidth: styleValues.winWidth*0.8,
                            padding: styleValues.mediumPadding,
                            ...this.props.boxStyle
                        }}
                    >
                        {this.props.headerText === undefined ? undefined : 
                        <Text
                            style={{
                                ...textStyles.largeHeader,
                                marginTop: 0,
                                ...this.props.textStyle
                            }}
                            {...this.props.textProps}
                        >{this.props.headerText}</Text>}
                        <Text
                            style={{
                                ...defaults.inputText,
                                ...this.props.textStyle
                            }}
                            {...this.props.textProps}
                        >{this.props.children}</Text>
                    </View>
                    {this.renderExitButton()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: styleValues.winWidth,
        height: styleValues.winHeight,
        padding: styleValues.mediumPadding,
        top: 0,
        bottom: 0,
        left:  0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    outsideTouchable: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    textBox: {

    },
    exitButton: {
        position: "absolute",
        width: styleValues.iconSmallSize,
        height: styleValues.iconSmallSize,
        top: 0,
        right: 0
    }
})