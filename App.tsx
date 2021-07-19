import React, { Component } from "react";
import { View, LogBox } from "react-native";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, firestore } from "./app/HelperFiles/Constants";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { RootStack, CustomerMainStack } from "./app/HelperFiles/Navigation";
import StartScreen from "./app/StartScreen";
import UserSignupScreen from "./app/UserSignupScreen";
import CustomerMainScreen from "./app/CustomerMainScreen";
import BusinessMainScreen from "./app/BusinessMainScreen";
import BusinessShopScreen from "./app/CustomerMainPages/BusinessShopScreen";
import ProductShopScreen from "./app/BusinessShopPages/ProductShopPage";
import { installWebGeolocationPolyfill } from "expo-location"

LogBox.ignoreLogs(['Calling getNode()', 'VirtualizedLists should never be nested'])

interface Props {

}

interface State {

}

export default class App extends Component<Props, State> {

  localData: { [key: string]: any } = {};

  getLocalData() {
      AsyncStorage.getItem("localData").then((jsonValue) => {
          this.localData = jsonValue ? JSON.parse(jsonValue) : {};
      },
      (e) => {
        console.error(e);
      })
  }

  setLocalData(key: string, value: any) {
    if (!value) {
      delete this.localData[key]
    } else {
      this.localData[key] = value;
    }
    this.saveLocalData();
  }

  saveLocalData() {
    const jsonValue = JSON.stringify(this.localData);
    AsyncStorage.setItem("localData", jsonValue).then(() => {}, (e) => console.error(e));
  }

  componentDidMount() {
    installWebGeolocationPolyfill()
    // Load local persistent data
    this.getLocalData();
  }

  render() {
    return (
        <NavigationContainer
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: "#f00"
            }
          }}
        >
            <RootStack.Navigator
              initialRouteName={auth.currentUser ? "customerMain" : "start"}
              screenOptions={{
                headerShown: false,
              }}
            >
              <RootStack.Screen name={"start"} component={StartScreen}/>
              <RootStack.Screen name={"userSignup"} component={UserSignupScreen}/>
              <RootStack.Screen name={"customerMain"} component={CustomerMainScreen}/>
              <RootStack.Screen name={"businessMain"} component={BusinessMainScreen}/>
            </RootStack.Navigator>
        </NavigationContainer>
    );
  }
}
