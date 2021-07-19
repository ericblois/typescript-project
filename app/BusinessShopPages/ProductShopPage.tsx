import React, { Component } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";

import PropTypes from 'prop-types';
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import { ImageSlider, RatingVisual, MenuBar, IconButton, PageContainer, ScrollContainer, TextDropdown } from "../HelperFiles/CompIndex";
import { productPropType, formatText, currency } from "../HelperFiles/Constants";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { BusinessShopStackParamList, CustomerMainStackParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { CartItem, ProductData, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

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
    optionSelections: { [optionType: string] : string },
    quantity: number,
}

export default class ProductShopPage extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            productData: undefined,
            imagesLoaded: false,
            optionSelections: {},
            quantity: 1,
        }
        props.navigation.addListener("focus", () => this.refreshData())
    }

    refreshData() {
        CustomerFunctions.getProduct(
            this.props.route.params.businessID,
            this.props.route.params.productID).then((productData) => {
                this.setState({productData: productData})
        })
    }

    componentDidMount() {
        this.refreshData()
    }
    // Check if all options have been given a value
    checkOptions() {
        let validOptions = true
        if (this.state.productData) {
            for (const optionType of this.state.productData.optionTypes) {
                // Get this option selection
                const selection = this.state.optionSelections[optionType.name]
                //const selection = this.state.optionSelections.get(optionType.name)
                // Check if this option has been selected
                if (selection) {
                    if (optionType.options.map((option) => (option.name)).includes(selection)) {
                        continue
                    }
                }
                validOptions = false
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
                            extraProps={{
                                placeholder: optionType.name,
                                onChangeItem: (item) => {
                                    let selections = this.state.optionSelections
                                    selections[optionType.name] = item.value
                                    this.setState({optionSelections: selections})
                                },
                            }}
                        ></TextDropdown>
                    </View>
                )
            }))
        }
    }

    renderUI() {
        if (this.state.productData) {
            return (
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
                    {this.renderOptions()}
                </ScrollContainer>
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
                    {iconSource: icons.plus, buttonFunc: () => {
                        if (this.state.productData) {
                            const cartItem: CartItem = {
                                businessID: this.state.productData.businessID,
                                productID: this.state.productData.productID,
                                productOptions: this.state.optionSelections,
                                quantity: this.state.quantity
                            }
                            CustomerFunctions.addToCart(cartItem)
                        }
                    }, buttonProps: {
                        disabled: !this.checkOptions(),
                    }, iconStyle: {
                        tintColor: this.checkOptions() ? styleValues.darkGreyColor : styleValues.lightGreyColor
                    }},
                    {iconSource: icons.shoppingCart, buttonFunc: () => this.props.navigation.navigate("cart")},
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
        borderColor: styleValues.bordColor
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
        borderColor: styleValues.bordColor
    },
    productTitle: {
        fontSize: styleValues.largeTextSize,
        color: styleValues.majorTextColor,
    },
    productType: {
        fontSize: styleValues.smallTextSize,
        color: styleValues.minorTextColor,
    },
    description: {
        fontSize: styleValues.smallTextSize,
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
    }
});