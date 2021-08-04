import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductData, ProductCategory, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { GradientView, ImageSliderSelector, ItemList, MapPopup, MenuBar, PageContainer, TextHeader, TextInputPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';

type BusinessEditProductCategoryNavigationProp = StackNavigationProp<BusinessEditStackParamList, "editProductCat">;

type BusinessEditProductCategoryRouteProp = RouteProp<BusinessEditStackParamList, "editProductCat">;

type BusinessEditProductCategoryProps = {
    navigation: BusinessEditProductCategoryNavigationProp,
    route: BusinessEditProductCategoryRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    productCategory?: ProductCategory,
    products?: ProductData[],
    showPopup: boolean,
    saved: boolean
}

export default class BusinessEditProductCategoryPage extends CustomComponent<BusinessEditProductCategoryProps, State> {

    constructor(props: BusinessEditProductCategoryProps) {
        super(props)
        this.state = {
          productCategory: undefined,
          products: undefined,
          showPopup: false,
          saved: true
        }
        props.navigation.addListener("focus", (event) => {
          this.refreshData()
        })
    }

    componentDidMount() {
      this.refreshData()
    }

    async refreshData() {
      const productCat = await this.props.businessFuncs.getProductCategory(this.props.route.params.productCategory)
      let products = await Promise.all(productCat.productIDs.map((productID) => {
        return this.props.businessFuncs.getProduct(productID)
      }))
      this.setState({productCategory: productCat, products: products})
    }

    renderAddButton() {
      return (
        <TextButton
          text={"Add new product"}
          appearance={"light"}
          rightIconSource={icons.plus}
          buttonFunc={async () => {
              this.setState({showPopup: true})
          }}
        />
      )
    }

    renderTextPopup() {
      if (this.state.showPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showPopup: false})}}
            onSaveText={async (text) => {
              let newProduct: ProductData = {
                ...DefaultProductData,
                businessID: this.props.businessFuncs.businessID,
                category: this.props.route.params.productCategory,
                name: text,
                isVisible: false,
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
      return (
        <TextButton
          text={product.name}
          buttonStyle={{...buttonStyles.noColor, ...{justifyContent: "space-between"}}}
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
          buttonStyle={buttonStyles.noColor}
          textStyle={{color: "red"}}
          rightIconSource={icons.minus}
          rightIconStyle={{tintColor: "red"}}
          buttonFunc={async () => {
            await this.props.businessFuncs.deleteProductCategory(this.props.route.params.productCategory).then(() => {
              this.props.navigation.goBack()
            })
          }}
        />
      )
    }
    // Render the UI once loading is complete
    renderUI() {
      if (this.state.productCategory && this.state.products) {
        return (
          <View>
            <View style={{flex: 1}}>
              <ItemList
                containerStyle={{width: styleValues.winWidth, paddingTop: defaults.textHeaderBox.height}}
                data={this.state.products ? this.state.products : []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(params) => {return this.renderProductCard(params)}}
                ListFooterComponent={this.renderDeleteButton()}
                ListHeaderComponent={() => this.renderAddButton()}
                fadeTop={false}
                onDragEnd={(params) => {
                  if (this.state.productCategory) {
                    const products = params.data
                    // Update the category's product ID list
                    const productIDs = products.map((product) => {
                      return product.productID
                    })
                    let productCat = this.state.productCategory
                    productCat.productIDs = productIDs
                    this.setState({productCategory: productCat, products: products, saved: false})
                  }
                }}
              />
              <GradientView/>
            </View>
            <TextHeader>{this.props.route.params.productCategory}</TextHeader>
          </View>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoadScreen() {
      if (this.state.productCategory === undefined) {
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
            <MenuBar
              buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
              ]}
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
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: () => {
                  if (this.state.productCategory) {
                      this.props.businessFuncs.updateProductCategory(this.props.route.params.productCategory, this.state.productCategory).then(() => {
                          this.setState({saved: true})
                      }, (e) => {
                          throw e;
                      })
                    }
                }}
              ]}
            />
            {this.renderTextPopup()}
        </PageContainer>
      )
    }
}

const styles = StyleSheet.create({
    list: {
      width: "100%",
    },
})