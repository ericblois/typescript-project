import React, { Component } from "react";
import { View, LogBox, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, firestore } from "./app/HelperFiles/Constants";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { RootStack, CustomerMainStack } from "./app/HelperFiles/Navigation";
import StartScreen from "./app/StartScreen";
import UserSignupScreen from "./app/UserSignupScreen";
import CustomerMainScreen from "./app/CustomerMainScreen";
import BusinessShopScreen from "./app/CustomerMainPages/BusinessShopScreen";
import ProductShopScreen from "./app/BusinessShopPages/ProductShopPage";
import { installWebGeolocationPolyfill } from "expo-location"
import * as Font from 'expo-font';
import { SourceSansPro_400Regular, SourceSansPro_400Regular_Italic, SourceSansPro_700Bold } from '@expo-google-fonts/source-sans-pro';
import { Rubik_400Regular_Italic, Rubik_500Medium, Rubik_400Regular } from '@expo-google-fonts/rubik';
import { Lato_400Regular, Lato_400Regular_Italic, Lato_700Bold } from '@expo-google-fonts/lato';
import { Nunito_400Regular, Nunito_400Regular_Italic, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Roboto_400Regular, Roboto_400Regular_Italic, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_400Regular_Italic, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { RobotoSlab_400Regular, RobotoSlab_700Bold } from '@expo-google-fonts/roboto-slab';
import PageContainer from "./app/CustomComponents/PageContainer";
import BusinessMainScreen from "./app/BusinessMainScreen";

LogBox.ignoreLogs(['Calling getNode()', 'VirtualizedLists should never be nested'])

interface Props {

}

interface State {
  fontsLoaded: boolean
}

export default class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      fontsLoaded: false
    }
  }

  componentDidMount() {

    installWebGeolocationPolyfill()
    // Load local persistent data
    this.getLocalData();
    this.loadFonts()
  }

  async loadFonts() {
    try {
      await Font.loadAsync({
        SourceSansProRegular: SourceSansPro_400Regular,
        SourceSansProItalic: SourceSansPro_400Regular_Italic,
        SourceSansProBold: SourceSansPro_700Bold,
        RubikRegular: Rubik_400Regular,
        RubikItalic: Rubik_400Regular_Italic,
        RubikBold: Rubik_500Medium,
        LatoRegular: Lato_400Regular,
        LatoItalic: Lato_400Regular_Italic,
        LatoBold: Lato_700Bold,
        NunitoRegular: Nunito_400Regular,
        NunitoItalic: Nunito_400Regular_Italic,
        NunitoBold: Nunito_700Bold,
        RobotoRegular: Roboto_400Regular,
        RobotoItalic: Roboto_400Regular_Italic,
        RobotoBold: Roboto_700Bold,
        MontserratRegular: Montserrat_400Regular,
        MontserratMedium: Montserrat_500Medium,
        MontserratItalic: Montserrat_400Regular_Italic,
        MontserratBold: Montserrat_700Bold,
        RobotoSlabRegular: RobotoSlab_400Regular,
        RobotoSlabBold: RobotoSlab_700Bold,
      })
      this.setState({fontsLoaded: true})
    } catch (e) {
      console.error(e)
    }
  }

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

  render() {
    if (this.state.fontsLoaded) {
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
    } else {
      return (
        <PageContainer>
          <ActivityIndicator
            size={"large"}
          />
        </PageContainer>
      )
    }
  }
}
