import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight, fonts } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import PageContainer from "../CustomComponents/PageContainer";
import { BusinessMainStackParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import TextButton from "../CustomComponents/TextButton";
import ItemList from "../CustomComponents/ItemList";
import { OrderData } from "../HelperFiles/DataTypes";
import { FlatList } from "react-native-gesture-handler";
import { BusinessOrderCard, LoadingCover, MenuBar, ScrollContainer } from "../HelperFiles/CompIndex"
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";

type BusinessOrdersNavigationProp = StackNavigationProp<BusinessMainStackParamList, "orders">

type BusinessOrdersRouteProp = RouteProp<BusinessMainStackParamList, "orders">;

type Props = {
  navigation: BusinessOrdersNavigationProp,
  route: BusinessOrdersRouteProp,
  businessFuncs: BusinessFunctions
}

type State = {
    ordersLoaded: boolean,
    newOrders?: OrderData[],
    activeOrders?: OrderData[],
    readyOrders?: OrderData[],
    previousOrders?: OrderData[]
}

export default class BusinessOrdersPage extends CustomComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
        ordersLoaded: false,
        newOrders: undefined,
        activeOrders: undefined,
        readyOrders: undefined,
        previousOrders: undefined,
    }
    props.navigation.addListener("focus", () => this.refreshData())
    this.refreshData()
  }

  async refreshData() {
    this.setState({ordersLoaded: false})
    const newOrders = await this.props.businessFuncs.getOrders(["pending"])
    const activeOrders = await this.props.businessFuncs.getOrders(["accepted"])
    const readyOrders = await this.props.businessFuncs.getOrders(["completed"])
    const prevOrders = await this.props.businessFuncs.getOrders(["received", "rejected"])
    this.setState({
        ordersLoaded: true,
        newOrders: newOrders,
        activeOrders: activeOrders,
        readyOrders: readyOrders,
        previousOrders: prevOrders})
  }

  renderOrders(header: string, orders?: OrderData[]) {
    if (orders && orders.length > 0) {
      return (
        <View style={{flex: 1}}>
          <Text style={{...textStyles.large, marginBottom: styleValues.mediumPadding}}>{header}</Text>
          {orders.map((orderData) => {
            return (
              <BusinessOrderCard
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
    if (!this.state.ordersLoaded) {
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
          {this.renderOrders("New Orders", this.state.newOrders)}
          {this.renderOrders("In Progress", this.state.activeOrders)}
          {this.renderOrders("Ready", this.state.readyOrders)}
        </ScrollContainer>

        {this.renderLoading()}
        <MenuBar
            buttonProps={[
                {
                  iconSource: icons.store,
                  buttonFunc: () => {this.props.navigation.navigate("businessEdit")},
                },
                {
                    iconSource: icons.document,
                    buttonFunc: () => {this.props.navigation.navigate("orders")},
                    iconStyle: {tintColor: colors.mainColor}
                },
                {
                  iconSource: icons.profile,
                  buttonFunc: () => {this.props.navigation.navigate("account")}
                },
            ]}
        />
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({

})