import React, { Component } from "react";
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { DefaultProductOption, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { GradientView, ImageSliderSelector, MapPopup, MenuBar, PageContainer, TextInputPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';
import UserFunctions from "../HelperFiles/UserFunctions";

type ProductEditOptionTypeNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editOptionType">;

type ProductEditOptionTypeRouteProp = RouteProp<BusinessMainStackParamList, "editOptionType">;

type ProductEditOptionTypeProps = {
    navigation: ProductEditOptionTypeNavigationProp,
    route: ProductEditOptionTypeRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    productData?: ProductData,
    optionType?: ProductOptionType,
    showPopup: boolean,
    saved: boolean
}

export default class ProductEditOptionTypePage extends Component<ProductEditOptionTypeProps, State> {

    constructor(props: ProductEditOptionTypeProps) {
        super(props)
        this.state = {
          productData: undefined,
          optionType: undefined,
          showPopup: false,
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

    renderTextPopup() {
      if (this.state.showPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showPopup: false})}}
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
                        showPopup: false,
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

    renderDeleteButton() {
        return (
          <TextButton
            text={"Delete this option type"}
            buttonStyle={buttonStyles.noColor}
            textStyle={{color: "red"}}
            buttonFunc={async () => {
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
                    this.props.navigation.goBack()
                }
            }}
          />
        )
    }
    // Render the UI once loading is complete
    renderUI() {
      if (this.state.optionType) {
      return (
        <PageContainer>
            <Text
            style={textStyles.large}
            >
            {this.props.route.params.productName.concat(": ").concat(this.props.route.params.optionType)}
            </Text>
            <View style={{flex: 1}}>
              <DraggableFlatList
              containerStyle={styles.list}
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
              ListHeaderComponent={() => (<View style={{height: styleValues.mediumPadding}}/>)}
              ListFooterComponent={() => this.renderDeleteButton()}
              />
              <GradientView/>
            </View>
            <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                {iconSource: icons.plus, buttonFunc: () => {this.setState({showPopup: true})}},
                {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: () => {
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
            />
            {this.renderTextPopup()}
        </PageContainer>
      )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoadScreen() {
      if (this.state.optionType === undefined) {
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
    list: {
      width: "100%",
    },
})