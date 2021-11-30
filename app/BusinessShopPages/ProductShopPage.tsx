import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView, Animated } from "react-native";
import { TextButton, TextDropdownAnimated } from "../HelperFiles/CompIndex"
import PropTypes from 'prop-types';
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight } from "../HelperFiles/StyleSheet";
import { ImageSlider, RatingVisual, MenuBar, IconButton, PageContainer, ScrollContainer, TextDropdown } from "../HelperFiles/CompIndex";
import { productPropType, formatText, currency } from "../HelperFiles/Constants";
import DropDownPicker from 'react-native-dropdown-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { BusinessShopStackParamList, CustomerMainStackParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { CartItem, OptionSelections, ProductData, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProductEditOptionTypePage from "../BusinessEditPages/ProductEditOptionTypePage";

type ProductShopNavigationProp = CompositeNavigationProp<
    StackNavigationProp<BusinessShopStackParamList, "productInfo">,
    StackNavigationProp<CustomerMainStackParamList>
>

type ProductShopRouteProp = RouteProp<BusinessShopStackParamList, "productInfo">;

type Props = {
    navigation: ProductShopNavigationProp,
    route: ProductShopRouteProp,
}

type State = {
    productData?: ProductData,
    imagesLoaded: boolean,
    optionSelections?: OptionSelections,
    cartQuantity: number,
    productQuantity: number
}

