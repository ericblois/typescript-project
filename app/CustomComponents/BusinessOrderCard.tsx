
import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, ActivityIndicator, ViewStyle } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency, currencyFormatter } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { OrderData, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { color } from "react-native-elements/dist/helpers";

type Props = {
    orderData: OrderData,
    style?: ViewStyle,
    onPress?: (event?: GestureResponderEvent) => void
}

type State = {
    orderData: OrderData,
}

export default class BusinessOrderCard extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            orderData: props.orderData,
        }
    }

    renderUI() {
        return (
        <TouchableOpacity
            style={{width: "100%", height: "100%"}}
            onPress={() => {
                if (this.props.onPress) {
                    this.props.onPress();
                }
            }}
        >
            <View style={{flex: 1, flexDirection: "row"}}>
                <View style={{flex: 1}}>
                    <Text
                        style={{...textStyles.large, ...{
                            textAlign: "left",
                            marginBottom: styleValues.minorPadding,
                        }}}
                    >{this.state.orderData.shippingInfo.name}</Text>
                    <Text
                        style={{...textStyles.small, ...{
                            textAlign: "left",
                            color: colors.grayColor
                        }}}
                    >{`Order ID: #${this.state.orderData.orderID}`}</Text>
                </View>
            </View>
            <View style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                borderTopWidth: styleValues.minorBorderWidth,
                borderColor: colors.lighterGrayColor,
                paddingTop: styleValues.minorPadding,
                marginTop: styleValues.minorPadding,
            }}>
                <Text
                    style={{...textStyles.medium, ...{textAlign: "left"}}}
                >{`Status: ${this.state.orderData.status}`}</Text>
                <Text
                    style={{...textStyles.medium, ...{textAlign: "right"}}}
                >{currencyFormatter.format(this.state.orderData.totalPrice)}</Text>
            </View>
        </TouchableOpacity>
        );
    }

    render() {
        return (
            <View
                style={{
                    ...styles.cardContainer,
                    ...defaults.smallShadow,
                    ...this.props.style
                }}
            >
                {this.renderUI()}
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