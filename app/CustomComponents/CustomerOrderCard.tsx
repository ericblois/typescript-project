
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
import { capitalizeWords } from "../HelperFiles/ClientFunctions";

type Props = {
    orderData: OrderData,
    style?: ViewStyle,
    onPress?: (event?: GestureResponderEvent) => void
}

type State = {
    orderData: OrderData,
    businessData?: PublicBusinessData,
    imageLoaded: boolean
}

export default class CustomerOrderCard extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            orderData: props.orderData,
            businessData: undefined,
            imageLoaded: false
        }
        this.refreshData()
    }

    async refreshData() {
        const publicData = await CustomerFunctions.getPublicBusinessData(this.props.orderData.businessID)
        this.setState({businessData: publicData})
    }

    renderUI() {
        if (this.state.businessData) {
            const imgSrc = this.state.businessData.profileImage === "" ? icons.store : {uri: this.state.businessData.profileImage}
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
                    <Image
                        source={imgSrc}
                        style={{...styles.profileImage, ...{
                            tintColor: this.state.businessData.profileImage === "" ? colors.lighterGrayColor : undefined
                        }}}
                        onLoadEnd={() => {
                            this.setState({imageLoaded: true})
                        }}
                        resizeMethod={"scale"}
                        resizeMode={this.state.businessData.profileImage === "" ? "contain" : "cover"}
                    />
                    <View style={{flex: 1}}>
                        <Text
                            style={{...textStyles.large, ...{
                                textAlign: "left",
                                marginBottom: styleValues.minorPadding,
                            }}}
                        >{this.state.businessData.name}</Text>
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
                    >{`Status: ${capitalizeWords(this.state.orderData.status)}`}</Text>
                    <Text
                        style={{...textStyles.medium, ...{textAlign: "right"}}}
                    >{currencyFormatter.format(this.state.orderData.totalPrice)}</Text>
                </View>
            </TouchableOpacity>
            );
        }
    }

    renderLoading() {
        if (this.state.businessData === undefined || !this.state.imageLoaded) {
            return (
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: styleValues.bordRadius,
                    backgroundColor: colors.whiteColor
                }}>
                    <ActivityIndicator size={"small"}/>
                </View>
            )
        }
    }

    render() {
        return (
            <View
                style={{
                    ...styles.cardContainer,
                    ...defaults.smallShadow,
                    ...this.props.style
                }}
                onStartShouldSetResponder={() => (true)}
            >
                {this.renderUI()}
                {this.renderLoading()}
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