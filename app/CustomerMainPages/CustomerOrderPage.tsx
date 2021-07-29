import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { CustomerMainStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { OrderData, PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { FlatList } from "react-native-gesture-handler";
import { PageContainer, ScrollContainer, ProductCardList, MenuBar, TextButton, ItemList } from "../HelperFiles/CompIndex"
import { currencyFormatter } from "../HelperFiles/Constants";

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

export default class CustomerOrderPage extends Component<Props, State> {

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

  renderOrderInfo() {
      if (this.state.businessData) {
        const imgSrc = this.state.businessData.profileImage === "" ? icons.store : {uri: this.state.businessData.profileImage}
        return (
            <ScrollContainer style={{width: styleValues.winWidth}}>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        borderBottomWidth: styleValues.minorBorderWidth,
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
                    >{`Status: ${this.state.orderData.status}`}</Text>
                    <Text
                        style={textStyles.medium}
                    >{currencyFormatter.format(this.state.orderData.totalPrice)}</Text>
                </View>
                <ProductCardList
                    products={this.state.orderData.cartItems}
                    editable={false}
                    scrollable={false}
                    onLoadEnd={() => this.setState({productImagesLoaded: true})}
                />
                <TextButton
                    text={"Cancel order"}
                    buttonStyle={{...buttonStyles.noColor, ...{
                        marginBottom: 0,
                        marginTop: styleValues.mediumPadding
                    }}}
                    textStyle={{color: colors.invalidColor}}
                />
            </ScrollContainer>
        )
      }
  }

  renderLoading() {
      if (!this.state.businessData || !this.state.profileImageLoaded || ! this.state.productImagesLoaded) {
          return (
            <View style={{
                position: "absolute",
                top: 0,
                bottom: defaults.tabBarLightColor.height + styleValues.mediumPadding*2,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.whiteColor
            }}>
                <ActivityIndicator size={"large"}/>
            </View>
          )
      }
  }

  render() {
    return (
        <PageContainer>
            <Text style={textStyles.larger}>Your Order</Text>
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