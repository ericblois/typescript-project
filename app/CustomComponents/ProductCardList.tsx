
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, FlatList, ActivityIndicator } from "react-native";
import { defaults, styleValues } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { ProductCategory, ProductData } from "../HelperFiles/DataTypes";
import ProductCard from "./ProductCard";

type ProductInfo = {
    businessID: string,
    productID: string,
    onPress?: () => void
}

type Props = {
    products: ProductInfo[],
    showLoading?: boolean
    onLoadEnd?: () => void,
}

type State = {
    cardsLoaded: boolean
}

export default class ProductCardList extends Component<Props, State> {

    loadCount = 0

    constructor(props: Props) {
        super(props);
        this.state = {
            cardsLoaded: false
        }
    }

    renderProductCard(product: ProductInfo) {
        return (
            <ProductCard
                businessID={product.businessID}
                productID={product.productID}
                onLoadEnd={() => {
                    this.loadCount += 1
                    if (this.loadCount === this.props.products.length) {
                        this.setState({cardsLoaded: true}, () => {
                            if (this.props.onLoadEnd) {
                                this.props.onLoadEnd!()
                            }
                            this.loadCount = 0
                        })
                    }
                }}
                onPress={product.onPress}
            />
        )
    }

    renderUI() {
        return (
        <FlatList
            data={this.props.products}
            keyExtractor={(item) => (item.productID)}
            renderItem={({item}) => {
                return this.renderProductCard(item)
            }}
        />
        )
    }

    renderLoading() {
        if (this.props.showLoading === true && !this.state.cardsLoaded) {
            return (
                <View style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: styleValues.whiteColor
                }}>
                    <ActivityIndicator size={"large"}/>
                </View>
            )
        }
    }

    render() {
        return (
            <View>
                {this.renderUI()}
                {this.renderLoading()}
            </View>
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