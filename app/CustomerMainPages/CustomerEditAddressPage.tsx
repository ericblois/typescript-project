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
import { DefaultShippingInfo, ShippingInfo, UserData } from "../HelperFiles/DataTypes";
import MenuBar from "../CustomComponents/MenuBar";
import TextInputBox from "../CustomComponents/TextInputBox";
import { onChange } from "react-native-reanimated";
import ScrollContainer from "../CustomComponents/ScrollContainer";

type CustomerEditAddressNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerMainStackParamList, "editAddress">,
  StackNavigationProp<RootStackParamList>
>

type CustomerEditAddressRouteProp = RouteProp<CustomerMainStackParamList, "editAddress">;

type CustomerEditAddressProps = {
    navigation: CustomerEditAddressNavigationProp,
    route: CustomerEditAddressRouteProp
}

type CustomerEditAddressState = {
    shippingInfo: ShippingInfo,
    addressIndex: number,
    saved: boolean,
}

export default class CustomerEditAddressPage extends CustomComponent<CustomerEditAddressProps, CustomerEditAddressState> {

  constructor(props: CustomerEditAddressProps) {
    super(props)
    this.state = {
        shippingInfo: this.props.route.params.shippingInfo,
        addressIndex: props.route.params.addressIndex,
        saved: true,
    }
    this.props.navigation.addListener("focus", () => {
        this.setState({shippingInfo: props.route.params.shippingInfo})
    })
  }

  renderInputs() {
      return (
          <ScrollContainer
            style={{
              width: styleValues.winWidth
            }}
          >
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.invalidColor
                }}}
                textProps={{
                    placeholder: "First and last name",
                    value: this.state.shippingInfo.name,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.name = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                }}
            ></TextInputBox>
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.invalidColor
                }}}
                textProps={{
                    placeholder: "Street address",
                    value: this.state.shippingInfo.streetAddress,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.streetAddress = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                }}
            ></TextInputBox>
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.invalidColor
                }}}
                textProps={{
                    placeholder: "City",
                    value: this.state.shippingInfo.city,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.city = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                }}
            ></TextInputBox>
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.invalidColor
                }}}
                textProps={{
                    placeholder: "Region",
                    value: this.state.shippingInfo.region ? this.state.shippingInfo.region : undefined,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.region = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                }}
            ></TextInputBox>
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.invalidColor
                }}}
                textProps={{
                    placeholder: "Country",
                    value: this.state.shippingInfo.country,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.country = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                }}
            ></TextInputBox>
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.invalidColor
                }}}
                textProps={{
                    placeholder: "Postal code",
                    value: this.state.shippingInfo.postalCode,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.postalCode = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                }}
            ></TextInputBox>
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.validColor
                }}}
                textProps={{
                    placeholder: "Apartment / Suite no.",
                    value: this.state.shippingInfo.apartment ? this.state.shippingInfo.apartment : undefined,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.apartment = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                }}
            ></TextInputBox>
            <TextInputBox
                style={{...buttonStyles.noColor, ...{
                    borderColor: colors.validColor,
                    height: styleValues.winWidth*0.25
                }}}
                textProps={{
                    placeholder: "Optional delivery instructions",
                    value: this.state.shippingInfo.message ? this.state.shippingInfo.message : undefined,
                    onChangeText: (text) => {
                        const newShippingInfo = this.state.shippingInfo
                        newShippingInfo.message = text
                        this.setState({shippingInfo: newShippingInfo, saved: false})
                    },
                    multiline: true
                }}
            ></TextInputBox>
            <TextButton
                text={"Delete this address"}
                textStyle={{color: colors.invalidColor}}
                buttonFunc={async () => {
                    const userData = await UserFunctions.getUserDoc()
                    if (userData.shippingAddresses.length > this.state.addressIndex) {
                        let newShippingAddresses = userData.shippingAddresses
                        newShippingAddresses.splice(this.state.addressIndex, 1)
                        await UserFunctions.updateUserDoc({
                            shippingAddresses: newShippingAddresses
                        })
                    }
                    this.props.navigation.goBack()
                }}
            />
          </ScrollContainer>
      )
  }

  render() {
    return (
      <PageContainer>
        <Text
          style={{...textStyles.large, marginVertical: styleValues.mediumPadding}}
        >Edit Address</Text>
        {this.renderInputs()}
        <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => this.props.navigation.goBack()},
                {iconSource: icons.checkBox, buttonFunc: async () => {
                        if (this.state.shippingInfo) {
                            const userData = await UserFunctions.getUserDoc()
                            const newShippingInfo = this.state.shippingInfo
                            let newShippingAddresses = userData.shippingAddresses
                            if (this.state.addressIndex >= newShippingAddresses.length) {
                                newShippingAddresses.push(newShippingInfo)
                            } else {
                                newShippingAddresses[this.state.addressIndex] = newShippingInfo
                            }
                            await UserFunctions.updateUserDoc({
                                shippingAddresses: newShippingAddresses
                            })
                            this.setState({saved: true})
                        }
                    }, iconStyle: {
                        tintColor: this.state.saved ? colors.validColor : colors.invalidColor
                    }
                },
            ]}
        ></MenuBar>
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