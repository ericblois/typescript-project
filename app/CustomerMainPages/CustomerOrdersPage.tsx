import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight, fonts } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import PageContainer from "../CustomComponents/PageContainer";
import { CustomerMainStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import TextButton from "../CustomComponents/TextButton";
import ItemList from "../CustomComponents/ItemList";
import { OrderData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import { FlatList } from "react-native-gesture-handler";
import CustomerOrderCard from "../CustomComponents/CustomerOrderCard";
import ScrollContainer from "../CustomComponents/ScrollContainer";
import LoadingCover from "../CustomComponents/LoadingCover";

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
    activeOrders?: OrderData[],
    previousOrders?: OrderData[]
}

export default class CustomerOrdersPage extends CustomComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      activeOrders: undefined,
      previousOrders: undefined,
    }
    props.navigation.addListener("focus", () => this.refreshData())
    this.refreshData()
  }

  async refreshData() {
    const activeOrders = await CustomerFunctions.getOrders(["pending", "accepted", "shipped"])
    const prevOrders = await CustomerFunctions.getOrders(["completed", "rejected"])
    this.setState({activeOrders: activeOrders, previousOrders: prevOrders})
  }

  renderOrders(header: string, orders?: OrderData[]) {
    if (orders) {
      return (
        <View style={{flex: 1}}>
          <Text style={{...textStyles.large, marginBottom: styleValues.mediumPadding}}>{header}</Text>
          {orders.map((orderData) => {
            return (
              <CustomerOrderCard
                  orderData={orderData}
                  key={orderData.orderID}
                  onPress={() => this.props.navigation.navigate("order", {orderData: orderData})}
                />
            )
          })}
        </View>
      )
    }
  }

  renderLoading() {
    if (!this.state.activeOrders || !this.state.previousOrders) {
      return (
        <LoadingCover size={"large"} style={{paddingBottom: styleValues.winWidth*0.5}}/>
      )
    }
  }

  render() {
    return (
      <PageContainer>
        <Text style={textStyles.largerHeader}>Your Orders</Text>
        <ScrollContainer
          containerStyle={{width: styleValues.winWidth}}
        >
          {this.renderOrders("Current Orders", this.state.activeOrders)}
          {this.renderOrders("Previous Orders", this.state.previousOrders)}
        </ScrollContainer>
        {this.renderLoading()}
        <TextButton
          text={"View your cart"}
          appearance={"color"}
          buttonStyle={{
            marginBottom: menuBarHeight + styleValues.mediumPadding*2,
            width: styleValues.winWidth - styleValues.mediumPadding*2
          }}
          buttonFunc={() => this.props.navigation.navigate("cart")}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          leftIconSource={icons.shoppingCart}
        />
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({

})