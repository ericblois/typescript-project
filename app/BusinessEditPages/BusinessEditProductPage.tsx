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
import { ImageSliderSelector, MapPopup, MenuBar } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList } from "react-native-gesture-handler";

type BusinessEditProductNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editProduct">;

type BusinessEditProductRouteProp = RouteProp<BusinessMainStackParamList, "editProduct">;

type BusinessEditProductProps = {
    navigation: BusinessEditProductNavigationProp,
    route: BusinessEditProductRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    publicData?: PublicBusinessData,
    productData?: ProductData,
    saved: boolean
}

export default class BusinessEditProductPage extends Component<BusinessEditProductProps, State> {

    constructor(props: BusinessEditProductProps) {
        super(props)
        this.state = {
          publicData: undefined,
          productData: undefined,
          saved: true
        }
        this.refreshData()
    }

    async refreshData() {
      const publicData = await this.props.businessFuncs.getPublicData()
      const productData = await this.props.businessFuncs.getProduct(this.props.route.params.productID)
      this.setState({productData: productData})
    }

    renderDeleteButton() {
      return (
        <TextButton
          text={"Delete this product"}
          buttonStyle={defaults.textButtonNoColor}
          textStyle={{color: "red"}}
          buttonFunc={async () => {
            await this.props.businessFuncs.deleteProduct(this.props.route.params.productID).then(() => {
              this.props.navigation.goBack()
            })
          }}
        />
      )
    }

  render() {
    return (
      <View style={defaults.pageContainer}>
        <ImageSliderSelector
          uris={this.state.productData?.images ? this.state.productData.images : []}
        />
        {this.renderDeleteButton()}
        <MenuBar
          buttonProps={[
            {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
            {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? styleValues.validColor : styleValues.invalidColor}, buttonFunc: () => {
                if (this.state.publicData) {
                    this.props.businessFuncs.updatePublicData(this.state.publicData).then(() => {
                        this.setState({saved: true})
                    }, (e) => {
                        throw e;
                    })
                }
            }}
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    list: {
      width: "100%"
    },
})