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
import { DefaultProductCategory, ProductCategory, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { GradientView, ImageSliderSelector, ItemList, LoadingCover, MapPopup, MenuBar, PageContainer, TextHeader, TextInputPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList, TextInput } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';
import UserFunctions from "../HelperFiles/UserFunctions";

type BusinessEditProductListNavigationProp = StackNavigationProp<BusinessEditStackParamList, "editProductList">;

type BusinessEditProductListRouteProp = RouteProp<BusinessEditStackParamList, "editProductList">;

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

export default class BusinessEditProductListPage extends CustomComponent<BusinessEditProductListProps, State> {

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
    }

    componentDidMount() {
      this.refreshData()
  }

    refreshData() {
      this.props.businessFuncs.getPublicData().then((publicData) => {
        this.setState({publicData: publicData})
      })
    }

    renderAddButton() {
      return (
        <TextButton
          text={"Add new category"}
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
            onSaveText={(text) => {
              let newPublicData = this.state.publicData
              if (newPublicData) {
                newPublicData.productList.push({
                  ...DefaultProductCategory,
                  name: text,
                })
                this.setState({
                  publicData: newPublicData,
                  showPopup: false,
                  saved: false
                })
              }
            }}
            textInputProps={{
              textProps: {
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
          buttonStyle={{...buttonStyles.noColor, ...{justifyContent: "space-between"}}}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={async () => {
            if (!this.state.saved && this.state.publicData) {
              await this.props.businessFuncs.updatePublicData(this.state.publicData)
              this.setState({saved: true})
            }
            this.props.navigation.navigate("editProductCat", {productCategory: params.item.name})
          }}
          touchableProps={{
            onLongPress: params.drag
          }}
        />
      )
    }

    // Render the UI once loading is complete
    renderUI() {
      if (this.state.publicData) {
        return (
          <View>
            <ItemList
              containerStyle={{width: styleValues.winWidth, paddingTop: defaults.textHeaderBox.height}}
              data={this.state.publicData ? this.state.publicData.productList : []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(params) => {return this.renderCategoryCard(params)}}
              onDragEnd={(params) => {
                let publicData = this.state.publicData
                if (publicData) {
                  publicData.productList = params.data
                }
                this.setState({publicData: publicData, saved: false})
              }}
              ListHeaderComponent={() => this.renderAddButton()}
            />
            <TextHeader>Categories</TextHeader>
          </View>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoadScreen() {
      if (!this.state.publicData) {
        return (
          <LoadingCover size={"large"}/>
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
                  if (this.state.publicData) {
                      this.props.businessFuncs.updatePublicData(this.state.publicData).then(() => {
                          this.setState({saved: true})
                      }, (e) => {
                          throw e;
                      })
                  }
              }}
            ]}
          ></MenuBar>
          {this.renderTextPopup()}
        </PageContainer>
      )
    }
}

const styles = StyleSheet.create({
    
})