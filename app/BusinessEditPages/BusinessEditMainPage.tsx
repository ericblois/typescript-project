import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList, RootStackParamList } from "../HelperFiles/Navigation"
import { ImageProfileSelector, TextButton, MenuBar, PageContainer } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import UserFunctions from "../HelperFiles/UserFunctions";

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
}

export default class BusinessEditMainPage extends CustomComponent<BusinessEditMainProps, State> {

  render() {
    return (
      <PageContainer>
        <Text style={{...textStyles.large, ...{marginBottom: styleValues.mediumPadding}}}>Your Business Page</Text>
        <ImageProfileSelector></ImageProfileSelector>
        <TextButton
            text={"Edit your info page"}
            buttonStyle={buttonStyles.noColor}
            textStyle={{}}
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
            buttonFunc={() => {
              UserFunctions.deleteBusiness(this.props.businessFuncs.businessID).then(() => {
                this.props.navigation.navigate("customerMain")
              })
            }}
        ></TextButton>
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
    );
  }
}

const styles = StyleSheet.create({
})