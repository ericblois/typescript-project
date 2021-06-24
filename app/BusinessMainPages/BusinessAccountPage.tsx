import React, { Component } from "react";
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { MenuBar } from "../HelperFiles/CompIndex";
import { BusinessMainStackParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from '@react-navigation/native';

type BusinessAccountNavigationProp = BottomTabNavigationProp<BusinessMainStackParamList, "account">;

type BusinessAccountRouteProp = RouteProp<BusinessMainStackParamList, "account">;

type BusinessAccountProps = {
    navigation: BusinessAccountNavigationProp,
    route: BusinessAccountRouteProp
}

type BusinessAccountState = {
}

export default class BusinessAccountPage extends Component<BusinessAccountProps, BusinessAccountState> {

  render() {
    return (
      <View style={defaults.pageContainer}>
        <Text>account</Text>
        <TextButton
          text={"Sign Out"}
          textStyle={styles.signout}
          buttonFunc={() => {
            auth.signOut().then(() => this.props.navigation.dangerouslyGetParent()?.navigate("start"));
          }}
        />
        <TextButton
          text={"Go to business"}
          textStyle={styles.signout}
          buttonFunc={() => {
            this.props.navigation.dangerouslyGetParent()?.navigate("businessMain")
          }}
        />
        <MenuBar
          //buttonProps={this.state.inEditMode ? this.getEditButtons(props) : this.getMainButtons(props)}
          buttonProps={[
            {iconSource: icons.store, buttonFunc: () => {this.props.navigation.navigate("businessEdit")},},
            {iconSource: icons.profile, buttonFunc: () => {this.props.navigation.navigate("account")}}
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signout: {
    color: "red",
    fontSize: styleValues.largeTextSize,
  }
})