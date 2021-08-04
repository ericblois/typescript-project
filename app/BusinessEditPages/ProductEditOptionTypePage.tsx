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
import { DefaultProductOption, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { GradientView, IconButton, ImageSliderSelector, ItemList, LoadingCover, MapPopup, MenuBar, PageContainer, TextHeader, TextInfoPopup, TextInputPopup, ConfirmationPopup, ToggleSwitch } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';
import UserFunctions from "../HelperFiles/UserFunctions";

type ProductEditOptionTypeNavigationProp = StackNavigationProp<BusinessEditStackParamList, "editOptionType">;

type ProductEditOptionTypeRouteProp = RouteProp<BusinessEditStackParamList, "editOptionType">;

type ProductEditOptionTypeProps = {
    navigation: ProductEditOptionTypeNavigationProp,
    route: ProductEditOptionTypeRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    productData?: ProductData,
    optionType?: ProductOptionType,
    infoPopupText?: string,
    showNameInputPopup: boolean,
    showDeletePopup: boolean,
    showSavePopup: boolean,
    saved: boolean
}

export default class ProductEditOptionTypePage extends CustomComponent<ProductEditOptionTypeProps, State> {

    constructor(props: ProductEditOptionTypeProps) {
        super(props)
        this.state = {
          productData: undefined,
          optionType: undefined,
          infoPopupText: undefined,
          showNameInputPopup: false,
          showDeletePopup: false,
          showSavePopup: false,
          saved: true
        }
        props.navigation.addListener("focus", () => {
            this.refreshData()
        })
    }

    componentDidMount() {
        this.refreshData()
    }

    refreshData() {
        this.props.businessFuncs.getProduct(this.props.route.params.productID).then((productData) => {
            const optionType = productData.optionTypes.find((optionType) => {
                return (optionType.name === this.props.route.params.optionType)
            })
            this.setState({productData: productData, optionType: optionType})
        })
    }

    renderNameInput() {
      if (this.state.showNameInputPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showNameInputPopup: false})}}
            onSaveText={async (text) => {
              let newProductData = this.state.productData
              let newOptionType = this.state.optionType
              if (newProductData && newOptionType) {
                  newOptionType.options.push({
                      ...DefaultProductOption,
                      name: text
                  })
                  const optionTypeIndex = newProductData.optionTypes.findIndex((optionType) => {
                      return optionType.name === newOptionType!.name
                  })
                  if (optionTypeIndex > -1) {
                    newProductData.optionTypes[optionTypeIndex] = newOptionType
                    this.setState({
                        productData: newProductData,
                        optionType: newOptionType,
                        showNameInputPopup: false,
                        saved: false
                    })
                }
              }
            }}
            textInputProps={{
              textProps: {
                placeholder: "Name of new option",
              }
            }}
          />
        )
      }
    }

    renderInfoPopup() {
      if (this.state.infoPopupText) {
        return (
          <TextInfoPopup
          headerText={"Edit Option Type"}
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
              this.setState({saved: true, showSavePopup: false})
              this.props.navigation.goBack()
            }}
            onConfirm={async () => {
              if (this.state.productData) {
                let newProductData = this.state.productData
                await this.props.businessFuncs.updateProduct(this.props.route.params.productID, newProductData)
                this.setState({saved: true, showSavePopup: false})
                this.props.navigation.goBack()
                return
              }
              this.props.navigation.goBack()
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
              let newProductData = this.state.productData
              if (newProductData) {
                  const optionTypeIndex = newProductData.optionTypes.findIndex((optionType) => {
                      return optionType.name === this.props.route.params.optionType
                  })
                  if (optionTypeIndex > -1) {
                      newProductData.optionTypes.splice(optionTypeIndex, 1)
                      await this.props.businessFuncs.updateProduct(
                          this.props.route.params.productID,
                          newProductData
                      )
                  }
                  this.setState({showDeletePopup: false})
                  this.props.navigation.goBack()
              }
            }}
          />
        )
      }
    }

    renderOptionButton(params: RenderItemParams<ProductOption>) {
      return (
        <TextButton
          text={params.item.name}
          buttonStyle={{...buttonStyles.noColor, ...{justifyContent: "space-between"}}}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={async () => {
            if (!this.state.saved && this.state.productData) {
                await this.props.businessFuncs.updateProduct(
                    this.props.route.params.productID,
                    this.state.productData
                )
                this.setState({saved: true})
            }
            this.props.navigation.navigate("editOption", {
                productID: this.props.route.params.productID,
                optionType: this.props.route.params.optionType,
                option: params.item.name,
                
            })
          }}
          touchableProps={{
            onLongPress: params.drag
          }}
        />
      )
    }

    renderAddButton() {
      return (
        <TextButton
          text={"Add new option"}
          appearance={"light"}
          rightIconSource={icons.plus}
          buttonFunc={async () => {
              this.setState({showNameInputPopup: true})
          }}
        />
      )
    }

    renderDeleteButton() {
        return (
          <TextButton
            text={"Delete this option type"}
            buttonStyle={buttonStyles.noColor}
            textStyle={{color: "red"}}
            rightIconSource={icons.minus}
            rightIconStyle={{tintColor: "red"}}
            buttonFunc={() => this.setState({showDeletePopup: true})}
          />
        )
    }
    // Render the UI once loading is complete
    renderUI() {
      if (this.state.optionType) {
      return (
        <View style={{alignItems: "center", paddingTop: defaults.textHeaderBox.height}}>
            <ToggleSwitch
              text={"Optional"}
              style={{width: styleValues.winWidth - styleValues.mediumPadding*2, marginTop: styleValues.mediumPadding*2}}
              textStyle={textStyles.small}
              onToggle={(value) => {
                const newOptionType = this.state.optionType
                if (newOptionType) {
                  newOptionType.allowMultiple = value
                  this.setState({optionType: newOptionType, saved: false})
                }
              }}
            >
              <IconButton
                iconSource={icons.info}
                buttonStyle={{width: "8%"}}
                buttonFunc={() => {
                  this.setState({infoPopupText: "By setting this option type to be optional, customers can skip making a selection from this option type when adding this product to their cart."})
                }}
              />
            </ToggleSwitch>
            <ToggleSwitch
              text={"Enable multiple selections"}
              style={{width: styleValues.winWidth - styleValues.mediumPadding*2}}
              textStyle={textStyles.small}
              onToggle={(value) => {
                const newOptionType = this.state.optionType
                if (newOptionType) {
                  newOptionType.allowMultiple = value
                  this.setState({optionType: newOptionType, saved: false})
                }
              }}
            >
              <IconButton
                iconSource={icons.info}
                buttonStyle={{width: "8%"}}
                buttonFunc={() => {
                  this.setState({infoPopupText: "By enabling multiple selections, customers can make more than one selection from this option type when adding this product to their cart."})
                }}
              />
            </ToggleSwitch>
            <View style={{flex: 1}}>
              <ItemList
              containerStyle={{width: styleValues.winWidth}}
              data={this.state.optionType ? this.state.optionType.options : []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(params) => {return this.renderOptionButton(params)}}
              onDragEnd={(params) => {
                  let optionType = this.state.optionType
                  if (optionType) {
                  optionType.options = params.data
                  }
                  this.setState({optionType: optionType, saved: false})
              }}
              ListHeaderComponent={() => this.renderAddButton()}
              ListFooterComponent={() => this.renderDeleteButton()}
              />
              <GradientView/>
            </View>
            <TextHeader
              infoButtonFunc={() => {
                this.setState({infoPopupText: "Use this page to edit an option type. Option types show up as selectable menus on a product's info page. You can rearrange the order of options by pressing and holding on an option."})
              }}
            >{`${this.props.route.params.productName}: ${this.props.route.params.optionType}`}</TextHeader>
        </View>
      )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoading() {
      if (this.state.optionType === undefined) {
        return (
          <LoadingCover/>
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
                {iconSource: icons.chevron, buttonFunc: () => {
                  if (!this.state.saved) {
                    this.setState({showSavePopup: true})
                  } else {
                    this.props.navigation.goBack()
                  }
                }},
                {iconSource: icons.checkBox, showLoading: true, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: () => {
                    if (this.state.productData) {
                        let newProductData = this.state.productData
                        this.props.businessFuncs.updateProduct(this.props.route.params.productID, newProductData).then(() => {
                            this.setState({saved: true})
                        }, (e) => {
                            throw e;
                        })
                    }
                }}
            ]}
            ></MenuBar>
            {this.renderNameInput()}
            {this.renderInfoPopup()}
            {this.renderSavePopup()}
            {this.renderDeletePopup()}
        </PageContainer>
      )
  }
}