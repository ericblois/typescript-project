import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight } from "../HelperFiles/StyleSheet";
import { ItemList, MenuBar, PageContainer, ProductCard } from "../HelperFiles/CompIndex";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { ProductCategory, PublicBusinessData } from "../HelperFiles/DataTypes";
import ProductCardList from "../CustomComponents/ProductCardList";
import { StackNavigationProp } from "@react-navigation/stack";

type BusinessProductsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<BusinessShopStackParamList, "products">,
    BottomTabNavigationProp<CustomerTabParamList>
>

type BusinessProductsRouteProp = RouteProp<BusinessShopStackParamList, "products">;

type Props = {
    navigation: BusinessProductsNavigationProp,
    route: BusinessProductsRouteProp,
    businessData: PublicBusinessData
}

type State = {
    currentCategory: ProductCategory
}

export default class BusinessProducts extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        const firstCat: ProductCategory = this.props.businessData.productList.length > 0 ? this.props.businessData.productList[0] : {
            name: "",
            productIDs: []
        }
        this.state = {
            currentCategory: firstCat
        }
    }

    renderCategorySeperator(index: number) {
        return index === 0 ? undefined : (
            <View
                style={{width: styleValues.mediumPadding*3}}
            />
        )
    }

    renderCategoryBar() {
        return (
            <ItemList
                style={styles.categoryBar}
                data={this.props.businessData.productList}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                    <View style={{flexDirection: "row", height: "100%"}}>
                        {this.renderCategorySeperator(index!)}
                        <TouchableOpacity
                            style={styles.barContent}
                            onPress={() => this.setState({currentCategory: item})}
                        >
                            <Text style={textStyles.large}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        )
    }

    render() {
        // Check if page is loaded
        return (
            <PageContainer
                style={{
                    paddingBottom: menuBarHeight*2
                }}
            >
                <ProductCardList
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
                />
                {this.renderCategoryBar()}
                <MenuBar
                    buttonProps={[
                        {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.navigate("browse")}},
                        {iconSource: icons.document, buttonFunc: () => {this.props.navigation.navigate("info")}},
                        {
                            iconSource: icons.shoppingCart,
                            buttonFunc: () => {this.props.navigation.navigate("products")},
                            iconStyle: {tintColor: colors.mainColor}
                        },
                    ]}
                />
            </PageContainer>
        )
    }
}

const styles = StyleSheet.create({
    categoryBar: {
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        position: "absolute",
        bottom: menuBarHeight,
        padding: 0,
        paddingVertical: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: colors.lightGrayColor,
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