export default class ProductShopPage extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            productData: undefined,
            imagesLoaded: false,
            optionSelections: undefined,
            cartQuantity: 0,
            productQuantity: 1
        }
        props.navigation.addListener("focus", () => this.refreshData())
    }

    addButtonOpacity = new Animated.Value(0);

    async refreshData() {
        // Get product data
        const productData = await CustomerFunctions.getProduct(
            this.props.route.params.businessID,
            this.props.route.params.productID
        )
        // Get product's options
        let newOptionSelections = this.state.optionSelections ? this.state.optionSelections : {}
        if (!this.state.optionSelections) {
            for (const optionType of productData.optionTypes) {
                newOptionSelections[optionType.name] = []
            }
        }
        // Get number of cart items
        const cartItem = (await CustomerFunctions.getCart()).find((item) => {
            return item.businessID == productData.businessID && item.productID == productData.productID
        })
        const quantity = cartItem ? cartItem.quantity : 0
        this.setState({productData: productData, optionSelections: newOptionSelections, cartQuantity: quantity})
    }

    componentDidMount() {
        this.refreshData()
    }
    // Check if all options have been given a value
    checkOptions() {
        let validOptions = true
        if (this.state.productData && this.state.optionSelections) {
            for (const optionType of this.state.productData.optionTypes) {
                if (optionType.optional) {
                    continue
                }
                // Check if this option type has been selected
                const selection = this.state.optionSelections[optionType.name]
                validOptions = validOptions && selection && selection.length > 0
            }
        } else {
            return false
        }
        return validOptions
    }

    renderOptions() {
        if (this.state.productData) {
            return (this.state.productData.optionTypes.map((optionType, index, array) => {
                return (
                    <TextDropdownAnimated
                        placeholderText={optionType.name}
                        items={optionType.options.map((option) => {
                            return {
                                text: option.name,
                                value: option.priceChange,
                            }
                        })}
                        showValidSelection={!optionType.optional}
                        enableMultiple={optionType.allowMultiple}
                        onSelect={(selections) => {
                            // Map dropdown's selections to product's options
                            const newOptionSelections = selections.map(({text, value}) => {
                                return {optionName: text, priceChange: value as number}
                            })
                            // Update product's option selections
                            const newProductOptions = this.state.optionSelections
                            if (newProductOptions) {
                                newProductOptions[optionType.name] = newOptionSelections
                                this.setState({optionSelections: newProductOptions}, () => {
                                    if (this.state.productQuantity > 0 && this.checkOptions()) {
                                        this.fadeInAddButton()
                                    } else {
                                        this.fadeOutAddButton()
                                    }
                                    this.refreshData()
                                })
                            }
                        }}
                        key={index.toString()}
                    />
                )
            }))
        }
    }

    renderQuantity() {
        return (
            <View style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
            }}>
                <IconButton
                    iconSource={icons.minus}
                    buttonStyle={{
                        width: styleValues.winWidth*0.075,
                        aspectRatio: 1,
                    }}
                    buttonFunc={async () => {
                        if (this.state.productQuantity > 0) {
                            this.setState({productQuantity: this.state.productQuantity - 1}, () => {
                                if (this.state.productQuantity > 0 && this.checkOptions()) {
                                    this.fadeInAddButton()
                                } else {
                                    this.fadeOutAddButton()
                                }
                            })
                        }
                    }}
                />
                <Text
                    style={{
                        ...textStyles.large,
                        flex: 0.1
                    }}
                >{this.state.productQuantity}</Text>
                <IconButton
                    iconSource={icons.plus}
                    buttonStyle={{
                        width: styleValues.winWidth*0.075,
                        aspectRatio: 1
                    }}
                    buttonFunc={async () => {
                        if (this.state.productQuantity < 99) {
                            this.setState({productQuantity: this.state.productQuantity + 1}, () => {
                                if (this.checkOptions()) {
                                    this.fadeInAddButton()
                                } else {
                                    this.fadeOutAddButton()
                                }
                            })
                        }
                    }}
                />
            </View>
        )
    }

    fadeInAddButton() {
        Animated.timing(this.addButtonOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start()
    }

    fadeOutAddButton() {
        Animated.timing(this.addButtonOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false
        }).start()
    }

    renderAddButton() {
        let barText = `Add ${this.state.productQuantity > 0 ? this.state.productQuantity : 1} to cart`
        if (this.state.cartQuantity > 0) {
            barText += ` (${this.state.cartQuantity})`
        }
        return (
            <Animated.View
                style={{
                    ...styles.cartButton,
                    opacity: this.addButtonOpacity
                }}
                pointerEvents={this.state.productQuantity > 0 && this.checkOptions() ? undefined : "none"}
            >
                <TextButton
                    text={barText}
                    touchableProps={{
                        disabled: this.state.productQuantity <= 0 || !this.checkOptions()
                    }}
                    appearance={"color"}
                    showLoading={true}
                    buttonFunc={async () => {
                        if (this.state.productData && this.state.optionSelections) {
                            // Calculate total price of item
                            const cartItem = CustomerFunctions.createCartItem(this.state.productData, this.state.optionSelections, this.state.productQuantity)
                            await CustomerFunctions.addToCart(cartItem)
                            this.props.navigation.goBack()
                        } else {
                            console.error("Could not add to cart")
                        }
                    }}
                />
            </Animated.View>
        )
    }

    renderUI() {
        if (this.state.productData) {
            return (
                <>
                    <ScrollContainer
                        contentContainerStyle={{paddingBottom: menuBarHeight*2 + styleValues.mediumPadding*2}}
                    >
                        <ImageSlider
                            uris={this.state.productData.images}
                            onImagesLoaded={() => {
                                this.setState({imagesLoaded: true})
                            }}
                        ></ImageSlider>
                        <View style={styles.descriptionHeader}>
                            <Text style={styles.productTitle} numberOfLines={2}>{this.state.productData.name}</Text>
                            <View style={styles.subHeader}>
                                <Text style={styles.productType}>{this.state.productData.category}</Text>
                                <RatingVisual rating={4}/>
                            </View>
                        </View>
                        <View style={styles.descriptionBody}>
                            <Text style={styles.description}>{formatText(this.state.productData.description)}</Text>
                        </View>
                        {this.renderOptions()}
                        {/* Quantity buttons */}
                        {this.renderQuantity()}
                    </ScrollContainer>
                    {this.renderAddButton()}
                </>
            )
        }
    }

    renderLoadScreen() {
        if (this.state.productData === undefined || !this.state.imagesLoaded) {
          return (
            <View 
              style={{...defaults.pageContainer, ...{
                justifyContent: "center",
                position: "absolute",
                top: 0,
                left: 0
              }}}
            >
              <ActivityIndicator
                size={"large"}
              />
            </View>
          )
        }
    }

    render() {
        return (
        <PageContainer>
            {this.renderUI()}
            {this.renderLoadScreen()}
            <MenuBar
                buttonProps={[
                    {iconSource: icons.backArrow, buttonFunc: () => this.props.navigation.goBack()},
                    {
                        iconSource: icons.shoppingCart,
                        showBadge: this.state.cartQuantity > 0,
                        badgeNumber: this.state.cartQuantity,
                        buttonFunc: () => this.props.navigation.navigate("cart")
                    },
                ]}
            />
        </PageContainer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: styleValues.winWidth/4,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: styleValues.mediumPadding,
    },
    loadingScreen: {
        position: "absolute",
        top: 0,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
    descriptionHeader: {
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        alignItems: "flex-start",
        padding: styleValues.minorPadding,
        paddingBottom: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: colors.grayColor
    },
    subHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    descriptionBody: {
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        alignItems: "flex-start",
        padding: styleValues.minorPadding,
        paddingBottom: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: colors.grayColor
    },
    productTitle: {
        ...textStyles.large
    },
    productType: {
        ...textStyles.medium,
        color: styleValues.minorTextColor,
    },
    description: {
        ...textStyles.small,
        textAlign: "left",
    },
    optionPickerContainer: {
        width: styleValues.winWidth-2*styleValues.mediumPadding,
        height: styleValues.winWidth/8,
        fontSize: styleValues.smallestTextSize,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
    },
    optionPicker: {
        // Must use individual border radii, as borderRadius does not work
        borderTopLeftRadius: styleValues.mediumPadding,
        borderTopRightRadius: styleValues.mediumPadding,
        borderBottomLeftRadius: styleValues.mediumPadding,
        borderBottomRightRadius: styleValues.mediumPadding,
        borderWidth: 0,
        height: "100%",
        width: "100%",
    },
    cartButton: {
        position: "absolute",
        bottom: menuBarHeight + styleValues.mediumPadding,
        width: "100%",
    }
})
