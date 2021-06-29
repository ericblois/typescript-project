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
import { ProductCategory, PublicBusinessData } from "../HelperFiles/DataTypes";
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
    saved: boolean
}

export default class BusinessEditProductPage extends Component<BusinessEditProductProps, State> {

    constructor(props: BusinessEditProductProps) {
        super(props)
        this.state = {
          publicData: undefined,
          saved: true
        }
    }

    componentDidMount() {
      this.props.businessFuncs.getPublicData().then((publicData) => {
        this.setState({publicData: publicData})
      })
    }

    renderCategoryCard(cat: ProductCategory) {
      return (
        <TextButton
          text={cat.name}
          buttonFunc={() => {
            this.props.navigation.navigate("editProductCat")
          }}
        />
      )
    }

  render() {
    return (
      <View style={defaults.pageContainer}>
        <FlatList
          style={styles.list}
          data={this.state.publicData?.productList ? this.state.publicData.productList : []}
          renderItem={({item}) => {
            return this.renderCategoryCard(item)
          }}
          ListHeaderComponent={(
            <TextButton
              text={"Create a new category"}
              buttonStyle={{...defaults.textButtonNoColor, ...{width: "100%", justifyContent: "space-between"}}}
              rightIconSource={icons.plus}
            />
          )}
        />
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