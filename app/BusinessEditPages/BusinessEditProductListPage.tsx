import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth, iconButtonTemplates } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductCategory, ProductCategory, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { ConfirmationPopup, GradientView, ImageSliderSelector, ItemList, LoadingCover, MapPopup, MenuBar, PageContainer, TextHeader, TextInfoPopup, TextInputPopup } from "../HelperFiles/CompIndex";
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
    infoPopupText?: string,
    showNameInputPopup: boolean,
    showSavePopup: boolean,
    saved: boolean
}

export default class BusinessEditProductListPage extends CustomComponent<BusinessEditProductListProps, State> {

    constructor(props: BusinessEditProductListProps) {
        super(props)
        this.state = {
          publicData: undefined,
          infoPopupText: undefined,
          showNameInputPopup: false,
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
      const publicData = await this.props.businessFuncs.getPublicData()
      this.setState({publicData: publicData})
    }

    updatePublicData(publicData: Partial<PublicBusinessData>, stateUpdates?: Partial<State>, callback?: () => void) {
      let newPublicData = {...this.state.publicData} as PublicBusinessData | undefined
      if (newPublicData) {
        newPublicData = {
          ...newPublicData,
          ...publicData
        }
        let stateUpdate: Partial<State> = {
          ...stateUpdates,
          publicData: newPublicData,
          saved: false
        }
        this.setState(stateUpdate, callback)
      }
    }

    renderInfoPopup() {
      if (this.state.infoPopupText) {
        return (
          <TextInfoPopup
          headerText={"Edit Product List"}
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
              if (this.state.publicData) {
                await this.props.businessFuncs.updatePublicData(this.state.publicData)
              }
              this.setState({showSavePopup: false, saved: true}, () => {
                this.props.navigation.goBack()
              })
            }}
          />
        )
      }
    }

    renderAddButton() {
      return (
        <TextButton
          text={"Add new category"}
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
            onSaveText={(text) => {
              let newProductList = this.state.publicData?.productList
              if (newProductList) {
                newProductList.push({
                  ...DefaultProductCategory,
                  name: text,
                })
                this.updatePublicData({productList: newProductList}, {showNameInputPopup: false})
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
            this.props.navigation.navigate("editProductCat", {productCategoryName: params.item.name})
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
              onDragEnd={(params) => this.updatePublicData({productList: params.data})}
              ListHeaderComponent={() => this.renderAddButton()}
            />
            <TextHeader
              infoButtonFunc={() => {
                this.setState({infoPopupText: "Product categories organize your products into groups. Press and hold on a category to rearrange their order."})
              }}
            >Categories</TextHeader>
          </View>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoading() {
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
                  if (this.state.publicData && !this.state.saved) {
                    await this.props.businessFuncs.updatePublicData(this.state.publicData)
                    this.setState({saved: true})
                  }
                }
              }
            ]}
          ></MenuBar>
          {this.renderInfoPopup()}
          {this.renderNameInput()}
          {this.renderSavePopup()}
        </PageContainer>
      )
    }
}

const styles = StyleSheet.create({
    
})