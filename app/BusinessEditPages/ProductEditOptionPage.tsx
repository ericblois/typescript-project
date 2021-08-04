import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth, currencyFormatter } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductOption, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { IconButton, ImageSliderSelector, MenuBar, PageContainer, ScrollContainer, TextInputPopup, CurrencyInputBox, LoadingCover, ToggleSwitch, TextHeader, TextInfoPopup, ConfirmationPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { prefetchImages } from "../HelperFiles/ClientFunctions"
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';
import UserFunctions from "../HelperFiles/UserFunctions";

type ProductEditOptionNavigationProp = StackNavigationProp<BusinessEditStackParamList, "editOption">;

type ProductEditOptionRouteProp = RouteProp<BusinessEditStackParamList, "editOption">;

type ProductEditOptionProps = {
    navigation: ProductEditOptionNavigationProp,
    route: ProductEditOptionRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    option?: ProductOption,
    newImages: string[],
    deletedImages: string[],
    priceChange: "increase" | "decrease" | "none",
    editPriceMode: boolean,
    priceChangeText: string,
    imagesLoaded: boolean,
    infoPopupText?: string,
    showDeletePopup: boolean,
    showSavePopup: boolean,
    saved: boolean
}

export default class ProductEditOptionPage extends CustomComponent<ProductEditOptionProps, State> {

    constructor(props: ProductEditOptionProps) {
        super(props)
        this.state = {
          newImages: [],
          deletedImages: [],
          option: undefined,
          priceChange: "none",
          editPriceMode: false,
          priceChangeText: "",
          imagesLoaded: false,
          infoPopupText: undefined,
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

    async refreshData() {
      const productData = await this.props.businessFuncs.getProduct(this.props.route.params.productID)
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
      this.setState({
        option: option,
        priceChange: priceChange,
        priceChangeText: option.priceChange !== null ? Math.abs(option.priceChange).toString() : "0"
      })
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
              if (this.state.option) {
                await this.props.businessFuncs.updateOption(this.props.route.params.productID, this.state.option)
              }
              this.setState({showSavePopup: false, saved: true})
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
              if (this.state.option) {
                await this.props.businessFuncs.deleteOption(this.props.route.params.productID, this.state.option)
              }
              this.setState({showDeletePopup: false, saved: true})
              this.props.navigation.goBack()
            }}
            showConfirmLoading={true}
          />
        )
      }
    }

    renderPriceChangeBox() {
      if (this.state.priceChange !== "none" && this.state.option!.priceChange !== null) {
        return (
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <Text style={{...textStyles.medium, width: "30%"}}>Amount:</Text>
            <TextInputBox
              style={{width: "70%"}}
              textProps={{
                value: this.state.editPriceMode ? this.state.priceChangeText : currencyFormatter.format(this.state.option!.priceChange),
                keyboardType: "numeric",
                onChangeText: (text) => {
                  this.setState({priceChangeText: text})
                },
                onFocus: () => this.setState({editPriceMode: true}),
                onEndEditing: (event) => {
                  const text = event.nativeEvent.text
                  let newOption = {...this.state.option} as ProductOption | undefined
                  if (newOption) {
                    let newPriceChange: number = parseFloat(text)
                    newPriceChange = isNaN(newPriceChange) ? 0 : newPriceChange
                    if (this.state.priceChange === "increase") {
                      newOption.priceChange = Math.abs(newPriceChange)
                    } else if (this.state.priceChange === "decrease") {
                      newOption.priceChange = -Math.abs(newPriceChange)
                    } else {
                      newOption.priceChange = null
                    }
                    const saved = newPriceChange === this.state.option!.priceChange ? this.state.saved : false
                    this.setState({option: newOption, editPriceMode: false, saved: saved})
                  }
                }
              }}
            />
          </View>
        )
      }
    }

    renderDeleteButton() {
      return (
        <TextButton
          text={"Delete this option"}
          buttonStyle={buttonStyles.noColor}
          textStyle={{color: "red"}}
          buttonFunc={async () => this.setState({showDeletePopup: true})}
        />
      )
    }
    // Render the UI once loading is complete
    renderUI() {
      if (this.state.option) {
        return (
          <View style={{paddingTop: defaults.textHeaderBox.height}}>
          <ScrollContainer fadeTop={false}>
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
                    const newOption = {...this.state.option} as ProductOption | undefined
                    if (newOption) {
                      newOption.name = text
                      this.setState({option: newOption, saved: false})
                    }
                  }
              }}
              avoidKeyboard={true}
            ></TextInputBox>
            <ToggleSwitch
              text={"Enable quantity"}
              style={{marginBottom: 0}}
              switchProps={{
                value: this.state.option?.allowQuantity
              }}
              onToggle={(value) => {
                const newOption = {...this.state.option} as ProductOption | undefined
                if (newOption) {
                  newOption.allowQuantity = value
                  this.setState({option: newOption, saved: false})
                }
              }}
            >
            <IconButton
                iconSource={icons.info}
                buttonStyle={{width: "8%"}}
              />
            </ToggleSwitch>
            <View style={{width: styleValues.winWidth, paddingHorizontal: styleValues.mediumPadding}}>
              <Text style={textStyles.mediumHeader}>Price Change</Text>
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
                    let newOption = {...this.state.option} as ProductOption | undefined
                    if (newOption?.priceChange) {
                      newOption.priceChange = Math.abs(newOption.priceChange)
                      this.setState({option: newOption, saved: false, priceChange: "increase"})
                    }
                  }}
                ></TextButton>
                <View style={{width: styleValues.mediumPadding}}/>
                <TextButton
                  text={"Decrease"}
                  buttonStyle={styles.priceButton}
                  appearance={this.state.priceChange === "decrease" ? "color" : "no-color"}
                  buttonFunc={() => {
                    let newOption = {...this.state.option} as ProductOption | undefined
                    if (newOption?.priceChange) {
                      newOption.priceChange = -Math.abs(newOption.priceChange)
                      this.setState({option: newOption, saved: false, priceChange: "decrease"})
                    }
                  }}
                ></TextButton>
                <View style={{width: styleValues.mediumPadding}}/>
                <TextButton
                  text={"None"}
                  buttonStyle={styles.priceButton}
                  appearance={this.state.priceChange === "none" ? "color" : "no-color"}
                  buttonFunc={() => {
                    let newOption = {...this.state.option} as ProductOption | undefined
                    if (newOption) {
                      newOption.priceChange = 0
                      this.setState({option: newOption, saved: false, priceChange: "none"})
                    }
                  }}
                ></TextButton>
              </View>
              {/* Price change */}
              {this.renderPriceChangeBox()}
            </View>
            {this.renderDeleteButton()}
          </ScrollContainer>
          <TextHeader>{`${this.props.route.params.optionType}: ${this.state.option.name}`}</TextHeader>
          </View>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoading() {
      if (this.state.option === undefined || !this.state.imagesLoaded) {
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
            {iconSource: icons.chevron, buttonFunc: () => {
              if (!this.state.saved) {
                this.setState({showSavePopup: true})
              } else {
                this.props.navigation.goBack()
              }
            }},
            {iconSource: icons.checkBox, showLoading: true, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: async () => {
              if (this.state.option && !this.state.saved) {
                await this.props.businessFuncs.updateOption(this.props.route.params.productID, this.state.option)
                this.setState({saved: true})
              }
            }}
          ]}
        ></MenuBar>
        {this.renderInfoPopup()}
        {this.renderSavePopup()}
        {this.renderDeletePopup()}
      </PageContainer>
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