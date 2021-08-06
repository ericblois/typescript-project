import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth, iconButtonTemplates } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductData, ProductCategory, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { ConfirmationPopup, GradientView, ImageSliderSelector, ItemList, LoadingCover, MapPopup, MenuBar, PageContainer, TextHeader, TextInfoPopup, TextInputPopup } from "../HelperFiles/CompIndex";
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
    infoPopupText?: string,
    showNameInputPopup: boolean,
    showDeletePopup: boolean,
    showSavePopup: boolean,
    saved: boolean
}

export default class BusinessEditProductCategoryPage extends CustomComponent<BusinessEditProductCategoryProps, State> {

    constructor(props: BusinessEditProductCategoryProps) {
        super(props)
        this.state = {
          productCategory: undefined,
          products: undefined,
          infoPopupText: undefined,
          showNameInputPopup: false,
          showDeletePopup: false,
          showSavePopup: false,
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
      const productCat = await this.props.businessFuncs.getProductCategory(this.props.route.params.productCategoryName)
      let products = await Promise.all(productCat.productIDs.map((productID) => {
        return this.props.businessFuncs.getProduct(productID)
      }))
      this.setState({productCategory: productCat, products: products})
    }

    updateProductCategory(category: Partial<ProductCategory>, stateUpdates?: Partial<State>, callback?: () => void) {
      let newCategory = {...this.state.productCategory} as ProductCategory | undefined
      if (newCategory) {
        newCategory = {
          ...newCategory,
          ...category
        }
        let stateUpdate: Partial<State> = {
          ...stateUpdates,
          productCategory: newCategory,
          saved: false
        }
        this.setState(stateUpdate, callback)
      }
    }

    renderInfoPopup() {
      if (this.state.infoPopupText) {
        return (
          <TextInfoPopup
          headerText={"Edit Product Category"}
            onExit={() => this.setState({infoPopupText: undefined})}
          >{this.state.infoPopupText}</TextInfoPopup>
        )
      }
    }

    renderSavePopup() {
      if (this.state.showSavePopup) {
        return (
          <ConfirmationPopup
            type={"save"}
            onExit={() => this.setState({showSavePopup: false})}
            onDeny={() => {
              this.setState({saved: true, showSavePopup: false}, () => {
                this.props.navigation.goBack()
              })
            }}
            onConfirm={async () => {
              if (this.state.productCategory) {
                await this.props.businessFuncs.updateProductCategory(this.props.route.params.productCategoryName, this.state.productCategory)
              }
              this.setState({showSavePopup: false, saved: true}, () => {
                this.props.navigation.goBack()
              })
            }}
          />
        )
      }
    }

    renderDeletePopup() {
      if (this.state.showDeletePopup) {
        return (
          <ConfirmationPopup
            type={"delete"}
            onDeny={() => this.setState({showDeletePopup: false})}
            onConfirm={async () => {
              if (this.state.productCategory) {
                await this.props.businessFuncs.deleteProductCategory(this.props.route.params.productCategoryName)
              }
              this.setState({showDeletePopup: false, saved: true}, () => {
                this.props.navigation.goBack()
              })
            }}
            showConfirmLoading={true}
          />
        )
      }
    }

    renderAddButton() {
      return (
        <TextButton
          text={"Add new product"}
          appearance={"light"}
          rightIconSource={icons.plus}
          buttonFunc={async () => {
              this.setState({showNameInputPopup: true})
          }}
        />
      )
    }

    renderNameInput() {
      if (this.state.showNameInputPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showNameInputPopup: false})}}
            onSaveText={async (text) => {
              let newProduct: ProductData = {
                ...DefaultProductData,
                businessID: this.props.businessFuncs.businessID,
                category: this.props.route.params.productCategoryName,
                name: text,
                isVisible: false,
              }
              await this.props.businessFuncs.createProduct(newProduct)
              await this.refreshData()
              this.setState({showNameInputPopup: false})
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
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={async () => {
            if (!this.state.saved && this.state.productCategory) {
              await this.props.businessFuncs.updateProductCategory(
                this.props.route.params.productCategoryName,
                this.state.productCategory)
            }
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
          textStyle={{color: "red"}}
          rightIconSource={icons.minus}
          rightIconStyle={{tintColor: "red"}}
          buttonFunc={() => this.setState({showDeletePopup: true})}
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
                contentContainerStyle={{paddingBottom: menuBarHeight + styleValues.mediumPadding}}
                data={this.state.products ? this.state.products : []}
                keyExtractor={(_, index) => index.toString()}
                renderItem={(params) => {return this.renderProductCard(params)}}
                ListFooterComponent={this.renderDeleteButton()}
                ListHeaderComponent={() => this.renderAddButton()}
                fadeTop={false}
                onDragEnd={(params) => this.updateProductCategory({productIDs: params.data.map((productData) => (productData.productID))}, {products: params.data})}
              />
              <GradientView/>
            </View>
            <TextHeader
              infoButtonFunc={() => {
                this.setState({infoPopupText: "A product category can contain many different products. Press and hold on a product to rearrange their order."})
              }}
            >{this.props.route.params.productCategoryName}</TextHeader>
          </View>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoading() {
      if (!this.state.productCategory || !this.state.products) {
        return (
          <LoadingCover size={"large"}/>
        )
      }
    }

    render() {
      return (
        <PageContainer>
          {this.renderUI()}
          {this.renderLoading()}
          <MenuBar
              buttonProps={[
                {
                  ...iconButtonTemplates.back,
                  buttonFunc: () => {
                    if (!this.state.saved) {
                      this.setState({showSavePopup: true})
                    } else {
                      this.props.navigation.goBack()
                    }
                  }
                }, {
                  ...iconButtonTemplates.save,
                  iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor},
                  buttonFunc: async () => {
                    if (this.state.productCategory && !this.state.saved) {
                      await this.props.businessFuncs.updateProductCategory(this.props.route.params.productCategoryName, this.state.productCategory)
                      this.setState({saved: true})
                    }
                  }
                }
              ]}
            ></MenuBar>
            {this.renderInfoPopup()}
            {this.renderNameInput()}
            {this.renderDeletePopup()}
            {this.renderSavePopup()}
        </PageContainer>
      )
    }
}

const styles = StyleSheet.create({
    list: {
      width: "100%",
    },
})