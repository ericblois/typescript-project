
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, FlatList } from "react-native";
import { defaults, styleValues } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { ProductCategory, ProductData } from "../HelperFiles/DataTypes";
import ProductCard from "./ProductCard";

type Props = {
    businessID: string,
    productIDs: string[],
    onLoadEnd?: () => void,
}

type State = {

}

export default class ProductCardList extends Component<Props, State> {

    loadCount = 0

    constructor(props: Props) {
        super(props);

    }

    renderProductCard(productID: string) {
        return (
            <ProductCard
                businessID={this.props.businessID}
                productID={productID}
                onLoadEnd={() => {
                    if (this.props.onLoadEnd) {
                        this.loadCount += 1
                        if (this.loadCount === this.props.productIDs.length) {
                            this.props.onLoadEnd()
                            this.loadCount = 0
                        }
                    }
                }}
            />
        )
    }

    render() {
        return (
        <FlatList
            data={this.props.productIDs}
            keyExtractor={(item) => (item)}
            renderItem={({item}) => {
                return this.renderProductCard(item)
            }}
        />
        );
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        borderColor: styleValues.bordColor,
        borderRadius: styleValues.bordRadius,
        borderWidth: styleValues.minorBorderWidth,
        height: styleValues.winWidth * 0.3,
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        marginTop: styleValues.mediumPadding,
        padding: styleValues.minorPadding,
        flexDirection: "row",
        alignItems: "center",
    },
    productImage: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: styleValues.minorPadding,
        marginRight: styleValues.minorPadding
    },
    productInfoArea: {
        height: "100%",
        flex: 1,
    },
    productName: {
        fontSize: styleValues.mediumTextSize
    },
    productDescription: {
        fontSize: styleValues.smallestTextSize,
        color: styleValues.minorTextColor
    },
    productPrice: {
        fontSize: styleValues.smallTextSize
    },
    productSubInfoArea: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        position: "absolute",
        bottom: 0
    }
})