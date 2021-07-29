
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, ActivityIndicator } from "react-native";
import { defaults, textStyles, buttonStyles, icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency, currencyFormatter } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { CartItem, ProductData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { IconButton } from "../HelperFiles/CompIndex";

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
        if (this.props.editable !== false) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
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
                    <IconButton
                        iconSource={icons.minus}
                        buttonStyle={{
                            width: styleValues.winWidth*0.06,
                            aspectRatio: 1,
                        }}
                        buttonFunc={async () => {
                            if (this.state.cartItem.quantity > 0) {
                                const newCartItem = await CustomerFunctions.updateCartQuantity(this.state.cartItem, this.state.cartItem.quantity - 1)
                                this.setState({cartItem: newCartItem})
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
                                const newCartItem = await CustomerFunctions.updateCartQuantity(this.state.cartItem, this.state.cartItem.quantity + 1)
                                this.setState({cartItem: newCartItem})
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
                    width: "100%"
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
                        <View style={styles.textRow}>
                            <Text
                                style={styles.productName}
                                numberOfLines={1}
                            >{this.state.productData.name}</Text>
                            <Text style={styles.optionPriceText}>{currencyFormatter.format(this.state.cartItem.basePrice)}</Text>
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
        ...textStyles.medium,
        textAlign: "left",
        flex: 0.7,
    },
    optionText: {
        ...textStyles.small,
        textAlign: "left",
        color: colors.grayColor
    },
    mainPriceText: {
        ...textStyles.medium,
        textAlign: "right",
        flex: 0.3
    },
    optionPriceText: {
        ...textStyles.small,
        textAlign: "right",
        color: colors.grayColor,
        flex: 0.3,
    },
    bottomContainer: {
        flexDirection: "row",
        height: styleValues.mediumTextSize*2,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: styleValues.minorBorderWidth,
        borderColor: colors.lightGrayColor,
        marginTop: styleValues.minorPadding,
        paddingTop: styleValues.minorPadding
    },
    deleteButton: {
        height: "75%",
        marginRight: styleValues.mediumPadding
    },
})