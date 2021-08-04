import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
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
import LoadingCover from "../CustomComponents/LoadingCover";

type CustomerAccountNavigationProp = CompositeNavigationProp<
  CompositeNavigationProp<
    BottomTabNavigationProp<CustomerTabParamList, "account">,
    StackNavigationProp<CustomerMainStackParamList>
  >,
  StackNavigationProp<RootStackParamList>
>

type CustomerAccountRouteProp = RouteProp<CustomerTabParamList, "account">;

type CustomerAccountProps = {
    navigation: CustomerAccountNavigationProp,
    route: CustomerAccountRouteProp
}

type CustomerAccountState = {
  businessButtons: JSX.Element[],
  createBusinessLoading: boolean
}

export default class CustomerAccountPage extends CustomComponent<CustomerAccountProps, CustomerAccountState> {

  constructor(props: CustomerAccountProps) {
    super(props)
    this.state = {
      businessButtons: [],
      createBusinessLoading: false
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
          buttonStyle={buttonStyles.noColor}
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
      <View 
        style={{
          width: "100%",
          height: buttonStyles.noColor.height,
          marginBottom: styleValues.mediumPadding
        }}
      >
        <TextButton
          text={"Create a new business"}
          buttonStyle={{justifyContent: "space-between"}}
          rightIconSource={icons.plus}
          buttonFunc={async () => {
            this.setState({createBusinessLoading: true})
            // Create a new business
            const businessID = await UserFunctions.createNewBusiness()
            const businessFuncs = new BusinessFunctions(businessID)
            this.setState({createBusinessLoading: false})
            this.props.navigation.navigate("businessMain", {businessFuncs: businessFuncs})
          }}
        />
        {this.state.createBusinessLoading ? <LoadingCover/> : undefined}
      </View>
    )
  }

  renderEditAddressesButton() {
    return (
      <TextButton
        text={"Edit shipping info"}
        buttonStyle={{justifyContent: "space-between"}}
        rightIconSource={icons.chevron}
        rightIconStyle={{transform: [{scaleX: -1}]}}
        buttonFunc={() => this.props.navigation.navigate("editShipping")}
      />
    )
  }

  renderDeleteAccountButton() {
    return (
      <TextButton
        text={"Delete this account"}
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
          style={textStyles.largerHeader}
        >
          Your Account
        </Text>
        <TextButton
          text={"Sign Out"}
          buttonFunc={() => {
            auth.signOut().then(() => this.props.navigation.navigate("start"));
          }}
          buttonStyle={{marginBottom: 0}}
        ></TextButton>
        <Text
          style={textStyles.largeHeader}
        >
          Businesses
        </Text>
        {this.state.businessButtons}
        {this.renderCreateBusinessButton()}
        {this.renderEditAddressesButton()}
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