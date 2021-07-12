import React, { Component } from "react";
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductOption, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { IconButton, ImageSliderSelector, MenuBar, PageContainer, ScrollContainer, TextInputPopup, CurrencyInputBox } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { prefetchImages } from "../HelperFiles/ClientFunctions"
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';
import UserFunctions from "../HelperFiles/UserFunctions";

type ProductEditOptionNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editOption">;

type ProductEditOptionRouteProp = RouteProp<BusinessMainStackParamList, "editOption">;

type ProductEditOptionProps = {
    navigation: ProductEditOptionNavigationProp,
    route: ProductEditOptionRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    productData?: ProductData,
    option?: ProductOption,
    newImages: string[],
    deletedImages: string[],
    priceChange: "increase" | "decrease" | "none",
    imagesLoaded: boolean,
    saved: boolean
}

export default class ProductEditOptionPage extends Component<ProductEditOptionProps, State> {

    constructor(props: ProductEditOptionProps) {
        super(props)
        this.state = {
          productData: undefined,
          newImages: [],
          deletedImages: [],
          option: undefined,
          priceChange: "none",
          imagesLoaded: false,
          saved: true
        }
        props.navigation.addListener("focus", () => {
            this.refreshData()
        })
    }

    componentDidMount() {
      this.refreshData()
  }

    async refreshData() {
      this.props.businessFuncs.getProduct(this.props.route.params.productID).then((productData) => {
        const optionType = productData.optionTypes.find((optionType) => {
            return (optionType.name === this.props.route.params.optionType)
        })
        let option: ProductOption | undefined
        if (optionType) {
          option = optionType.options.find((option) => {
            return (option.name === this.props.route.params.option)
          })
        }
        if (option === undefined) {
          throw new Error("Could not retrieve option by the name of ".concat(this.props.route.params.option))
        }
        let priceChange: State["priceChange"] = "none"
        if (option.priceChange !== null) {
          priceChange = option.priceChange < 0 ? "decrease" : "increase"
        }
        this.setState({productData: productData, option: option, priceChange: priceChange})
      })
    }

    updateOption(option: ProductOption, callback?: () => void) {
      let newProductData = this.state.productData
      if (newProductData) {
        const optionTypeIndex = newProductData.optionTypes.findIndex((optionType) => {
            return optionType.name === this.props.route.params.optionType
        })
        if (optionTypeIndex > -1) {
          const optionIndex = newProductData.optionTypes[optionTypeIndex].options.findIndex((option) => {
            return option.name === this.props.route.params.option
          })
          if (optionIndex > -1) {
            newProductData.optionTypes[optionTypeIndex].options[optionIndex] = option
            this.setState({productData: newProductData, option: option, saved: false}, callback)
          }
        }
      }
    }

    renderPriceChangeBox() {
      if (this.state.priceChange !== "none") {
        return (
          <CurrencyInputBox
            currencyProps={{
              value: this.state.option?.priceChange,
              placeholder: "Amount",
              showPositiveSign: true,
              signPosition: "beforePrefix",
              onChangeValue: (value) => {
                let newOption = this.state.option
                if (newOption) {
                  let newValue: number | null = null
                  if (value !== null) {
                    newValue = this.state.priceChange === "decrease" ? -Math.abs(value) : value
                  }
                  newOption.priceChange = newValue
                  this.updateOption(newOption)
                }
              },
            }}
            avoidKeyboard={true}
          ></CurrencyInputBox>
        )
      }
    }

