import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth, currencyFormatter, iconButtonTemplates } from "../HelperFiles/Constants";
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
    priceChangeType: "increase" | "decrease" | "none",
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
          option: undefined,
          priceChangeType: "none",
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
      console.log(this.props.route.params)
  }

    async refreshData() {
      const option = await this.props.businessFuncs.getOption(
        this.props.route.params.productID,
        this.props.route.params.optionTypeName,
        this.props.route.params.optionName
      )
      let priceChangeType: State["priceChangeType"] = "none"
      if (option.priceChange !== 0) {
        priceChangeType = option.priceChange < 0 ? "decrease" : "increase"
      }
      this.setState({
        option: option,
        priceChangeType: priceChangeType,
        priceChangeText: Math.abs(option.priceChange).toString()
      })
    }

    updateOption(option: Partial<ProductOption>, stateUpdates?: Partial<State>, callback?: () => void) {
      let newOption = {...this.state.option} as ProductOption | undefined
      if (newOption) {
        newOption = {
          ...newOption,
          ...option
        }
        let stateUpdate: Partial<State> = {
          ...stateUpdates,
          option: newOption,
          saved: false
        }
        this.setState(stateUpdate, callback)
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
              this.setState({saved: true, showSavePopup: false}, () => {
                this.props.navigation.goBack()
              })
            }}
            onConfirm={async () => {
              if (this.state.option) {
                await this.props.businessFuncs.updateOption(this.props.route.params.productID, this.state.option)
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
              if (this.state.option) {
                await this.props.businessFuncs.deleteOption(this.props.route.params.productID, this.state.option)
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

    renderPriceChangeBox() {
      if (this.state.priceChangeType !== "none") {
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
                  let newPriceChange: number = parseFloat(text)
                  newPriceChange = isNaN(newPriceChange) ? 0 : newPriceChange
                  if (this.state.priceChangeType === "increase") {
                    newPriceChange = Math.abs(newPriceChange)
                  } else if (this.state.priceChangeType === "decrease") {
                    newPriceChange = -Math.abs(newPriceChange)
                  }
                  this.updateOption({priceChange: newPriceChange}, {editPriceMode: false})
                }
              }}
            ></TextInputBox>
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
              onChange={(uris) => this.updateOption({images: uris.all})}
              onImagesLoaded={() => {
                this.setState({imagesLoaded: true})
              }}
            />
            {/* Name */}
            <TextInputBox
              textProps={{
                  defaultValue: this.state.option?.name,
                  placeholder: "Option name",
                  onChangeText: (text) => this.updateOption({name: text})
              }}
              avoidKeyboard={true}
            ></TextInputBox>
            <ToggleSwitch
              text={"Enable quantity"}
              style={{marginBottom: 0}}
              switchProps={{
                value: this.state.option?.allowQuantity
              }}
              onToggle={(value) => this.updateOption({allowQuantity: value})}
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
                  appearance={this.state.priceChangeType === "increase" ? "color" : "no-color"}
                  buttonFunc={() => {
                    let newOption = {...this.state.option} as ProductOption | undefined
                    if (newOption) {
                      this.updateOption({priceChange: Math.abs(newOption.priceChange)}, {priceChangeType: "increase"})
                    }
                  }}
                ></TextButton>
                <View style={{width: styleValues.mediumPadding}}/>
                <TextButton
                  text={"Decrease"}
                  buttonStyle={styles.priceButton}
                  appearance={this.state.priceChangeType === "decrease" ? "color" : "no-color"}
                  buttonFunc={() => {
                    let newOption = {...this.state.option} as ProductOption | undefined
                    if (newOption) {
                      this.updateOption({priceChange: -Math.abs(newOption.priceChange)}, {priceChangeType: "decrease"})
                    }
                  }}
                ></TextButton>
                <View style={{width: styleValues.mediumPadding}}/>
                <TextButton
                  text={"None"}
                  buttonStyle={styles.priceButton}
                  appearance={this.state.priceChangeType === "none" ? "color" : "no-color"}
                  buttonFunc={() => this.updateOption({priceChange: 0}, {priceChangeType: "none"})}
                ></TextButton>
              </View>
              {/* Price change */}
              {this.renderPriceChangeBox()}
            </View>
            {this.renderDeleteButton()}
          </ScrollContainer>
          <TextHeader>{`${this.props.route.params.optionTypeName}: ${this.state.option.name}`}</TextHeader>
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
                if (this.state.option && !this.state.saved) {
                  await this.props.businessFuncs.updateOption(this.props.route.params.productID, this.state.option)
                  this.setState({saved: true})
                }
              }
            }
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