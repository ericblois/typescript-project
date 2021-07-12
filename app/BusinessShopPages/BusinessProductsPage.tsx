import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import { MenuBar, PageContainer, ProductCard } from "../HelperFiles/CompIndex";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { ProductCategory, PublicBusinessData } from "../HelperFiles/DataTypes";
import ProductCardList from "../CustomComponents/ProductCardList";

type BusinessProductsNavigationProp = BottomTabNavigationProp<BusinessShopStackParamList, "products">;

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

    renderCategoryBar() {
        return (
            <FlatList
                style={styles.categoryBar}
                data={this.props.businessData.productList}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{width: styleValues.mediumPadding*3}}/>}
                renderItem={({item, index}) => (
                    <TouchableOpacity
                        style={styles.barContent}
                        onPress={() => this.setState({currentCategory: item})}
                    >
                        <Text style={styles.barText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        )
    }

    render() {
        // Check if page is loaded
        return (
            <PageContainer>
                <ProductCardList
                    businessID={this.props.businessData.businessID}
                    productIDs={this.state.currentCategory.productIDs}
                />
                {this.renderCategoryBar()}
                <MenuBar
                    //buttonProps={this.state.inEditMode ? this.getEditButtons(props) : this.getMainButtons(props)}
                    buttonProps={[
                        {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                        {iconSource: icons.shoppingCart, buttonFunc: () => {this.props.navigation.navigate("products")}}
                    ]}
                />
            </PageContainer>
        )
    }
}

const styles = StyleSheet.create({
    categoryBar: {
        position: "absolute",
        bottom: styleValues.winWidth * 0.15 + styleValues.mediumPadding*2,
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        height: styleValues.winWidth * 0.15,
        borderWidth: styleValues.minorBorderWidth,
        borderRadius: styleValues.mediumPadding,
        borderColor: styleValues.bordColor,
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