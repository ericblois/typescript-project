import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProductData, PublicBusinessData, PrivateBusinessData, ProductCategory, CartItem } from "./DataTypes";
import { BusinessFunctions } from "./BusinessFunctions";

export type RootStackParamList = {
    start: undefined,
    userSignup: undefined,
    customerMain: undefined,
    businessMain: {
        businessFuncs: BusinessFunctions
    },
}

export const RootStack = createStackNavigator<RootStackParamList>();

export type CustomerMainStackParamList = {
    customerTab: undefined,
    businessShop: {
        businessData: PublicBusinessData
    },
    cart: undefined,
}

export const CustomerMainStack = createStackNavigator<CustomerMainStackParamList>();

export type CustomerTabParamList = {
    browse: undefined,
    fav: undefined,
    notif: undefined,
    orders: undefined,
    account: undefined,
}

export const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();

export type BusinessMainStackParamList = {
    businessEdit: undefined,
    editInfo: undefined,
    editLocation: undefined,
    editProductList: undefined,
    editProductCat: {
        productCategory: string
    },
    editProduct: {
        productID: string
    },
    editOptionType: {
        productID: string,
        productName: string,
        optionType: string
    },
    editOption: {
        productID: string,
        optionType: string,
        option: string
    },
    notif: undefined,
    account: undefined,
}

export const BusinessMainStack = createStackNavigator<BusinessMainStackParamList>();

export type BusinessShopStackParamList = {
    info: undefined,
    products: undefined,
    productInfo: {
        businessID: string,
        productID: string,
    },
}

export const BusinessShopStack = createStackNavigator<BusinessShopStackParamList>();


export type UserSignupStackParamList = {
    accountType: undefined,
    customerInfo: {
        accountType: "customer" | "business"
    }
}

export const UserSignupStack = createStackNavigator<UserSignupStackParamList>();