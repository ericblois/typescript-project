import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
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
import OrderCard from "../CustomComponents/OrderCard";
import ScrollContainer from "../CustomComponents/ScrollContainer";

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

export default class CustomerOrdersPage extends Component<Props, State> {

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

  renderOrders(orders?: OrderData[]) {
    if (orders) {
      return (
        <View style={{flex: 1}}>
          <Text style={textStyles.large}>Current Orders</Text>
          {orders.map((orderData) => {
            return (
              <OrderCard
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

  render() {
    return (
      <PageContainer>
        <Text style={textStyles.larger}>Your Orders</Text>
        <ScrollContainer style={{width: styleValues.winWidth}}>
          {this.renderOrders(this.state.activeOrders)}
          {this.renderOrders(this.state.previousOrders)}
        </ScrollContainer>
        <TextButton
          text={"View your cart"}
          buttonStyle={{marginBottom: 0}}
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