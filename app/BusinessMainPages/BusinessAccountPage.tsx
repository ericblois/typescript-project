import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { MenuBar, PageContainer } from "../HelperFiles/CompIndex";
import { BusinessMainStackParamList, RootStackParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";

type BusinessAccountNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BusinessMainStackParamList, "account">,
  StackNavigationProp<RootStackParamList>
>

type BusinessAccountRouteProp = RouteProp<BusinessMainStackParamList, "account">;

type BusinessAccountProps = {
    navigation: BusinessAccountNavigationProp,
    route: BusinessAccountRouteProp,
    businessFuncs: BusinessFunctions
}

type BusinessAccountState = {
}

export default class BusinessAccountPage extends CustomComponent<BusinessAccountProps, BusinessAccountState> {

  render() {
    return (
      <PageContainer>
        <Text>account</Text>
        <TextButton
          text={"Sign Out"}
          textStyle={styles.signout}
          buttonFunc={() => {
            auth.signOut().then(() => this.props.navigation.navigate("start"));
          }}
        />
        <TextButton
          text={"Go to customer screen"}
          textStyle={styles.signout}
          buttonFunc={() => {
            this.props.navigation.navigate("customerMain")
          }}
        />
        <MenuBar
            buttonProps={[
                {
                  iconSource: icons.store,
                  buttonFunc: () => {this.props.navigation.navigate("businessEdit")},
                },
                {
                    iconSource: icons.document,
                    buttonFunc: () => {this.props.navigation.navigate("orders")},
                },
                {
                  iconSource: icons.profile,
                  buttonFunc: () => {this.props.navigation.navigate("account")},
                  iconStyle: {tintColor: colors.mainColor}
                },
            ]}
        />
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({
  signout: {
    color: "red",
    fontSize: styleValues.largeTextSize,
  }
})