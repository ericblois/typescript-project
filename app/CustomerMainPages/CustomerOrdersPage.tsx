import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { styleValues, colors, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import PageContainer from "../CustomComponents/PageContainer";
import { CustomerMainStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import TextButton from "../CustomComponents/TextButton";

type CustomerOrdersNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CustomerTabParamList, "orders">,
  StackNavigationProp<CustomerMainStackParamList>
>

type CustomerOrdersRouteProp = RouteProp<CustomerTabParamList, "orders">;

type Props = {
  navigation: CustomerOrdersNavigationProp,
  route: CustomerOrdersRouteProp
}

type State = {

}

export default class CustomerOrdersPage extends Component<Props, State> {

  render() {
    return (
      <PageContainer>
        <Text style={defaults.largeTextHeader}>Orders</Text>
        <TextButton
          text={"Go to cart"}
          buttonFunc={() => this.props.navigation.navigate("cart")}
          rightIconSource={icons.shoppingCart}
        />
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({

})