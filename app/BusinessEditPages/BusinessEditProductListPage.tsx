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
import { ImageSliderSelector, MapPopup, MenuBar, TextInputPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';

type BusinessEditProductListNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editProductList">;

type BusinessEditProductListRouteProp = RouteProp<BusinessMainStackParamList, "editProductList">;

type BusinessEditProductListProps = {
    navigation: BusinessEditProductListNavigationProp,
    route: BusinessEditProductListRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    publicData?: PublicBusinessData,
    showPopup: boolean,
    saved: boolean
}

export default class BusinessEditProductListPage extends Component<BusinessEditProductListProps, State> {

    constructor(props: BusinessEditProductListProps) {
        super(props)
        this.state = {
          publicData: undefined,
          showPopup: false,
          saved: true
        }
        props.navigation.addListener("focus", (event) => {
          this.refreshData()
        })
        this.refreshData()
    }

    refreshData() {
      this.props.businessFuncs.getPublicData().then((publicData) => {
        this.setState({publicData: publicData})
      })
    }

    renderTextPopup() {
      if (this.state.showPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showPopup: false})}}
            onSaveText={async (text) => {
              let productList = this.state.publicData?.productList ? this.state.publicData.productList : []
              productList.push({
                name: text,
                productIDs: []
              })
              const newPublicData = await this.props.businessFuncs.updatePublicData({productList: productList})
              this.setState({publicData: newPublicData, showPopup: false})
            }}
            textInputProps={{
              extraTextProps: {
                placeholder: "Name of new category",
              }
            }}
          />
        )
      }
    }

    renderCategoryCard(params: RenderItemParams<ProductCategory>) {
      return (
        <TextButton
          text={params.item.name}
          buttonStyle={{...defaults.textButtonNoColor, ...{justifyContent: "space-between"}}}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={() => {
            this.props.navigation.navigate("editProductCat", {productCategory: params.item.name})
          }}
          touchableProps={{
            onLongPress: params.drag
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
          Categories
        </Text>
        <DraggableFlatList
          containerStyle={styles.list}
          data={this.state.publicData?.productList ? this.state.publicData.productList : []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(params) => {return this.renderCategoryCard(params)}}
          onDragEnd={(params) => {
            let publicData = this.state.publicData ? this.state.publicData : {id: this.props.businessFuncs.businessID} as PublicBusinessData
            publicData.productList = params.data
            this.setState({publicData: publicData, saved: false})
          }}
        />
        <MenuBar
          buttonProps={[
            {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
            {iconSource: icons.plus, buttonFunc: () => {this.setState({showPopup: true})}},
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