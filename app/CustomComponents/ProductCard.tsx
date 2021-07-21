
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, ActivityIndicator } from "react-native";
import { defaults, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { ProductData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type Props = {
    businessID: string,
    productID: string,
    onLoadEnd?: () => void,
    onPress?: (event?: GestureResponderEvent) => void
}

type State = {
    totalRating: number
    productData?: ProductData,
    imageLoaded: boolean
}

export default class ProductCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            totalRating: 0,
            productData: undefined,
            imageLoaded: false
        }
    }

    componentDidMount() {
        CustomerFunctions.getProduct(this.props.businessID, this.props.productID).then((productData) => {
            let totalRating = 0;
            productData.ratings.forEach((num) => {
                totalRating += num
            })
            this.setState({productData: productData, totalRating: totalRating / productData.ratings.length})
        })
    }

    renderUI() {
        if (this.state.productData) {
            return (
            <TouchableOpacity style={{
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
                width: "100%"
            }} onPress={() => {
                if (this.props.onPress) {
                    this.props.onPress();
                }
            }}>
                <Image
                    style={styles.productImage}
                    resizeMethod={"scale"}
                    resizeMode={"cover"}
                    source={{uri: this.state.productData.images[0]}}
                    onLoadEnd={() => {
                        this.setState({imageLoaded: true}, () => {
                            if (this.props.onLoadEnd) {
                                this.props.onLoadEnd();
                            }
                        })
                    }}
                />
                <View style={styles.productInfoArea}>
                    <Text style={styles.productName}>{this.state.productData.name}</Text>
                    <Text
                    style={styles.productDescription}
                    numberOfLines={3}
                    >
                        {this.state.productData.description}
                    </Text>
                    <View style={styles.productSubInfoArea}>
                        <Text style={styles.productPrice}>{this.state.productData.price ? currency + this.state.productData.price.toString() : "No price"}</Text>
                        <RatingVisual rating={this.state.totalRating} height={styleValues.smallTextSize}/>
                    </View>
                </View>
            </TouchableOpacity>
            );
        }
    }

    renderLoading() {
        if (this.state.productData === undefined || !this.state.imageLoaded) {
            return (
                <View style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.whiteColor
                }}>
                    <ActivityIndicator size={"small"}/>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.cardContainer}>
                {this.renderUI()}
                {this.renderLoading()}
            </View>
        )
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