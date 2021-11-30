import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { CustomerMainStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { OrderData, PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { FlatList } from "react-native-gesture-handler";
import { PageContainer, ScrollContainer, CardCartList, MenuBar, TextButton, ItemList, LoadingCover } from "../HelperFiles/CompIndex"
import { currencyFormatter } from "../HelperFiles/Constants";
import { capitalizeWords } from "../HelperFiles/ClientFunctions";

type CustomerOrderNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CustomerMainStackParamList, "order">,
  StackNavigationProp<CustomerMainStackParamList>
>

type CustomerOrderRouteProp = RouteProp<CustomerMainStackParamList, "order">;

type Props = {
  navigation: CustomerOrderNavigationProp,
  route: CustomerOrderRouteProp
}

type State = {
    orderData: OrderData,
    businessData?: PublicBusinessData,
    profileImageLoaded: boolean,
    productImagesLoaded: boolean
}

export default class CustomerOrderPage extends CustomComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      orderData: props.route.params.orderData,
      businessData: undefined,
      profileImageLoaded: false,
      productImagesLoaded: false
    }
    props.navigation.addListener("focus", () => this.refreshData())
    this.refreshData()
  }

  async refreshData() {
    const newOrderData = await CustomerFunctions.getOrder(this.state.orderData.orderID)
    const publicData = await CustomerFunctions.getPublicBusinessData(this.state.orderData.businessID)
    this.setState({orderData: newOrderData, businessData: publicData})
  }

  renderExtraCostsCard() {
      return (
          <View style={{
              ...defaults.roundedBox,
              ...defaults.smallShadow,
              height: undefined,
          }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: styleValues.minorPadding,
                }}>
                    <Text style={textStyles.medium}>{"Tax:"}</Text>
                    <Text style={textStyles.medium}>{currencyFormatter.format(this.state.orderData.totalPrice - this.state.orderData.subtotalPrice)}</Text>
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%"
                }}>
                    <Text style={textStyles.medium}>{"Shipping/Delivery:"}</Text>
                    <Text style={textStyles.medium}>{currencyFormatter.format(this.state.orderData.deliveryPrice)}</Text>
                </View>
          </View>
      )
  }

  renderOrderInfo() {
      if (this.state.businessData) {
        const imgSrc = this.state.businessData.profileImage === "" ? icons.store : {uri: this.state.businessData.profileImage}
        return (
            <ScrollContainer
                containerStyle={{width: "100%"}}
            >
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        borderBottomWidth: styleValues.minorBorderWidth,
                        paddingBottom: styleValues.mediumPadding,
                        borderColor: colors.lightGrayColor,
                    }}
                >
                    <Image
                        source={imgSrc}
                        style={{...styles.profileImage, ...{
                            tintColor: this.state.businessData.profileImage === "" ? colors.lighterGrayColor : undefined,
                            marginRight: styleValues.mediumPadding,
                        }}}
                        onLoadEnd={() => {
                            this.setState({profileImageLoaded: true})
                        }}
                        resizeMethod={"scale"}
                        resizeMode={this.state.businessData.profileImage === "" ? "contain" : "cover"}
                    />
                    <View style={{alignItems: "flex-start"}}>
                        <Text style={textStyles.large}>{this.state.businessData.name}</Text>
                        <Text style={{...textStyles.medium, ...{color: colors.grayColor}}}>{`Order ID: #${this.state.orderData.orderID}`}</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        borderBottomWidth: styleValues.minorBorderWidth,
                        borderColor: colors.lightGrayColor,
                        paddingVertical: styleValues.mediumPadding,
                        justifyContent: "space-between"
                    }}
                >
                    <Text
                        style={textStyles.medium}
                    >{`Status: ${capitalizeWords(this.state.orderData.status)}`}</Text>
                    <Text
                        style={textStyles.medium}
                    >{currencyFormatter.format(this.state.orderData.totalPrice)}</Text>
                </View>
                <CardCartList
                    products={this.state.orderData.cartItems}
                    editable={false}
                    scrollable={false}
                    onLoadEnd={() => this.setState({productImagesLoaded: true})}
                />
                {this.renderExtraCostsCard()}
                <TextButton
                    text={"Cancel order"}
                    buttonStyle={{...buttonStyles.noColor, ...{
                        marginBottom: 0,
                    }}}
                    textStyle={{color: colors.invalidColor}}
                    buttonFunc={async () => {
                        await CustomerFunctions.cancelOrder(this.state.orderData.orderID, this.state.orderData.businessID)
                        this.props.navigation.goBack()
                    }}
                    showLoading={true}
                />
            </ScrollContainer>
        )
      }
  }

  renderLoading() {
      if (!this.state.businessData || !this.state.profileImageLoaded || ! this.state.productImagesLoaded) {
          return (
            <LoadingCover size={"large"}/>
          )
      }
  }

  render() {
    return (
        <PageContainer>
            <Text style={textStyles.largerHeader}>Your Order</Text>
            {this.renderOrderInfo()}
            {this.renderLoading()}
            <MenuBar
                buttonProps={[
                    {iconSource: icons.chevron, buttonFunc: () => this.props.navigation.goBack()},
                ]}
            />
        </PageContainer>
    );
  }
}

const styles = StyleSheet.create({
    profileImage: {
        width: styleValues.winWidth * 0.15,
        aspectRatio: 1,
        borderRadius: styleValues.minorPadding,
        marginRight: styleValues.minorPadding
    },
})