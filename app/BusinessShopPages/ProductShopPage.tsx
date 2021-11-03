import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";
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
    optionSelections: OptionSelections,
    cartQuantity: number,
    productQuantity: number
}

export default class ProductShopPage extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            productData: undefined,
            imagesLoaded: false,
            optionSelections: {},
            cartQuantity: 0,
            productQuantity: 1
        }
        props.navigation.addListener("focus", () => this.refreshData())
    }

    async refreshData() {
        const productData = await CustomerFunctions.getProduct(
            this.props.route.params.businessID,
            this.props.route.params.productID
        )
        const cartItem = (await CustomerFunctions.getCart()).find((item) => {
            return item.businessID == productData.businessID && item.productID == productData.productID
        })
        const quantity = cartItem ? cartItem.quantity : 0
        this.setState({productData: productData, cartQuantity: quantity})
    }

    componentDidMount() {
        this.refreshData()
    }
    // Check if all options have been given a value
    checkOptions() {
        let validOptions = true
        if (this.state.productData) {
            for (const optionType of this.state.productData.optionTypes) {
                // Check if this option type has been selected
                const selection = this.state.optionSelections[optionType.name]
                if (selection && optionType.options.map((option) => (option.name)).includes(selection.optionName)) {
                        continue
                }
                //const selection = this.state.optionSelections.get(optionType.name)
                // Check if this option has been selected
                validOptions = false
            }
        } else {
            return false
        }
        //console.log(this.state.optionSelections)
        return validOptions
    }

    renderOptions() {
        if (this.state.productData) {
            return (this.state.productData.optionTypes.map((optionType, index, array) => {
                return (
                    <View
                        style={{
                            zIndex: array.length - index
                        }}
                        key={optionType.name}
                    >
                        <TextDropdown
                            items={optionType.options.map((option) => {
                                return {
                                    label: option.name,
                                    value: option.name,
                                }
                            })}
                            dropdownProps={{
                                placeholder: optionType.name,
                                onChangeItem: (item) => {
                                    // Get option info
                                    const option = optionType.options.find((option) => {
                                        return option.name === item.value
                                    })
                                    if (option) {
                                        let selections = this.state.optionSelections
                                        selections[optionType.name] = {
                                            optionName: option.name,
                                            priceChange: option.priceChange ? option.priceChange : 0
                                        }
                                        this.setState({optionSelections: selections})
                                    }
                                },
                            }}
                        ></TextDropdown>
                    </View>
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
                            this.setState({productQuantity: this.state.productQuantity - 1})
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
                            this.setState({productQuantity: this.state.productQuantity + 1})
                        }
                    }}
                />
            </View>
        )
    }

    renderAddButton() {
        let barText = `Add ${this.state.productQuantity} to cart`
        if (this.state.cartQuantity > 0) {
            barText += ` (${this.state.cartQuantity})`
        }
        if (this.state.productQuantity > 0 && this.checkOptions()) {
            return (
                <TextButton
                    text={barText}
                    buttonStyle={styles.cartButton}
                    appearance={"color"}
                    showLoading={true}
                    buttonFunc={async () => {
                        if (this.state.productData && this.state.productData.price) {
                            let totalPrice = this.state.productData.price
                            for (const selection of Object.values(this.state.optionSelections)) {
                                totalPrice += selection.priceChange
                            }
                            let newSelections: OptionSelections = {}
                            // Make sure the cart item's option selections are in the same order as the product's option types
                            this.state.productData.optionTypes.forEach((optionType) => {
                                newSelections[optionType.name] = this.state.optionSelections[optionType.name]
                            })
                            const cartItem: CartItem = {
                                businessID: this.state.productData.businessID,
                                productID: this.state.productData.productID,
                                productOptions: newSelections,
                                basePrice: this.state.productData.price,
                                totalPrice: totalPrice,
                                quantity: this.state.productQuantity
                            }
                            await CustomerFunctions.addToCart(cartItem)
                            this.props.navigation.goBack()
                        }
                    }}
                />
            )
        }
    }

    renderUI() {
        if (this.state.productData) {
            return (
                <>
                    <ScrollContainer>
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
                        <TextDropdownAnimated
                            placeholderText={"Select"}
                            items={[
                                {
                                    text: "First",
                                    value: 1
                                }, {
                                    text: "Second",
                                    value: 1
                                }, {
                                    text: "Third",
                                    value: 1
                                }
                            ]}
                        />
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
        bottom: menuBarHeight + styleValues.mediumPadding
    }
})
