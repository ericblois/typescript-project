import React, { Component, useRef } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ImageURISource, ScrollView, Keyboard, Platform, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth, currencyFormatter, iconButtonTemplates } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductOptionType, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { ConfirmationPopup, CurrencyInputBox, GradientView, IconButton, ImageSliderSelector, ItemList, LoadingCover, MapPopup, MenuBar, PageContainer, ScrollContainer, TextDropdown, TextHeader, TextInfoPopup, TextInputPopup, ToggleSwitch } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams} from "react-native-draggable-flatlist";
import { DraggableGrid } from "react-native-draggable-grid"
import { prefetchImages } from "../HelperFiles/ClientFunctions";

type BusinessEditProductNavigationProp = StackNavigationProp<BusinessEditStackParamList, "editProduct">;

type BusinessEditProductRouteProp = RouteProp<BusinessEditStackParamList, "editProduct">;

type BusinessEditProductProps = {
    navigation: BusinessEditProductNavigationProp,
    route: BusinessEditProductRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    productData?: ProductData,
    imagesLoaded: boolean,
    priceChangeText: string,
    editPriceMode: boolean,
    infoPopupText?: string,
    showNameInputPopup: boolean,
    showDeletePopup: boolean,
    showSavePopup: boolean,
    saved: boolean,
    
}

export default class BusinessEditProductPage extends CustomComponent<BusinessEditProductProps, State> {

    scrollContainer: ScrollContainer | null = null

    constructor(props: BusinessEditProductProps) {
        super(props)
        this.state = {
          productData: undefined,
          imagesLoaded: false,
          priceChangeText: "",
          editPriceMode: false,
          infoPopupText: undefined,
          showNameInputPopup: false,
          showDeletePopup: false,
          showSavePopup: false,
          saved: true,
        }
        props.navigation.addListener("focus", () => {
          this.refreshData()
        })
    }

    componentDidMount() {
      this.refreshData()
  }

    async refreshData() {
      const productData = await this.props.businessFuncs.getProduct(this.props.route.params.productID)
      this.setState({
        productData: productData,
        priceChangeText: productData.price !== null ? Math.abs(productData.price).toString() : "0"
      })
    }

    updateProduct(product: Partial<ProductData>, stateUpdates?: Partial<State>, callback?: () => void) {
      let newProduct = {...this.state.productData} as ProductData | undefined
      if (newProduct) {
        newProduct = {
          ...newProduct,
          ...product
        }
        if (!this.props.businessFuncs.checkProductValidity(newProduct)) {
          newProduct.isVisible = false
        }
        let stateUpdate: Partial<State> = {
          ...stateUpdates,
          productData: newProduct,
          saved: false
        }
        this.setState(stateUpdate, callback)
      }
    }

