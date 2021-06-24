import React, { Component } from "react";
import { StyleSheet, StatusBar, AppState, ActivityIndicator, View } from "react-native";
import { BusinessEditMainPage, BusinessEditInfoPage, BusinessEditLocationPage, NotificationsPage, BusinessAccountPage } from "./HelperFiles/PageIndex";
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
    route: BusinessMainRouteProp,
    businessID: string
}

type State = {
  headerShown: boolean
}

export default class BusinessMainScreen extends Component<Props, State> {

  businessFuncs: BusinessFunctions
  privateData: PrivateBusinessData
  publicData: PublicBusinessData

  constructor(props: Props) {
    super(props)
    this.state= {
      headerShown: true
    }
    this.businessFuncs = new BusinessFunctions(props.businessID)
    this.privateData = {userID: UserFunctions.getCurrentUser().uid}
    this.publicData = {id: props.businessID}
  }

  componentDidMount() {
    this.loadBusinessData()
  }

  async loadBusinessData() {
    try {
      let privData = await this.businessFuncs.getPrivateData()
      let pubData = await this.businessFuncs.getPublicData()
      this.privateData = privData
      this.publicData = pubData
    } catch(e) {
      throw e;
    }
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
              component={BusinessEditInfoPage}
              listeners={{
                focus: (event) => {
                  this.setState({headerShown: false})
                }
              }}
          />
          <BusinessMainStack.Screen
              name={"editLocation"}
              children={(props) => {
                return <BusinessEditLocationPage {...props} privateBusinessData={this.privateData} businessFuncs={this.businessFuncs}/>
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