
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, ActivityIndicator } from "react-native";
import { defaults, icons, styleValues } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency, currencyFormatter } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { CartItem, ProductData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { IconButton } from "../HelperFiles/CompIndex";

type Props = {
    cartItem: CartItem,
    onLoadEnd?: () => void,
    onPress?: (event?: GestureResponderEvent) => void,
    onDelete?: () => void
}

type State = {
    totalRating: number
    productData?: ProductData,
    cartItem: CartItem,
    imageLoaded: boolean
}

export default class ProductCartCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            totalRating: 0,
            productData: undefined,
            cartItem: props.cartItem,
            imageLoaded: false
        }
        this.refreshData()
    }

    refreshData() {
        CustomerFunctions.getProduct(this.state.cartItem.businessID, this.state.cartItem.productID).then((productData) => {
            // Check if this product's options have changed since it was added to the cart
            productData.optionTypes.forEach((optionType) => {
                const selection = this.state.cartItem.productOptions[optionType.name]
                if (!optionType.optional && !selection) {
                    CustomerFunctions.deleteCartItem(this.state.cartItem).then(() => {
                        if (this.props.onDelete) {
                            this.props.onDelete()
                        }
                    })
                }
            })
            let totalRating = 0;
            productData.ratings.forEach((num) => {
                totalRating += num
            })
            this.setState({productData: productData, totalRating: totalRating / productData.ratings.length})
        })
    }

    renderOptionsText() {
        if (this.state.productData) {
            let optionRows: JSX.Element[] = []
            // Iterate through this product's option types to ensure option selections show up in order
            this.state.productData.optionTypes.forEach((optionType) => {
                const currentOption = this.state.cartItem.productOptions[optionType.name]
                if (currentOption) {
                    optionRows.push((
                        <View
                            style={styles.textRow}
                            key={optionType.name}
                        >
                            <Text
                                style={styles.optionText}
                            >{currentOption.optionName}</Text>
                            <Text
                                style={styles.optionPriceText}
                            >{currentOption.priceChange !== 0 ? currencyFormatter.format(currentOption.priceChange) : ""}</Text>
                        </View>
                    ))
                }
            })
            return optionRows
        }
    }

    renderQuantity() {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <IconButton
                    iconSource={icons.minus}
                    buttonStyle={{height: "60%"}}
                    buttonFunc={async () => {
                        if (this.state.cartItem.quantity > 0) {
                            const newCartItem = await CustomerFunctions.updateCartQuantity(this.state.cartItem, this.state.cartItem.quantity - 1)
                            this.setState({cartItem: newCartItem})
                        }
                    }}
                />
                <Text
                    style={styles.productName}
                >{this.state.cartItem.quantity}</Text>
                <IconButton
                    iconSource={icons.plus}
                    buttonStyle={{height: "60%"}}
                    buttonFunc={async () => {
                        if (this.state.cartItem.quantity < 99) {
                            const newCartItem = await CustomerFunctions.updateCartQuantity(this.state.cartItem, this.state.cartItem.quantity + 1)
                            this.setState({cartItem: newCartItem})
                        }
                    }}
                />
            </View>
        )
    }

    renderSubtotal() {
        if (this.state.productData) {
            return (
                <Text
                    style={styles.mainPriceText}
                >{currencyFormatter.format(this.state.cartItem.totalPrice)}</Text>
            )
        }
    }

    renderUI() {
        if (this.state.productData) {
            return (
            <TouchableOpacity
                style={{
                    width: "100%"
                }}
                onPress={() => {
                if (this.props.onPress) {
                    this.props.onPress();
                }
            }}>
                <View style={{flexDirection: "row"}}>
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
                        <View style={styles.textRow}>
                            <Text style={styles.productName}>{this.state.productData.name}</Text>
                            <Text style={styles.optionPriceText}>{this.state.cartItem.basePrice !== this.state.cartItem.totalPrice ? currencyFormatter.format(this.state.cartItem.basePrice) : ""}</Text>
                        </View>
                        {this.renderOptionsText()}
                    </View>
                </View>
                {/* Bottom of card */}
                <View style={styles.bottomContainer}>
                    <IconButton
                        iconSource={icons.trash}
                        buttonStyle={styles.deleteButton}
                        buttonFunc={() => {
                            CustomerFunctions.deleteCartItem(this.state.cartItem).then(() => {
                                if (this.props.onDelete) {
                                    this.props.onDelete()
                                }
                            })
                        }}
                    />
                    {this.renderQuantity()}
                    {this.renderSubtotal()}
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
                    backgroundColor: styleValues.whiteColor
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
        borderColor: styleValues.bordColor,
        borderRadius: styleValues.bordRadius,
        borderWidth: styleValues.minorBorderWidth,
        width: "100%",
        marginTop: styleValues.mediumPadding,
        padding: styleValues.minorPadding,
        flexDirection: "row",
        alignItems: "center",
    },
    productImage: {
        height: styleValues.winWidth*0.15,
        aspectRatio: 1,
        borderRadius: styleValues.minorPadding,
        marginRight: styleValues.minorPadding
    },
    productInfoArea: {
        flex: 1,
    },
    textRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    productName: {
        fontSize: styleValues.mediumTextSize
    },
    optionText: {
        fontSize: styleValues.smallTextSize,
        color: styleValues.greyColor
    },
    mainPriceText: {
        textAlign: "right",
        textAlignVertical: "center",
        fontSize: styleValues.mediumTextSize,
        width: "35%"
    },
    optionPriceText: {
        textAlign: "right",
        textAlignVertical: "center",
        fontSize: styleValues.smallTextSize,
        width: "35%",
        color: styleValues.greyColor
    },
    bottomContainer: {
        flexDirection: "row",
        height: styleValues.mediumTextSize*2,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: styleValues.minorBorderWidth,
        borderColor: styleValues.lightGreyColor,
    },
    deleteButton: {
        height: "75%",
    },
})