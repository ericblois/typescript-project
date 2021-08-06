
import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, ActivityIndicator, ViewStyle, ActivityIndicatorProps } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency, currencyFormatter } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { OrderData, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { color } from "react-native-elements/dist/helpers";

type Props = {
    style?: ViewStyle,
    size?: "small" | "large",
    indicatorProps?: ActivityIndicatorProps
}

type State = {
}

export default class LoadingCover extends CustomComponent<Props, State> {

    render() {
        return (
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: styleValues.bordRadius,
                    backgroundColor: colors.backgroundColor,
                    ...this.props.style
                }}
            >
                <ActivityIndicator
                    size={this.props.size}
                    {...this.props.indicatorProps}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: styleValues.bordRadius,
        minHeight: styleValues.winWidth * 0.25,
        width: "100%",
        padding: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: styleValues.winWidth * 0.15,
        aspectRatio: 1,
        borderRadius: styleValues.minorPadding,
        marginRight: styleValues.mediumPadding
    },
})