    renderInfoPopup() {
      if (this.state.infoPopupText) {
        return (
          <TextInfoPopup
          headerText={"Edit Product"}
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
              if (this.state.productData) {
                await this.props.businessFuncs.updateProduct(this.state.productData)
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
              if (this.state.productData) {
                await this.props.businessFuncs.deleteProduct(this.props.route.params.productID)
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
    // Show text input for creation of a new option type
    renderOptionNameInput() {
      return this.state.showNameInputPopup ? (
        <TextInputPopup
          onTapAway={() => this.setState({showNameInputPopup: false})}
          onSaveText={(text) => {
            let newProductData = {...this.state.productData} as ProductData | undefined
            if (newProductData) {
              newProductData.optionTypes.push({
                ...DefaultProductOptionType,
                name: text,
              })
              this.updateProduct(newProductData, {showNameInputPopup: false})
            }
          }}
        ></TextInputPopup>
      ) : undefined
    }
    // Render an individual option type button
    renderOptionTypeButton(params: RenderItemParams<ProductOptionType>) {
      return (
        <TextButton
          text={params.item.name}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={async () => {
            if (!this.state.saved && this.state.productData) {
              await this.props.businessFuncs.updateProduct(this.state.productData)
              this.setState({saved: true})
            }
            this.props.navigation.navigate("editOptionType", {
              productID: this.props.route.params.productID,
              productName: this.state.productData!.name,
              optionTypeName: params.item.name
            })
          }}
          touchableProps={{
            onLongPress: params.drag,
          }}
          key={params.item.name}
        ></TextButton>
      )
    }
    // Render the list of this product's option types
    renderOptionTypes() {
        return (
        <ItemList
          containerStyle={{width: styleValues.winWidth}}
          data={this.state.productData ? this.state.productData.optionTypes : []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={(params) => this.renderOptionTypeButton(params)}
          onDragEnd={(params) => this.updateProduct({optionTypes: params.data})}
          ListFooterComponent={() => (
            <TextButton
              text={"Add a new option type"}
              appearance={"light"}
              rightIconSource={icons.plus}
              buttonFunc={() => this.setState({showNameInputPopup: true})}
            />
          )}
          nestedScrollEnabled={true}
          pointerEvents={"box-none"}
        ></ItemList>)
    }
    // Render a button to delete this product
    renderDeleteButton() {
      return (
        <TextButton
          text={"Delete this product"}
          textStyle={{color: "red"}}
          buttonFunc={async () => this.setState({showDeletePopup: true})}
        />
      )
    }
    // Render the UI once loading is complete
    renderUI() {
      if (this.state.productData) {
        return (
        <View>
          <ScrollContainer
            avoidKeyboard={true}
            containerStyle={{marginTop: defaults.textHeaderBox.height}}
            fadeTop={false}
            ref={(scrollContainer) => {this.scrollContainer = scrollContainer}}
          >
            {/* --- TOGGLE VISIBILITY --- */}
            <ToggleSwitch
              text={"Publicly visible"}
              onToggle={(value) => this.updateProduct({isVisible: value})}
              switchProps={{
                value: this.state.productData.isVisible,
                disabled: !this.props.businessFuncs.checkProductValidity(this.state.productData)
              }}
            >
              <IconButton
                iconSource={icons.info}
                buttonStyle={{width: "8%"}}
                buttonFunc={() => {
                  this.setState({infoPopupText: "When you enable visibility for a product, it is shown publicly on your business page. Disable visibility to hide a product."})
                }}
              />
            </ToggleSwitch>
            {/* --- IMAGES --- */}
            <ImageSliderSelector
              uris={this.state.productData ? this.state.productData.images : []}
              showWarning={true}
              onChange={(uris) => this.updateProduct({images: uris.all})}
              onImagesLoaded={() => {
                this.setState({imagesLoaded: true})
              }}
            ></ImageSliderSelector>
            {/* --- NAME --- */}
            <TextInputBox
              boxStyle={{
                borderColor: this.state.productData.name === "" ? colors.invalidColor : colors.lighterGrayColor
              }}
              textProps={{
                  defaultValue: this.state.productData.name,
                  placeholder: "Product Name",
                  onChangeText: (text) => this.updateProduct({name: text})
              }}
            ></TextInputBox>
           {/* --- DESCRIPTION --- */}
            <TextInputBox
              boxStyle={{height: styleValues.winWidth*0.25}}
              textStyle={{fontSize: styleValues.smallerTextSize}}
              textProps={{
                  defaultValue: this.state.productData?.description,
                  placeholder: "Description",
                  multiline: true,
                  onChangeText: (text) => this.updateProduct({description: text})
              }}
            ></TextInputBox>
            {/* --- PRICE --- */}
            <TextInputBox
              textProps={{
                value: this.state.editPriceMode ? this.state.priceChangeText : currencyFormatter.format(this.state.productData.price),
                keyboardType: "numeric",
                onChangeText: (text) => {
                  this.setState({priceChangeText: text})
                },
                onFocus: () => this.setState({editPriceMode: true}),
                onEndEditing: (event) => {
                  const text = event.nativeEvent.text
                  let newPrice: number = parseFloat(text)
                  newPrice = isNaN(newPrice) ? 0 : newPrice
                  this.updateProduct({price: newPrice}, {editPriceMode: false})
                }
              }}
            />
            {/* --- OPTION TYPES --- */}
            <Text
              style={textStyles.mediumHeader}
            >Option Types</Text>
            {this.renderOptionTypes()}
            {/* --- DELETE BUTTON --- */}
            {this.renderDeleteButton()}
          </ScrollContainer>
          {/* --- TEXT HEADER --- */}
          <TextHeader
            infoButtonFunc={() => {
              this.setState({infoPopupText: "Edit all aspects of an individual product on this page. Press and hold on a product option type to rearrange their order."})
            }}
          >{`${this.state.productData.category}: ${this.state.productData.name}`}</TextHeader>
        </View>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoading() {
      if (this.state.productData === undefined || !this.state.imagesLoaded) {
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
                if (this.state.productData && !this.state.saved) {
                  await this.props.businessFuncs.updateProduct(this.state.productData)
                  this.setState({saved: true})
                }
              }
            }
          ]}
        ></MenuBar>
        {this.renderInfoPopup()}
        {this.renderOptionNameInput()}
        {this.renderDeletePopup()}
        {this.renderSavePopup()}
      </PageContainer>
    )
  }
}

const styles = StyleSheet.create({
  
})