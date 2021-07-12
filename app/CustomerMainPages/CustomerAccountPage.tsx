import React, { Component } from "react";
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { CustomerTabParamList, CustomerMainStackParamList, RootStackParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import UserFunctions from "../HelperFiles/UserFunctions";
import { StackNavigationProp } from "@react-navigation/stack";
import PageContainer from "../CustomComponents/PageContainer";
import { ScrollView } from "react-native-gesture-handler";

type CustomerAccountNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerTabParamList, "account">,
  StackNavigationProp<RootStackParamList>
>

type CustomerAccountRouteProp = RouteProp<CustomerTabParamList, "account">;

type CustomerAccountProps = {
    navigation: CustomerAccountNavigationProp,
    route: CustomerAccountRouteProp
}

type CustomerAccountState = {
  businessButtons: JSX.Element[]
}

export default class CustomerAccountPage extends Component<CustomerAccountProps, CustomerAccountState> {

  constructor(props: CustomerAccountProps) {
    super(props)
    this.state = {
      businessButtons: []
    }
    this.props.navigation.addListener("focus", (event) => {
      this.getBusinesses()
    })
    this.getBusinesses()
  }

  async getBusinesses() {
    const userData = await UserFunctions.getUserDoc()
    const buttons = await Promise.all(userData.businessIDs.map(async (businessID, index) => {
      const businessFuncs = new BusinessFunctions(businessID)
      const businessName = (await businessFuncs.getPublicData()).name
      return (
        <TextButton
          text={businessName ? businessName : "Unnamed business"}
          subtext={businessID}
          buttonStyle={defaults.textButtonNoColor}
          buttonFunc={() => {
            this.props.navigation.navigate("businessMain", {businessFuncs: businessFuncs})
          }}
          key={index.toString()}
        />
      )
    }))
    this.setState({businessButtons: buttons})
  }

  renderCreateBusinessButton() {
    return (
      <TextButton
        text={"Create a new business"}
        buttonStyle={{...defaults.textButtonNoColor, ...{justifyContent: "space-between"}}}
        rightIconSource={icons.plus}
        buttonFunc={async () => {
          // Create a new business
          const businessID = await UserFunctions.createNewBusiness()
          const businessFuncs = new BusinessFunctions(businessID)
          this.props.navigation.navigate("businessMain", {businessFuncs: businessFuncs})
        }}
      />
    )
  }

  renderDeleteAccountButton() {
    return (
      <TextButton
        text={"Delete this account"}
        buttonStyle={defaults.textButtonNoColor}
        textStyle={{color: "red"}}
        buttonFunc={() => {
          UserFunctions.deleteAccount().then(() => {
            this.props.navigation.navigate("start")
          })
        }}
      />
    )
  }

  render() {
    return (
      <PageContainer>
        <Text
          style={{
            fontSize: styleValues.largeTextSize
          }}
        >
          Your Account
        </Text>
        <TextButton
          text={"Sign Out"}
          buttonFunc={() => {
            auth.signOut().then(() => this.props.navigation.navigate("start"));
          }}
        ></TextButton>
        <Text
          style={{
            fontSize: styleValues.largeTextSize
          }}
        >
          Businesses
        </Text>
        {this.state.businessButtons}
        {this.renderCreateBusinessButton()}
        {this.renderDeleteAccountButton()}
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