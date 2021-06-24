
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent } from "react-native";
import { defaults, styleValues } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency, ProductData } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";

type Props = {
    productData: ProductData,
    onLoadEnd?: () => void,
    onPress?: (event?: GestureResponderEvent) => void
}

type State = {
    totalRating: number
}

export default class ProductCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            totalRating: 0,
        }
    }

    componentDidMount() {
        let count = 0;
        let totalRating = 0;
        this.props.productData.ratings.forEach((num, index) => {
            count += num;
            totalRating += num*(index+1);
        })
        this.setState({totalRating: totalRating / count});
    }

    render() {
        return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => {
            if (this.props.onPress) {
                this.props.onPress();
            }
        }}>
            <Image
                style={styles.productImage}
                resizeMethod={"scale"}
                resizeMode={"cover"}
                source={{uri: this.props.productData.images[0]}}
                onLoadEnd={() => {
                    if (this.props.onLoadEnd) {
                        this.props.onLoadEnd();
                    }
                }}
            />
            <View style={styles.productInfoArea}>
                <Text style={styles.productName}>{this.props.productData.name}</Text>
                <Text
                style={styles.productDescription}
                numberOfLines={3}
                >
                    {this.props.productData.description}
                </Text>
                <View style={styles.productSubInfoArea}>
                        <Text style={styles.productPrice}>{currency + this.props.productData.price.toString()}</Text>
                        <RatingVisual rating={this.state.totalRating} height={styleValues.smallTextSize}/>
                    </View>
            </View>
        </TouchableOpacity>
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