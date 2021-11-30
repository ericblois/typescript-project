import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, Image, StyleSheet, FlatList, Text, ImageStyle, TextStyle, ViewStyle } from "react-native";
import { defaults, textStyles, buttonStyles, icons, styleValues, colors, menuBarHeight, fonts } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import { accessPhotos } from "../HelperFiles/ClientFunctions"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import MapView, { LatLng, Marker, Overlay, Region } from "react-native-maps"
import IconButton from "./IconButton"
import TextInputBox from "./TextInputBox"
import TextButton from "./TextButton";

type Props = {
    type: "save" | "delete",
    showConfirmLoading?: boolean,
    showDenyLoading?: boolean,
    onConfirm?: () => void,
    onDeny?: () => void,
    onExit?: () => void
}

type State = {}

export default class ConfirmationPopup extends CustomComponent<Props, State> {

    headerText: string
    descriptionText: string
    denyText: string
    confirmText: string
    denyButtonStyle: ViewStyle
    denyTextStyle: TextStyle
    confirmButtonStyle: ViewStyle
    confirmTextStyle: TextStyle

    constructor(props: Props) {
        super(props)
        this.state = {

        }
        // Set save text
        if (props.type === "save") {
            this.headerText = "Unsaved changes"
            this.descriptionText = "You have unsaved changes. Would you like to save before continuing?"
            this.denyText = "Don't save"
            this.confirmText = "Save"
            this.denyButtonStyle = {...buttonStyles.noColor}
            this.denyTextStyle = {color: colors.invalidColor}
            this.confirmButtonStyle = {...buttonStyles.mainColor}
            this.confirmTextStyle = {
                color: colors.whiteColor,
                fontFamily: fonts.medium
            }
        } else {
            this.headerText = "Delete"
            this.descriptionText = "Are you sure you would like to delete?"
            this.denyText = "Cancel"
            this.confirmText = "Delete"
            this.denyButtonStyle = {...buttonStyles.noColor}
            this.denyTextStyle = {color: colors.blackColor}
            this.confirmButtonStyle = {...buttonStyles.noColor}
            this.confirmTextStyle = {
                color: colors.invalidColor,
                fontFamily: fonts.medium
            }
        }
    }

    renderConfirmButton() {
        return (
            <TextButton
                text={this.confirmText}
                buttonStyle={{
                    flex: 1,
                    ...this.confirmButtonStyle
                }}
                textStyle={{
                    ...textStyles.medium,
                    ...this.confirmTextStyle
                }}
                buttonFunc={async () => {
                    if (this.props.onConfirm) {
                        await this.props.onConfirm()
                    }
                }}
                showLoading={this.props.showConfirmLoading ? this.props.showConfirmLoading : true}
            />
        )
    }

    renderDenyButton() {
        return (
            <TextButton
                text={this.denyText}
                textStyle={{
                    ...textStyles.medium,
                    ...this.denyTextStyle
                }}
                buttonStyle={{
                    flex: 1,
                    ...this.denyButtonStyle
                }}
                buttonFunc={async () => {
                    if (this.props.onDeny) {
                        await this.props.onDeny()
                    }
                }}
                showLoading={this.props.showDenyLoading ? this.props.showDenyLoading : true}
            />
        )
    }

    renderExitButton() {
        if (this.props.onExit) {
            return (
                <IconButton
                    iconSource={icons.cross}
                    buttonStyle={styles.exitButton}
                    iconStyle={{tintColor: colors.whiteColor}}
                    buttonFunc={() => this.props.onExit!()}
                />
            )
        }
    }

    render() {
        return (
            <View
                style={styles.container}
            >
                <View
                    style={styles.outsideTouchable}
                />
                <View style={{
                    position: "absolute",
                    padding: styleValues.iconSmallSize,
                    paddingBottom: styleValues.iconSmallSize + menuBarHeight,
                    maxWidth: styleValues.winWidth*0.8
                }}>
                    <View
                        style={{
                            ...defaults.inputBox,
                            height: undefined,
                            width: "100%",
                            padding: styleValues.mediumPadding,
                        }}
                    >
                        <Text
                            style={{
                                ...textStyles.largeHeader,
                                marginTop: 0,
                            }}
                        >{this.headerText}</Text>
                        <Text
                            style={{
                                ...defaults.inputText,
                            }}
                        >{this.descriptionText}</Text>
                    </View>
                    <View 
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%"
                        }}
                    >
                        {this.renderDenyButton()}
                        <View style={{width: styleValues.mediumPadding}}/>
                        {this.renderConfirmButton()}
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
    button: {
        width: styleValues.iconSmallSize,
        height: styleValues.iconSmallSize,
        top: 0,
        right: 0
    },
    exitButton: {
        position: "absolute",
        width: styleValues.iconSmallSize,
        height: styleValues.iconSmallSize,
        top: 0,
        right: 0
    }
})