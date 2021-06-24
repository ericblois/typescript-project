import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProductData, PrivateBusinessData } from "./DataTypes";

export type RootStackParamList = {
    start: undefined,
    userSignup: undefined,
    customerMain: undefined,
    businessMain: undefined,
    businessShop: {
        businessData: PrivateBusinessData
    },
    productShop: {
        productData: ProductData,
        productType: string
    }
}

export const RootStack = createStackNavigator<RootStackParamList>();

export type CustomerMainTabParamList = {
    search: undefined,
    fav: undefined,
    notif: undefined,
    account: undefined,
}

export const CustomerMainTab = createBottomTabNavigator<CustomerMainTabParamList>();

export type BusinessMainStackParamList = {
    businessEdit: undefined,
    editInfo: undefined,
    editLocation: undefined,
    notif: undefined,
    account: undefined,
}

export const BusinessMainStack = createStackNavigator<BusinessMainStackParamList>();

export type BusinessShopTabParamList = {
    back: undefined,
    info: undefined,
    products: undefined,
}

export const BusinessShopTab = createBottomTabNavigator<BusinessShopTabParamList>();


export type UserSignupStackParamList = {
    accountType: undefined,
    customerInfo: undefined
}

export const UserSignupStack = createStackNavigator<UserSignupStackParamList>();