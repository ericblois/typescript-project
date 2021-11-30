
import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, ActivityIndicator } from "react-native";
import { defaults, textStyles, buttonStyles, icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency, currencyFormatter } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { CartItem, ProductData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import IconButton from "./IconButton";
import LoadingCover from "./LoadingCover"

type Props = {
    cartItem: CartItem,
    editable?: boolean,
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

export default class ProductCartCard extends CustomComponent<Props, State> {

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
            for (const optionType of this.state.productData.optionTypes) {
                const selections = this.state.cartItem.productOptions[optionType.name]
                if (selections && selections.length > 0) {
                    optionRows.push((
                        <View
                            style={styles.textRow}
                            key={optionType.name}
                        >
                            <Text
                                style={styles.optionTypeText}
                            >{`${optionType.name}: `}</Text>
                            <View style={{flex: 1}}>
                                {selections.map((selection, index) => {
                                    return (
                                        <View
                                            style={{flexDirection: "row", width: "100%"}}
                                            key={index.toString()}
                                        >
                                            {/* Option Name */}
                                            <Text
                                                style={styles.optionNameText}
                                            >{selection.optionName}</Text>
                                            {/* Option Price */}
                                            <Text
                                                style={styles.optionPriceText}
                                            >{selection.priceChange !== 0 ? currencyFormatter.format(selection.priceChange) : ""}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    ))
                }
            }
            return optionRows
        }
    }

    renderQuantity() {
        if (this.props.editable !== false) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flex: 0.5
                    }}
                >
                    <IconButton
                        iconSource={icons.trash}
                        buttonStyle={styles.deleteButton}
                        buttonFunc={async () => {
                            await CustomerFunctions.deleteCartItem(this.state.cartItem).then(() => {
                                if (this.props.onDelete) {
                                    this.props.onDelete()
                                }
                            })
                        }}
                        showLoading={true}
                    />
                    <IconButton
                        iconSource={icons.minus}
                        buttonStyle={{
                            width: styleValues.winWidth*0.06,
                            aspectRatio: 1,
                        }}
                        buttonFunc={async () => {
                            if (this.state.cartItem.quantity > 1) {
                                const newCartItem = this.state.cartItem
                                newCartItem.quantity -= 1
                                this.setState({cartItem: newCartItem})
                                await CustomerFunctions.updateCartItem(newCartItem).catch((e) => {
                                    // Undo the change if there is an error
                                    newCartItem.quantity += 1
                                    this.setState({cartItem: newCartItem})
                                })
                            } else {
                                await CustomerFunctions.deleteCartItem(this.state.cartItem)
                                if (this.props.onDelete) {
                                    this.props.onDelete()
                                }
                            }
                        }}
                    />
                    <Text
                        style={{
                            fontSize: styleValues.mediumTextSize,
                            paddingHorizontal: styleValues.minorPadding
                        }}
                    >{this.state.cartItem.quantity}</Text>
                    <IconButton
                        iconSource={icons.plus}
                        buttonStyle={{
                            width: styleValues.winWidth*0.06,
                            aspectRatio: 1,
                        }}
                        buttonFunc={async () => {
                            if (this.state.cartItem.quantity < 99) {
                                const newCartItem = this.state.cartItem
                                newCartItem.quantity += 1
                                this.setState({cartItem: newCartItem})
                                await CustomerFunctions.updateCartItem(newCartItem).catch((e) => {
                                    // Undo the change if there is an error
                                    newCartItem.quantity -= 1
                                    this.setState({cartItem: newCartItem})
                                })
                            }
                        }}
                    />
                </View>
            )
        } else {
            return (
                <Text style={textStyles.small}>{`Quantity: ${this.state.cartItem.quantity}`}</Text>
            )
        }
    }

    renderSubtotal() {
        if (this.state.productData) {
            return (
                <Text
                    style={styles.mainPriceText}
                >{currencyFormatter.format(this.state.cartItem.totalPrice * this.state.cartItem.quantity)}</Text>
            )
        }
    }

    renderUI() {
        if (this.state.productData) {
            return (
            <TouchableOpacity
                style={{
                    width: "100%",
                }}
                onPress={() => {
                    if (this.props.onPress) {
                        this.props.onPress();
                    }
                }}
                activeOpacity={this.props.onPress ? 0.2 : 1}
            >
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
                        <View style={{flexDirection: "row", width: "100%"}}>
                            <Text
                                style={styles.productNameText}
                                numberOfLines={1}
                            >{this.state.productData.name}</Text>
                            <Text style={styles.productPriceText}>{currencyFormatter.format(this.state.cartItem.basePrice)}</Text>
                        </View>
                        {this.renderOptionsText()}
                    </View>
                </View>
                {/* Bottom of card */}
                <View style={styles.bottomContainer}>
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
                <LoadingCover
                    style={{backgroundColor: colors.whiteColor}}
                />
            )
        }
    }

    render() {
        return (
            <View
                style={{
                    ...styles.cardContainer,
                    ...defaults.smallShadow
                }}
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
        width: "100%",
        marginTop: styleValues.mediumPadding,
        padding: styleValues.mediumPadding,
        flexDirection: "row",
        alignItems: "center",
    },
    productImage: {
        height: styleValues.winWidth*0.15,
        aspectRatio: 1,
        borderRadius: styleValues.minorPadding,
        marginRight: styleValues.mediumPadding
    },
    productInfoArea: {
        flex: 1,
        marginTop: -styleValues.minorPadding
    },
    textRow: {
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    productNameText: {
        ...textStyles.medium,
        textAlign: "left",
        flex: 0.7,
    },
    productPriceText: {
        ...textStyles.medium,
        textAlign: "right",
        flex: 0.3,
    },
    optionTypeText: {
        ...textStyles.small,
        textAlign: "left",
    },
    optionNameText: {
        ...textStyles.smaller,
        textAlign: "left",
        color: colors.grayColor,
    },
    optionPriceText: {
        ...textStyles.smaller,
        textAlign: "right",
        color: colors.grayColor,
        flex: 1,
    },
    mainPriceText: {
        ...textStyles.medium,
        textAlign: "right",
        flex: 0.5,
    },
    bottomContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: styleValues.minorBorderWidth,
        borderColor: colors.lightGrayColor,
        marginTop: styleValues.mediumPadding,
        paddingTop: styleValues.mediumPadding
    },
    deleteButton: {
        width: styleValues.winWidth*0.06,
        aspectRatio: 1,
        marginRight: styleValues.mediumPadding
    },
})