    renderDeleteButton() {
      return (
        <TextButton
          text={"Delete this option"}
          buttonStyle={defaults.textButtonNoColor}
          textStyle={{color: "red"}}
          buttonFunc={async () => {
            let newProductData = this.state.productData
            if (newProductData) {
                const optionTypeIndex = newProductData.optionTypes.findIndex((optionType) => {
                    return optionType.name === this.props.route.params.optionType
                })
                if (optionTypeIndex > -1) {
                    const optionIndex = newProductData.optionTypes[optionTypeIndex].options.findIndex((option) => {
                      return option.name === this.props.route.params.option
                    })
                    if (optionIndex > -1) {
                      newProductData.optionTypes[optionTypeIndex].options.splice(optionIndex, 1)
                      await this.props.businessFuncs.updateProduct(
                          this.props.route.params.productID,
                          newProductData
                      )
                    }
                }
                this.props.navigation.goBack()
            }
          }}
        />
      )
    }
    // Render the UI once loading is complete
    renderUI() {
      if (this.state.option) {
        return (
          <PageContainer>
          <ScrollContainer>
            <ImageSliderSelector
              uris={this.state.option ? this.state.option.images : []}
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
                  defaultValue: this.state.option?.name,
                  placeholder: "Option Name",
                  onChangeText: (text) => {
                    let newOption = this.state.option
                    if (newOption) {
                      newOption.name = text
                      this.updateOption(newOption)
                    }
                  }
              }}
              avoidKeyboard={true}
            ></TextInputBox>
            <View style={defaults.dividerBox}>
              <Text style={defaults.mediumTextHeader}>Price Change</Text>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%"
              }}>
                <TextButton
                  text={"Increase"}
                  buttonStyle={styles.priceButton}
                  appearance={this.state.priceChange === "increase" ? "color" : "no-color"}
                  buttonFunc={() => {
                    this.setState({priceChange: "increase"})
                    let newOption = this.state.option
                    if (newOption?.priceChange) {
                      newOption.priceChange = Math.abs(newOption.priceChange)
                      this.updateOption(newOption)
                    }
                  }}
                ></TextButton>
                <View style={{width: styleValues.mediumPadding}}/>
                <TextButton
                  text={"Decrease"}
                  buttonStyle={styles.priceButton}
                  appearance={this.state.priceChange === "decrease" ? "color" : "no-color"}
                  buttonFunc={() => {
                    this.setState({priceChange: "decrease"})
                    let newOption = this.state.option
                    if (newOption?.priceChange) {
                      newOption.priceChange = -Math.abs(newOption.priceChange)
                      this.updateOption(newOption)
                    }
                  }}
                ></TextButton>
                <View style={{width: styleValues.mediumPadding}}/>
                <TextButton
                  text={"None"}
                  buttonStyle={styles.priceButton}
                  appearance={this.state.priceChange === "none" ? "color" : "no-color"}
                  buttonFunc={() => {
                    this.setState({priceChange: "none"})
                    let newOption = this.state.option
                    if (newOption) {
                      newOption.priceChange = null
                      this.updateOption(newOption)
                    }
                  }}
                ></TextButton>
              </View>
              {/* Price change */}
              {this.renderPriceChangeBox()}
            </View>
            {this.renderDeleteButton()}
          </ScrollContainer>
          <MenuBar
            buttonProps={[
              {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
              {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? styleValues.validColor : styleValues.invalidColor}, buttonFunc: async () => {
                  if (this.state.productData && this.state.option) {
                      // Add new images
                      let downloadURLs: string[] = await this.props.businessFuncs.uploadImages(this.state.newImages)
                      // Delete images
                      await this.props.businessFuncs.deleteImages(this.state.deletedImages)
                      // Update public data
                      const newOption = this.state.option
                      // Delete URLs
                      let prevURLs: string[] = []
                      newOption.images.forEach((url) => {
                        if (!this.state.deletedImages.includes(url)) {
                          prevURLs.push(url)
                        }
                      })
                      // Add new URLs
                      newOption.images = prevURLs.concat(downloadURLs)
                      this.updateOption(newOption, () => {
                        this.props.businessFuncs.updateProduct(this.state.productData!.productID, this.state.productData!).then(() => {
                          this.setState({saved: true})
                        }, (e) => {
                            throw e;
                        })
                      })
                  }
              }}
            ]}
          ></MenuBar>
        </PageContainer>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoadScreen() {
      if (this.state.option === undefined || !this.state.imagesLoaded) {
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
      <View>
        {this.renderUI()}
        {this.renderLoadScreen()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
    headerText: {
      fontSize: styleValues.largeTextSize
    },
    list: {
      width: "100%",
    },
    priceButton: {
      flex: 1,
      width: undefined
    }
})