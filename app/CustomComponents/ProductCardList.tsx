
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, FlatList, ActivityIndicator } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { CartItem, ProductCategory, ProductData } from "../HelperFiles/DataTypes";
import ProductCard from "./ProductCard";
import ItemList from "./ItemList";
import ProductCartCard from "./ProductCartCard";

type ProductInfo = {
    businessID: string,
    productID: string,
    onPress?: () => void
}

type Props = {
    products: (ProductInfo | CartItem)[],
    editable?: boolean,
    showLoading?: boolean,
    scrollable?: boolean,
    onLoadEnd?: () => void,
    onDeleteItem?: () => void,
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
                key={product.productID}
            />
        )
    }

    renderCartCard(item: CartItem, key?: string) {
        return (
            <ProductCartCard
                cartItem={item}
                editable={this.props.editable}
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
                onDelete={this.props.onDeleteItem}
                key={key}
            />
        )
    }

    renderUI() {
        if (this.props.scrollable) {
            return (
            <ItemList
                data={this.props.products}
                keyExtractor={(item, index) => (index.toString())}
                renderItem={({item}) => {
                    // Check if item is a CartItem
                    if ((item as CartItem).quantity) {
                        return this.renderCartCard(item as CartItem)
                    } else {
                        return this.renderProductCard(item as ProductInfo)
                    }
                }}
                contentContainerStyle={{marginBottom: styleValues.mediumPadding}}
            />
            )
        } else {
            return (
                this.props.products.map((item, index) => {
                     // Check if item is a CartItem
                     if ((item as CartItem).quantity) {
                        return this.renderCartCard(item as CartItem, index.toString())
                    } else {
                        return this.renderProductCard(item as ProductInfo)
                    }
                })
            )
        }
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
                    backgroundColor: colors.whiteColor
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
        borderColor: colors.grayColor,
        borderRadius: styleValues.bordRadius,
        borderWidth: styleValues.minorBorderWidth,
        height: styleValues.winWidth * 0.3,
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        marginTop: styleValues.mediumPadding,
        padding: styleValues.minorPadding,
        flexDirection: "row",
        alignItems: "center",
    },
})