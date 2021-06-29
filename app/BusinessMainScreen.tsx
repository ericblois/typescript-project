import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import { BusinessEditMainPage, BusinessEditInfoPage, BusinessEditLocationPage, NotificationsPage, BusinessAccountPage, BusinessEditProductListPage, BusinessEditProductCategoryPage, BusinessEditProductPage } from "./HelperFiles/PageIndex";
import { MenuBar } from "./HelperFiles/CompIndex"
import { styleValues } from "./HelperFiles/StyleSheet"
import { defaults, icons } from "./HelperFiles/StyleSheet";
import { BusinessMainStack, CustomerMainTab } from "./HelperFiles/Navigation";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { StackNavigationProp, StackHeaderProps } from '@react-navigation/stack';
import { RootStackParamList } from "./HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { PrivateBusinessData, PublicBusinessData } from "./HelperFiles/DataTypes";
import { BusinessFunctions } from "./HelperFiles/BusinessFunctions";
import UserFunctions from "./HelperFiles/UserFunctions";

type BusinessMainNavigationProp = StackNavigationProp<RootStackParamList, "businessMain">;

type BusinessMainRouteProp = RouteProp<RootStackParamList, "businessMain">;

type Props = {
    navigation: BusinessMainNavigationProp,
    route: BusinessMainRouteProp
}

type State = {
  headerShown: boolean
}

export default class BusinessMainScreen extends Component<Props, State> {

  businessFuncs: BusinessFunctions

  constructor(props: Props) {
    super(props)
    this.state= {
      headerShown: true
    }
    this.businessFuncs = props.route.params.businessFuncs
  }

  getEditButtons(props: StackHeaderProps) {
    return [
      {
          iconSource: icons.chevron,
          buttonFunc: () => {props.navigation.navigate("businessEdit")},
      },
      {
          iconSource: icons.checkBox,
          buttonFunc: () => {}
      }
    ]
  }

  getMainButtons(props: StackHeaderProps) {
    return [
      {
          iconSource: icons.store,
          buttonFunc: () => {props.navigation.navigate("businessEdit")},
      },
      {
          iconSource: icons.profile,
          buttonFunc: () => {props.navigation.navigate("account")}
      }
    ]
  }

  render() {
    return (
      <View style={defaults.screenContainer}>
        <BusinessMainStack.Navigator
            initialRouteName={"businessEdit"}
            screenOptions={(props) => ({
              headerStatusBarHeight: 0,
              headerShown: false,
          })}
        >
          <BusinessMainStack.Screen
              name={"businessEdit"}
              component={BusinessEditMainPage}
              listeners={{
                beforeRemove: (event) => {
                  if (event.target) {
                    if (event.target === "editInfo") {
                      this.setState({headerShown: false})
                    }
                  }
                }
              }}
          />
          <BusinessMainStack.Screen
              name={"editInfo"}
              children={(props) => {
                return <BusinessEditInfoPage {...props} businessFuncs={this.businessFuncs}/>
              }}
              listeners={{
                focus: (event) => {
                  this.setState({headerShown: false})
                }
              }}
          />
          <BusinessMainStack.Screen
              name={"editProductList"}
              children={(props) => {
                return <BusinessEditProductListPage {...props} businessFuncs={this.businessFuncs}/>
              }}
          />
          <BusinessMainStack.Screen
              name={"editProductCat"}
              children={(props) => {
                return <BusinessEditProductCategoryPage {...props} businessFuncs={this.businessFuncs}/>
              }}
          />
          <BusinessMainStack.Screen
              name={"editProduct"}
              children={(props) => {
                return <BusinessEditProductPage {...props} businessFuncs={this.businessFuncs}/>
              }}
          />
          <BusinessMainStack.Screen
              name={"editLocation"}
              children={(props) => {
                return <BusinessEditLocationPage {...props} businessFuncs={this.businessFuncs}/>
              }}
          />
          <BusinessMainStack.Screen
              name={"account"}
              component={BusinessAccountPage}
              options={{
                animationEnabled: false
              }}
          />
        </BusinessMainStack.Navigator>
      </View>
    );
  }
}

const headerBarTop = styleValues.winHeight
    - defaults.tabBar.height
    - styleValues.mediumPadding*2

const styles = StyleSheet.create({
    headerBar: {
        bottom: undefined,
        top: headerBarTop,
    }
})