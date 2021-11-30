import React, { Component, ReactNode } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight, fonts } from "../HelperFiles/StyleSheet";
import { ItemList, MenuBar, PageContainer, ProductCard, ScrollContainer } from "../HelperFiles/CompIndex";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopStackParamList, CustomerMainStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { ProductCategory, PublicBusinessData } from "../HelperFiles/DataTypes";
import CardProductList from "../CustomComponents/CardProductList";
import { StackNavigationProp } from "@react-navigation/stack";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type BusinessProductsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<BusinessShopStackParamList, "products">,
    CompositeNavigationProp<
        BottomTabNavigationProp<CustomerTabParamList>,
        StackNavigationProp<CustomerMainStackParamList>
    >
>

type BusinessProductsRouteProp = RouteProp<BusinessShopStackParamList, "products">;

type Props = {
    navigation: BusinessProductsNavigationProp,
    route: BusinessProductsRouteProp,
    businessData: PublicBusinessData
}

type State = {
    currentCategory: ProductCategory,
    cartQuantity: number
}

export default class BusinessProducts extends CustomComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        const firstCat: ProductCategory = this.props.businessData.productList.length > 0 ? this.props.businessData.productList[0] : {
            name: "",
            productIDs: []
        }
        this.state = {
            currentCategory: firstCat,
            cartQuantity: 0
        }
        props.navigation.addListener("focus", () => this.refreshData())
    }

    async refreshData() {
        const cart = await CustomerFunctions.getCart()
        let quantity = 0
        for (const item of cart) {
            if (item.businessID === this.props.businessData.businessID) {
                quantity += item.quantity
            }
        }
        this.setState({cartQuantity: quantity})
    }

    renderCategoryBar() {
        return (
            <View style={{...styles.categoryBarContainer, ...defaults.smallShadow}}>
                <ScrollContainer
                    containerStyle={styles.categoryBar}
                    contentContainerStyle={{paddingVertical: 0}}
                    horizontal={true}
                    fadeStartColor={colors.whiteColor}
                    fadeEndColor={colors.whiteColor}
                >
                    {this.props.businessData.productList.map((category, index) => {
                        return (
                            <View
                                style={{
                                    marginLeft: index !== 0 ? styleValues.mediumPadding*4 : 0,
                                }}
                                key={index.toString()}
                            >
                                <TouchableOpacity
                                    style={styles.barContent}
                                    onPress={() => this.setState({currentCategory: category})}
                                >
                                    <Text 
                                        style={{
                                            ...textStyles.large,
                                            // fontFamily: this.state.currentCategory.name === category.name ? fonts.bold : fonts.regular,
                                            color: this.state.currentCategory.name === category.name ? colors.mainColor : colors.blackColor,
                                        }}
                                    >{category.name}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </ScrollContainer>
            </View>
        )
    }

    renderUI() {
        return (
        <>
            <ScrollContainer>
                {this.state.currentCategory.productIDs.map((productID) => {
                    return (
                        <ProductCard
                            businessID={this.props.businessData.businessID}
                            productID={productID}
                            onPress={() => this.props.navigation.navigate("productInfo", {
                                businessID: this.props.businessData.businessID,
                                productID: productID
                            })}
                            key={productID}
                        />
                    )
                })}
            </ScrollContainer>
            {/*<CardProductList
                products={this.state.currentCategory.productIDs.map((productID) => {
                    return {
                        businessID: this.props.businessData.businessID,
                        productID: productID,
                        onPress: () => this.props.navigation.navigate("productInfo", {
                            businessID: this.props.businessData.businessID,
                            productID: productID,
                        })
                    }
                })}
                scrollable
                showLoading
            />*/}
            {this.renderCategoryBar()}
        </>
        )
    }

    render() {
        // Check if page is loaded
        return (
            <PageContainer>
                {this.renderUI()}
                <MenuBar
                    buttonProps={[
                        {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.dangerouslyGetParent()?.goBack()}},
                        {iconSource: icons.document, buttonFunc: () => {this.props.navigation.navigate("info")}},
                        {
                            iconSource: icons.shoppingBag,
                            buttonFunc: () => {this.props.navigation.navigate("products")},
                            iconStyle: {tintColor: colors.mainColor}
                        },
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
    categoryBarContainer: {
        ...buttonStyles.noColor,
        position: "absolute",
        bottom: menuBarHeight + styleValues.mediumPadding,
        alignSelf: "center",
        padding: styleValues.minorPadding,
    },
    categoryBar: {
        height: "100%",
        width: "100%",
    },
    barContent: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    barText: {
        fontSize: styleValues.largeTextSize
    },
    productContainer: {
        height: "100%",
        width: "100%",
        alignItems: "center"
    },
    loadingScreen: {
        position: "absolute",
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
});