import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList, RootStackParamList } from "../HelperFiles/Navigation"
import { ImageProfileSelector, TextButton, MenuBar, PageContainer, LoadingCover, TextHeader } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import UserFunctions from "../HelperFiles/UserFunctions";
import { PublicBusinessData } from "../HelperFiles/DataTypes";

type BusinessEditMainNavigationProp = CompositeNavigationProp<
  CompositeNavigationProp<
    StackNavigationProp<BusinessEditStackParamList, "editMain">,
    StackNavigationProp<BusinessMainStackParamList>
  >,
  StackNavigationProp<RootStackParamList>
>

type BusinessEditMainRouteProp = RouteProp<BusinessEditStackParamList, "editMain">;

type BusinessEditMainProps = {
    navigation: BusinessEditMainNavigationProp,
    route: BusinessEditMainRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
  publicData?: PublicBusinessData
}

export default class BusinessEditMainPage extends CustomComponent<BusinessEditMainProps, State> {

  constructor(props: BusinessEditMainProps) {
    super(props)
    this.state = {
      publicData: undefined
    }
    props.navigation.addListener("focus", () => this.refreshData())
    this.refreshData()
  }

  async refreshData() {
    const newPublicData = await this.props.businessFuncs.getPublicData()
    this.setState({publicData: newPublicData})
  }

  renderUI() {
    if (this.state.publicData) {
      const infoValid = this.props.businessFuncs.checkInfoValidity(this.state.publicData)
      const productsValid = this.props.businessFuncs.checkProductsValidity(this.state.publicData)
      const locationValid = this.props.businessFuncs.checkLocationValidity(this.state.publicData)
      return (
        <View
          style={{
            width: "100%",
            paddingTop: defaults.textHeaderBox.height + styleValues.mediumPadding,
            alignItems: "center"
          }}
        >
          <ImageProfileSelector
          ></ImageProfileSelector>
          <TextButton
              text={"Edit your info page"}
              buttonStyle={buttonStyles.noColor}
              leftIconSource={infoValid ? icons.checkBox : icons.cross}
              leftIconStyle={{
                tintColor: infoValid ? colors.validColor : colors.invalidColor
              }}
              rightIconSource={icons.chevron}
              rightIconStyle={{transform: [{scaleX: -1}]}}
              buttonFunc={() => {
                  this.props.navigation.navigate("editInfo")
              }}
          ></TextButton>
          <TextButton
              text={"Edit your products / services"}
              buttonStyle={buttonStyles.noColor}
              textStyle={{fontSize: styleValues.smallTextSize}}
              leftIconSource={productsValid ? icons.checkBox : icons.cross}
              leftIconStyle={{
                tintColor: productsValid ? colors.validColor : colors.invalidColor
              }}
              rightIconSource={icons.chevron}
              rightIconStyle={{transform: [{scaleX: -1}]}}
              buttonFunc={() => {
                this.props.navigation.navigate("editProductList")
            }}
          ></TextButton>
          <TextButton
              text={"Location & delivery options"}
              buttonStyle={buttonStyles.noColor}
              textStyle={{fontSize: styleValues.smallTextSize}}
              leftIconSource={locationValid ? icons.checkBox : icons.cross}
              leftIconStyle={{
                tintColor: locationValid ? colors.validColor : colors.invalidColor
              }}
              rightIconSource={icons.chevron}
              rightIconStyle={{transform: [{scaleX: -1}]}}
              buttonFunc={() => {
                this.props.navigation.navigate("editLocation")
              }}
          ></TextButton>
          <TextButton
              text={"Delete this business"}
              buttonStyle={buttonStyles.noColor}
              textStyle={{fontSize: styleValues.smallTextSize, color: "red"}}
              buttonFunc={async () => {
                await UserFunctions.deleteBusiness(this.props.businessFuncs.businessID)
                this.props.navigation.navigate("customerMain")
              }}
              showLoading={true}
          ></TextButton>
          <TextHeader>Your Business Page</TextHeader>
        </View>
      );
    }
  }

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
                iconSource: icons.store,
                buttonFunc: () => {this.props.navigation.navigate("businessEdit")},
                iconStyle: {tintColor: colors.mainColor}
              },
              {
                  iconSource: icons.document,
                  buttonFunc: () => {this.props.navigation.navigate("orders")},
              },
              {
                iconSource: icons.profile,
                buttonFunc: () => {this.props.navigation.navigate("account")}
              },
          ]}
        />
      </PageContainer>
    )
  }
}

const styles = StyleSheet.create({
})