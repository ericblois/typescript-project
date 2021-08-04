import React, { Component, useRef } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ImageURISource, ScrollView, Keyboard, Platform, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth, currencyFormatter } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductOptionType, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { CurrencyInputBox, GradientView, IconButton, ImageSliderSelector, ItemList, MapPopup, MenuBar, PageContainer, ScrollContainer, TextDropdown, TextHeader, TextInputPopup } from "../HelperFiles/CompIndex";
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
    newImages: string[],
    deletedImages: string[],
    imagesLoaded: boolean,
    priceChangeText: string,
    editPriceMode: boolean,
    saved: boolean,
    optionNamePopup: boolean,
}

export default class BusinessEditProductPage extends CustomComponent<BusinessEditProductProps, State> {

    scrollContainer: ScrollContainer | null = null

    constructor(props: BusinessEditProductProps) {
        super(props)
        this.state = {
          productData: undefined,
          newImages: [],
          deletedImages: [],
          imagesLoaded: false,
          priceChangeText: "",
          editPriceMode: false,
          saved: true,
          optionNamePopup: false,
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

    renderOptionNamePopup() {
      return this.state.optionNamePopup ? (
        <TextInputPopup
          onTapAway={() => this.setState({optionNamePopup: false})}
          onSaveText={(text) => {
            let newProductData = this.state.productData
            if (newProductData) {
              newProductData.optionTypes.push({
                ...DefaultProductOptionType,
                name: text,
              })
              this.setState({
                productData: newProductData,
                optionNamePopup: false,
                saved: false
              })
            }
          }}
        ></TextInputPopup>
      ) : undefined
    }

    renderOptionTypeButton(params: RenderItemParams<ProductOptionType>) {
      return (
        <TextButton
          text={params.item.name}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={async () => {
            if (!this.state.saved && this.state.productData) {
              await this.props.businessFuncs.updateProduct(this.props.route.params.productID, this.state.productData)
              this.setState({saved: true})
            } else if (this.state.productData) {
              this.props.navigation.navigate("editOptionType", {
                productID: this.props.route.params.productID,
                productName: this.state.productData.name,
                optionType: params.item.name
              })
            }
          }}
          touchableProps={{
            onLongPress: params.drag,
          }}
          key={params.item.name}
        ></TextButton>
      )
    }

    renderOptionTypes() {
        return (
        <ItemList
          containerStyle={{
            width: styleValues.winWidth,
          }}
          data={this.state.productData ? this.state.productData.optionTypes : []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(params) => {
            return this.renderOptionTypeButton(params)
          }}
          onDragEnd={(params) => {
            let newProductData = this.state.productData
            if (newProductData) {
              newProductData.optionTypes = params.data
              this.setState({productData: newProductData, saved: false})
            }
          }}
          ListFooterComponent={() => (
            <TextButton
              text={"Add a new option type"}
              appearance={"light"}
              rightIconSource={icons.plus}
              buttonFunc={() => this.setState({optionNamePopup: true})}
            />
          )}
          nestedScrollEnabled={true}
          pointerEvents={"box-none"}
        ></ItemList>)
    }

    renderDeleteButton() {
      return (
        <TextButton
          text={"Delete this product"}
          buttonStyle={buttonStyles.noColor}
          textStyle={{color: "red"}}
          buttonFunc={async () => {
            await this.props.businessFuncs.deleteProduct(this.props.route.params.productID).then(() => {
              this.props.navigation.goBack()
            })
          }}
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
            <ImageSliderSelector
              uris={this.state.productData ? this.state.productData.images : []}
              onChange={(uris) => {
                this.setState({newImages: uris.new, deletedImages: uris.deleted, saved: false})
              }}
              onImagesLoaded={() => {
                this.setState({imagesLoaded: true})
              }}
            />
            {/* Name */}
            <TextInputBox
              textProps={{
                  defaultValue: this.state.productData?.name,
                  placeholder: "Product Name",
                  onChangeText: (text) => {
                    let newProductData = this.state.productData
                    if (newProductData) {
                      newProductData.name = text
                      this.setState({productData: newProductData, saved: false})
                    }
                  }
              }}
              avoidKeyboard={true}
            ></TextInputBox>
            {/* Description */}
            <TextInputBox
              style={styles.descriptionBox}
              textStyle={{fontSize: styleValues.smallerTextSize}}
              textProps={{
                  defaultValue: this.state.productData?.description,
                  placeholder: "Description",
                  multiline: true,
                  onChangeText: (text) => {
                    let newProductData = this.state.productData
                    if (newProductData) {
                      newProductData.description = text
                      this.setState({productData: newProductData, saved: false})
                    }
                  }
              }}
              avoidKeyboard={true}
            ></TextInputBox>
            {/* Price */}
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
                  let newProductData = {...this.state.productData} as ProductData | undefined
                  if (newProductData) {
                    let newPrice: number = parseFloat(text)
                    newPrice = isNaN(newPrice) ? 0 : newPrice
                    newProductData.price = newPrice
                    const saved = newPrice === this.state.productData!.price ? this.state.saved : false
                    this.setState({productData: newProductData, editPriceMode: false, saved: saved})
                  }
                }
              }}
            />
            <View
              style={styles.optionsContainer}
            >
              <Text
                style={{...textStyles.medium, ...{marginBottom: styleValues.mediumPadding}}}
              >Option Types</Text>
              {this.renderOptionTypes()}
            </View>
            {this.renderDeleteButton()}
          </ScrollContainer>
          <TextHeader>{`${this.state.productData.category}: ${this.state.productData.name}`}</TextHeader>
        </View>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoadScreen() {
      if (this.state.productData === undefined || !this.state.imagesLoaded) {
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
            {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: async () => {
                if (this.state.productData) {
                    // Add new images
                    let downloadURLs: string[] = await this.props.businessFuncs.uploadImages(this.state.newImages)
                    // Delete images
                    await this.props.businessFuncs.deleteImages(this.state.deletedImages)
                    // Update public data
                    const newProductData = this.state.productData
                    // Delete URLs
                    let prevURLs: string[] = []
                    newProductData.images.forEach((url) => {
                      if (!this.state.deletedImages.includes(url)) {
                        prevURLs.push(url)
                      }
                    })
                    // Add new URLs
                    newProductData.images = prevURLs.concat(downloadURLs)
                    this.props.businessFuncs.updateProduct(this.state.productData.productID, newProductData).then(() => {
                        this.setState({saved: true})
                    }, (e) => {
                        throw e;
                    })
                }
            }}
          ]}
        ></MenuBar>
        {this.renderOptionNamePopup()}
      </PageContainer>
    )
  }
}

const styles = StyleSheet.create({
  descriptionBox: {
      height: styleValues.winWidth * 0.25
  },
  optionsContainer: {
    alignItems: "center",
    width: styleValues.winWidth,
    borderRadius: styleValues.bordRadius,
    padding: styleValues.mediumPadding,
    paddingBottom: 0,
    marginBottom: styleValues.mediumPadding,
    flexShrink: 1
  },
})