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
          showPopup: false,
          saved: true
        }
    }

    componentDidMount() {
      this.props.businessFuncs.getProductCategory(this.props.route.params.productCategory).then((productCat) => {
        this.setState({productCategory: productCat})
      })
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
              this.props.businessFuncs.addProduct(newProduct)
              const newProductCat = await this.props.businessFuncs.getProductCategory(this.props.route.params.productCategory)
              this.setState({productCategory: newProductCat, showPopup: false})
            }}
            textInputProps={{
              extraTextProps: {
                placeholder: "Name of new product",
              }
            }}
          />
        )
      }
    }

    async renderProductCard(params: RenderItemParams<string>) {
      let product = await this.props.businessFuncs.getProduct(params.item)
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
              this.props.navigation.navigate("editProductList")
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
          data={this.state.productCategory.productIDs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(params) => {return this.renderProductCard(params)}}
          ListFooterComponent={this.renderDeleteButton()}
          onDragEnd={(params) => {
            let productCat = this.state.productCategory
            productCat.productIDs = params.data
            this.setState({productCategory: productCat, saved: false})
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