
import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, ActivityIndicator } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency, currencyFormatter } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { ProductData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import LoadingCover from "./LoadingCover";

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

export default class ProductCard extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            totalRating: 0,
            productData: undefined,
            imageLoaded: false
        }
    }

    refreshData() {
        CustomerFunctions.getProduct(this.props.businessID, this.props.productID).then((productData) => {
            let totalRating = 0;
            productData.ratings.forEach((num) => {
                totalRating += num
            })
            const isImage = productData.images.length > 0
            this.setState({productData: productData, totalRating: totalRating / productData.ratings.length, imageLoaded: !isImage})
        })
    }

    componentDidMount() {
        this.refreshData()
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
                    numberOfLines={2}
                    >
                        {this.state.productData.description}
                    </Text>
                    <View style={styles.productSubInfoArea}>
                        <RatingVisual rating={this.state.totalRating} height={styleValues.smallTextSize}/>
                        <Text style={styles.productPrice}>{this.state.productData.price ? currencyFormatter.format(this.state.productData.price) : "No price"}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            );
        }
    }

    renderLoading() {
        if (this.state.productData === undefined || !this.state.imageLoaded) {
            return (
                <LoadingCover style={{backgroundColor: colors.whiteColor}}/>
            )
        }
    }

    render() {
        if (this.state.productData?.isVisible === true) {
            return (
                <View style={{
                    ...styles.cardContainer,
                    ...defaults.smallShadow
                }}>
                    {this.renderUI()}
                    {this.renderLoading()}
                </View>
            )
        }
        return (<></>)
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: styleValues.bordRadius,
        height: styleValues.winWidth * 0.3,
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        marginBottom: styleValues.mediumPadding,
        padding: styleValues.mediumPadding,
        flexDirection: "row",
        alignItems: "center",
    },
    productImage: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: styleValues.bordRadius,
        marginRight: styleValues.mediumPadding
    },
    productInfoArea: {
        height: "100%",
        flex: 1,
    },
    productName: {
        ...textStyles.medium,
        textAlign: "left",
    },
    productDescription: {
        ...textStyles.smaller,
        textAlign: "left",
        color: styleValues.minorTextColor,
    },
    productPrice: {
        ...textStyles.medium
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