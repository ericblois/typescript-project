import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
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
import { ScrollView } from "react-native-gesture-handler";
import { CartItem, PublicBusinessData } from "../HelperFiles/DataTypes";
import ProductCartCard from "../CustomComponents/ProductCartCard";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import ProductCardList from "../CustomComponents/ProductCardList";
import MenuBar from "../CustomComponents/MenuBar";

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
}

export default class CustomerCartPage extends Component<CustomerCartProps, CustomerCartState> {

  constructor(props: CustomerCartProps) {
    super(props)
    this.state = {
        businessCarts: undefined,
        businesses: undefined
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
        this.setState({businessCarts: businessCarts, businesses: businesses})
    })
  }

  renderBusinessCarts() {
      if (this.state.businessCarts) {
          return Object.entries(this.state.businessCarts).map(([businessID, items]) => {
              return (
                <View
                    style={styles.businessContainer}
                    key={businessID}
                >
                    <Text style={defaults.largeTextHeader}>{this.state.businesses![businessID].name}</Text>
                    <ProductCardList
                        products={items}
                        showLoading={true}
                    />
              </View>
              )
          })
      }
  }

  renderCartItems(items: CartItem[]) {
    return (
        <ProductCardList
            products={items}
            showLoading={true}
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
        >Your Cart</Text>
          {this.renderBusinessCarts()}
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
  signout: {
    color: "red",
    fontSize: styleValues.largeTextSize,
  },
  businessContainer: {
    width: "100%",
    padding: styleValues.mediumPadding,
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.lightGreyColor,
  },
})