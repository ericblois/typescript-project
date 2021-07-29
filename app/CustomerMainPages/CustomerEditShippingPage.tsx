import React, { Component } from "react";
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
import ItemList from "../CustomComponents/ItemList";

type CustomerEditShippingNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerMainStackParamList, "editShipping">,
  StackNavigationProp<RootStackParamList>
>

type CustomerEditShippingRouteProp = RouteProp<CustomerMainStackParamList, "editShipping">;

type CustomerEditShippingProps = {
    navigation: CustomerEditShippingNavigationProp,
    route: CustomerEditShippingRouteProp
}

type CustomerEditShippingState = {
    userData?: UserData,
    addresses?: ShippingInfo[],
    saved: boolean
}

export default class CustomerEditShippingPage extends Component<CustomerEditShippingProps, CustomerEditShippingState> {

  constructor(props: CustomerEditShippingProps) {
    super(props)
    this.state = {
      userData: undefined,
      addresses: undefined,
      saved: true
    }
    this.props.navigation.addListener("focus", (event) => this.refreshData())
    this.refreshData()
  }

  async refreshData() {
    const userData = await UserFunctions.getUserDoc()
    this.setState({userData: userData, addresses: userData.shippingAddresses})
  }

  renderCreateAddressButton() {
    if (this.state.userData) {
      return (
        <TextButton
          text={"Add a new shipping address"}
          buttonStyle={{...buttonStyles.noColor, ...{justifyContent: "space-between"}}}
          rightIconSource={icons.plus}
          buttonFunc={() => {
            this.props.navigation.navigate("editAddress", {
              shippingInfo: DefaultShippingInfo,
              addressIndex: this.state.userData!.shippingAddresses.length
            })
          }}
        />
      )
    }
  }

  renderAddressButtons() {
    if (this.state.addresses) {
      return (
        <View>
          <Text
            style={{...textStyles.medium, ...{alignSelf: "flex-start"}}}
          >Default address:</Text>
          <ItemList
            data={this.state.addresses}
            keyExtractor={(_, index) => (index.toString())}
            renderItem={(itemParams) => {
              const item = itemParams.item
              let buttonText = item.streetAddress
              if (item.apartment) {
                buttonText = buttonText.concat(`, Apt. ${item.apartment}`)
              }
              return (
                <TextButton
                  text={buttonText}
                  subtext={`${item.name}, ${item.postalCode}`}
                  buttonStyle={{
                    width: "100%",
                    height: undefined,
                    borderColor: itemParams.index! === 0 ? colors.mainColor : colors.grayColor
                  }}
                  textStyle={{alignSelf: "flex-start"}}
                  subtextStyle={{alignSelf: "flex-start"}}
                  rightIconSource={icons.chevron}
                  rightIconStyle={{transform: [{scaleX: -1}], maxHeight: "50%"}}
                  buttonFunc={() => this.props.navigation.navigate("editAddress", {addressIndex: itemParams.index!, shippingInfo: itemParams.item})}
                  touchableProps={{
                    onLongPress: itemParams.drag
                  }}
                />
              )
            }}
            onDragEnd={(dragParams) => {
              this.setState({addresses: dragParams.data, saved: false})
            }}
            contentContainerStyle={{width: styleValues.winWidth - styleValues.mediumPadding*2}}
          />
        </View>
      )
    }
  }

  render() {
    return (
      <PageContainer>
        <Text
          style={textStyles.large}
        >
          Shipping info
        </Text>
        {this.renderCreateAddressButton()}
        {this.renderAddressButtons()}
        <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => this.props.navigation.goBack()},
                {iconSource: icons.checkBox, buttonFunc: async () => {
                    if (this.state.addresses) {
                        await UserFunctions.updateUserDoc({
                            shippingAddresses: this.state.addresses
                        })
                    }
                    this.setState({saved: true})
                }, iconStyle: {
                    tintColor: this.state.saved ? colors.validColor : colors.invalidColor
                }
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