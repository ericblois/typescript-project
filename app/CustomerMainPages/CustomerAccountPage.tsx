import React, { Component } from "react";
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { CustomerMainTabParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from '@react-navigation/native';

type CustomerAccountNavigationProp = BottomTabNavigationProp<CustomerMainTabParamList, "account">;

type CustomerAccountRouteProp = RouteProp<CustomerMainTabParamList, "account">;

type CustomerAccountProps = {
    navigation: CustomerAccountNavigationProp,
    route: CustomerAccountRouteProp
}

type CustomerAccountState = {
}

export default class CustomerAccountPage extends Component<CustomerAccountProps, CustomerAccountState> {

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