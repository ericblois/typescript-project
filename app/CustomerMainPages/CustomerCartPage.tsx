import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, FlatList, } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { CustomerTabParamList, CustomerMainStackParamList, RootStackParamList, BusinessShopStackParamList } from "../HelperFiles/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import UserFunctions from "../HelperFiles/UserFunctions";
import { StackNavigationProp } from "@react-navigation/stack";
import PageContainer from "../CustomComponents/PageContainer";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { CartItem, PublicBusinessData, ShippingInfo } from "../HelperFiles/DataTypes";
import ProductCartCard from "../CustomComponents/ProductCartCard";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import ProductCardList from "../CustomComponents/ProductCardList";
import MenuBar from "../CustomComponents/MenuBar";
import TextDropdown from "../CustomComponents/TextDropdown";
import ScrollContainer from "../CustomComponents/ScrollContainer";
import LoadingCover from "../CustomComponents/LoadingCover";

type CustomerCartNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CustomerMainStackParamList, "cart">,
  StackNavigationProp<RootStackParamList>
>

type CustomerCartRouteProp = RouteProp<CustomerMainStackParamList, "cart">;

type CustomerCartProps = {
    navigation: CustomerCartNavigationProp,
    route: CustomerCartRouteProp,
}

type CustomerCartState = {
    businessCarts?: {[businessID: string]: CartItem[]}
    businesses?: {[businessID: string]: PublicBusinessData}
    cartsLoading: number
}

export default class CustomerCartPage extends CustomComponent<CustomerCartProps, CustomerCartState> {

  constructor(props: CustomerCartProps) {
    super(props)
    this.state = {
        businessCarts: undefined,
        businesses: undefined,
        cartsLoading: 1
    }
    props.navigation.addListener("focus", () => this.refreshData())
    this.refreshData()
  }

  async refreshData() {
    await CustomerFunctions.getCart().then(async (cart) => {
        let businessCarts: {[businessID: string]: CartItem[]} = {}
        let businesses: {[businessID: string]: PublicBusinessData} = {}
        for (const cartItem of cart) {
            // Check if there is already products from this business in the cart
            if (Object.keys(businessCarts).includes(cartItem.businessID)) {
                // Add this cart item to this business' cart
                let currentCart = businessCarts[cartItem.businessID]
                currentCart.push(cartItem)
                businessCarts[cartItem.businessID] = currentCart
            } else {
                // Add a new business cart
                businessCarts[cartItem.businessID] = [cartItem]
                const publicData = await CustomerFunctions.getPublicBusinessData(cartItem.businessID)
                businesses[cartItem.businessID] = publicData
            }
        }
        this.setState({businessCarts: businessCarts, businesses: businesses, cartsLoading: Object.keys(businessCarts).length})
    }).catch((e) => {
      this.refreshData()
    })
  }

  getDeliveryItems(businessID: string) {
        let items: TextDropdown["props"]["items"] = []
        for (const [method, isOffered] of Object.entries(this.state.businesses![businessID].deliveryMethods)) {
            if (isOffered) {
                let label = ""
                switch (method) {
                    case "pickup":
                        label = "In-store pickup"
                        break
                    case "local":
                        label = "Local delivery"
                        break
                    case "country":
                        label = "Country-wide shipping"
                        break
                    case "international":
                        label = "International shipping"
                        break
                    default:
                        return undefined
                }
                items.push({label: label, value: method})
            }
        }
        return items
  }

  renderBusinessCarts() {
      if (this.state.businessCarts) {
        
          return Object.entries(this.state.businessCarts).map(([businessID, items]) => {
              return (
                <View
                    style={styles.businessContainer}
                    key={businessID}
                >
                    <TouchableWithoutFeedback
                      onPress={async () => {
                        const businessData = await CustomerFunctions.getPublicBusinessData(businessID)
                        this.props.navigation.navigate("businessShop", {businessData: businessData})
                      }}
                    >
                      <Text style={textStyles.large}>{this.state.businesses![businessID].name}</Text>
                    </TouchableWithoutFeedback>
                    <ProductCardList
                        products={items}
                        showLoading={true}
                        scrollable={false}
                        onDeleteItem={() => this.refreshData()}
                        onLoadEnd={() => this.setState({cartsLoading: this.state.cartsLoading - 1})}
                    />
                    <View
                        style={styles.checkoutBar}
                    >
                        <TextDropdown
                            items={this.getDeliveryItems(businessID)}
                            style={styles.deliveryMethod}
                            dropdownProps={{
                                placeholder: "Delivery method"
                            }}
                        />
                        <TextButton
                            text={"Checkout"}
                            buttonStyle={styles.checkoutButton}
                            appearance={"color"}
                            buttonFunc={() => {
                              const ship: ShippingInfo = {
                                city: "Anyville",
                                country: "Annation",
                                name: "Bob Ross",
                                postalCode: "B0O8I3",
                                region: "Province",
                                streetAddress: "123 Any Street",
                                apartment: null,
                                message: null
                              }
                              CustomerFunctions.placeOrder(businessID, items, ship, "local", 5)
                            }}
                        />
                    </View>
              </View>
              )
          })
      }
  }

  renderLoading() {
    if (!this.state.businessCarts || !this.state.businesses || this.state.cartsLoading > 0) {
      return (
        <LoadingCover size={"large"}/>
      )
    }
  }

  render() {
    return (
      <PageContainer>
        <Text
          style={textStyles.large}
        >Your Cart</Text>
        <ScrollContainer
          containerStyle={{width: styleValues.winWidth}}
          contentContainerStyle={{paddingBottom: menuBarHeight + styleValues.mediumPadding}}
        >
          {this.renderBusinessCarts()}
        </ScrollContainer>
        {this.renderLoading()}
        <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => this.props.navigation.goBack()},
                {iconSource: icons.shoppingCart, buttonFunc: () => {}},
            ]}
        />
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({
  businessContainer: {
    width: "100%",
    paddingBottom: 0,
    borderRadius: styleValues.bordRadius,
  },
  checkoutBar: {
    flexDirection: "row",
    width: "100%",
    marginTop: styleValues.mediumPadding,
  },
  checkoutButton: {
    width: "30%",
  },
  deliveryMethod: {
    width: undefined, 
    flex: 1,
    marginRight: styleValues.mediumPadding
  },
})