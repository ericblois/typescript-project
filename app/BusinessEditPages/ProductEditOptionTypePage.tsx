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

    async refreshData() {
      const optionType = await this.props.businessFuncs.getOptionType(
        this.props.route.params.productID,
        this.props.route.params.optionTypeName
      )
      this.setState({optionType: optionType})
    }

    updateOptionType(optionType: Partial<ProductOptionType>, stateUpdates?: Partial<State>, callback?: () => void) {
      let newOptionType = {...this.state.optionType} as ProductOptionType | undefined
      if (newOptionType) {
        newOptionType = {
          ...newOptionType,
          ...optionType
        }
        let stateUpdate: Partial<State> = {
          ...stateUpdates,
          optionType: newOptionType,
          saved: false
        }
        this.setState(stateUpdate, callback)
      }
    }

    renderNameInput() {
      if (this.state.showNameInputPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showNameInputPopup: false})}}
            onSaveText={async (text) => {
              let newOptionType = {...this.state.optionType} as ProductOptionType | undefined
              if (newOptionType) {
                newOptionType.options.push({
                    ...DefaultProductOption,
                    name: text,
                    optionType: newOptionType.name,
                })
                this.setState({optionType: newOptionType, showNameInputPopup: false, saved: false})
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
              this.setState({saved: true, showSavePopup: false}, () => {
                this.props.navigation.goBack()
              })
            }}
            onConfirm={async () => {
              if (this.state.optionType) {
                await this.props.businessFuncs.updateOptionType(
                  this.props.route.params.productID,
                  this.state.optionType
                )
              }
              this.setState({saved: true}, () => {
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
              await this.props.businessFuncs.deleteOptionType(
                this.props.route.params.productID,
                this.props.route.params.optionTypeName
              )
              this.props.navigation.goBack()
              }
            }
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
            if (!this.state.saved && this.state.optionType) {
                await this.props.businessFuncs.updateOptionType(this.props.route.params.productID, this.state.optionType)
                this.setState({saved: true})
            }
            this.props.navigation.navigate("editOption", {
                productID: this.props.route.params.productID,
                optionTypeName: this.props.route.params.optionTypeName,
                optionName: params.item.name,
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
        <View
          style={{
            alignItems: "center",
            paddingTop: defaults.textHeaderBox.height,
          }}
        >
            <TextInputBox
            style={{width: styleValues.winWidth - 2*styleValues.mediumPadding, marginTop: styleValues.mediumPadding*2}}
              textProps={{
                  defaultValue: this.state.optionType.name,
                  placeholder: "Option type name",
                  onChangeText: (text) => this.updateOptionType({name: text})
              }}
              avoidKeyboard={true}
            ></TextInputBox>
            <ToggleSwitch
              text={"Optional"}
              style={{width: styleValues.winWidth - styleValues.mediumPadding*2}}
              textStyle={textStyles.small}
              switchProps={{
                value: this.state.optionType.optional
              }}
              onToggle={(value) => {
                const newOptionType = {...this.state.optionType} as ProductOptionType | undefined
                if (newOptionType) {
                  newOptionType.optional = value
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
              switchProps={{
                value: this.state.optionType.allowMultiple
              }}
              onToggle={(value) => {
                const newOptionType = {...this.state.optionType} as ProductOptionType | undefined
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
                  const newOptionType = {...this.state.optionType} as ProductOptionType | undefined
                  if (newOptionType) {
                    newOptionType.options = params.data
                  }
                  this.setState({optionType: newOptionType, saved: false})
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
            >{`${this.props.route.params.productName}: ${this.state.optionType.name}`}</TextHeader>
        </View>
      )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoading() {
      if (this.state.optionType === undefined) {
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
                  if (this.state.optionType) {
                      await this.props.businessFuncs.updateOptionType(
                        this.props.route.params.productID,
                        this.state.optionType
                      )
                  }
                  this.setState({saved: true})
                }
              }
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