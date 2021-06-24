import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import { ProductCard } from "../HelperFiles/CompIndex";
import { prefetchImages, isProductList, isProductData, isProductOption, isProductOptionType, isProductCategory } from "../HelperFiles/Constants";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopTabParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { PrivateBusinessData, ProductCategory } from "../HelperFiles/DataTypes";
import BusinessDataHandler from "../HelperFiles/BusinessDataHandler";

type BusinessProductsNavigationProp = BottomTabNavigationProp<BusinessShopTabParamList, "products">;

type BusinessProductsRouteProp = RouteProp<BusinessShopTabParamList, "products">;

type Props = {
    navigation: BusinessProductsNavigationProp,
    route: BusinessProductsRouteProp,
    businessData: PrivateBusinessData
}

type State = {
    thumbnailsFetched: boolean,
    currentProductList: ReactNode
}

export default class BusinessProducts extends Component<Props, State> {

    productLists: { [category: string]: ReactNode } = {};
    productsToLoad = 0;
    productsData: ProductCategory[] | undefined;

    state: Readonly<State> = {
        thumbnailsFetched: false,
        currentProductList: <></>
    }

    componentDidMount() {
        this.loadProductsData().then(() => {
            //console.log(productList[0].products[0].optionTypes[0].options[0])
            console.log(isProductCategory(this.props.businessData.productList![0]))
        })
    }

    createListElements = (productsData: ProductCategory[]) => {
        let thumbnailArray: string[] = [];
        // Iterate through each category of products
       productsData.forEach(({category, products}) => {
            // Create list of category pages
            this.productLists[category] = (
                <View style={styles.productContainer}>
                    <FlatList
                        data={products}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                            <ProductCard productData={item} onPress={() => this.props.navigation.navigate("product", {productData: item, productType: category})}/>
                        )}
                    />
                </View>
            )
            // Prefetch all of the product thumbnail images
            products.forEach(({images}) => {
                thumbnailArray.push(images[0])
            });
        })
        prefetchImages(thumbnailArray).then(() => {
            this.setState({thumbnailsFetched: true})
        });
        this.setState({currentProductList: this.productLists[productsData[0].category]});
    }

    loadProductsData = async () => {
        await BusinessDataHandler.getBusinessProductList(this.props.businessData).then(() => {
            this.productsData = this.props.businessData.productList!;
            this.createListElements(this.productsData);
        }, (e) => {throw e});
    }

    renderCategoryBar() {
        return (
            <FlatList
                style={styles.categoryBar}
                data={this.productsData}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{width: styleValues.mediumPadding*3}}/>}
                renderItem={({item, index}) => (
                    <TouchableOpacity
                        style={styles.barContent}
                        onPress={() => this.setState({currentProductList: this.productLists[item.category]})}
                    >
                        <Text style={styles.barText}>{item.category}</Text>
                    </TouchableOpacity>
                )}
            />
        )
    }

    render() {
        // Check if page is loaded
        return !this.state.thumbnailsFetched ? <ActivityIndicator style={styles.loadingScreen} size={"large"}/> : (
            <View style={defaults.pageContainer}>
                {this.state.currentProductList}
                {this.renderCategoryBar()}
            </View>
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