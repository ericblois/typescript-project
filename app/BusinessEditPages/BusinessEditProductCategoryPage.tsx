import React, { Component } from "react";
import { View, Text, StyleSheet, ImageURISource, ScrollView } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { ProductCategory, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { ImageSliderSelector, MapPopup, MenuBar, TextInputPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';

type BusinessEditProductCategoryNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editProductCat">;

type BusinessEditProductCategoryRouteProp = RouteProp<BusinessMainStackParamList, "editProductCat">;

type BusinessEditProductCategoryProps = {
    navigation: BusinessEditProductCategoryNavigationProp,
    route: BusinessEditProductCategoryRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    productCategory: ProductCategory,
    products: ProductData[],
    showPopup: boolean,
    saved: boolean
}

export default class BusinessEditProductCategoryPage extends Component<BusinessEditProductCategoryProps, State> {

    constructor(props: BusinessEditProductCategoryProps) {
        super(props)
        this.state = {
          productCategory: {
            name: props.route.params.productCategory,
            productIDs: []
          },
          products: [],
          showPopup: false,
          saved: true
        }
        props.navigation.addListener("focus", (event) => {
          this.refreshData()
        })
        this.refreshData()
    }

    async refreshData() {
      const productCat = await this.props.businessFuncs.getProductCategory(this.props.route.params.productCategory)
      let products = await Promise.all(productCat.productIDs.map((productID) => {
        return this.props.businessFuncs.getProduct(productID)
      }))
      this.setState({productCategory: productCat, products: products})
    }

    renderTextPopup() {
      if (this.state.showPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showPopup: false})}}
            onSaveText={async (text) => {
              let newProduct: ProductData = {
                businessID: this.props.businessFuncs.businessID,
                productID: "",
                category: this.props.route.params.productCategory,
                name: text,
                isVisible: false
              }
              await this.props.businessFuncs.createProduct(newProduct)
              this.refreshData().then(() => {
                this.setState({showPopup: false})
              })
            }}
            textInputProps={{
              textProps: {
                placeholder: "Name of new product",
              }
            }}
          />
        )
      }
    }

    renderProductCard(params: RenderItemParams<ProductData>) {
      const product = params.item
      console.log(product.name)
      return (
        <TextButton
          text={product.name}
          buttonStyle={{...defaults.textButtonNoColor, ...{justifyContent: "space-between"}}}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={() => {
            this.props.navigation.navigate("editProduct", {productID: product.productID})
          }}
          touchableProps={{
            onLongPress: params.drag
          }}
        />
      )
    }

    renderDeleteButton() {
      return (
        <TextButton
          text={"Delete this category"}
          buttonStyle={defaults.textButtonNoColor}
          textStyle={{color: "red"}}
          buttonFunc={async () => {
            await this.props.businessFuncs.deleteProductCategory(this.props.route.params.productCategory).then(() => {
              this.props.navigation.goBack()
            })
          }}
        />
      )
    }

  render() {
    return (
      <View style={{...defaults.pageContainer, ...{paddingBottom: defaults.tabBar.height + styleValues.mediumPadding*2}}}>
        <Text
          style={styles.headerText}
        >
          {this.props.route.params.productCategory}
        </Text>
        <DraggableFlatList
          containerStyle={styles.list}
          data={this.state.products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(params) => {return this.renderProductCard(params)}}
          ListFooterComponent={this.renderDeleteButton()}
          onDragEnd={(params) => {
            const products = params.data
            // Update the category's product ID list
            const productIDs = products.map((product) => {
              return product.productID
            })
            let productCat = this.state.productCategory
            productCat.productIDs = productIDs
            this.setState({productCategory: productCat, products: products, saved: false})
          }}
        />
        <MenuBar
          buttonProps={[
            {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
            {iconSource: icons.plus, buttonFunc: () => {this.setState({showPopup: true})}},
            {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? styleValues.validColor : styleValues.invalidColor}, buttonFunc: () => {
                this.props.businessFuncs.updateProductCategory(this.props.route.params.productCategory, this.state.productCategory).then(() => {
                    this.setState({saved: true})
                }, (e) => {
                    throw e;
                })
              }
            }
          ]}
        />
        {this.renderTextPopup()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    headerText: {
      fontSize: styleValues.largerTextSize
    },
    list: {
      width: "100%",
    },
})