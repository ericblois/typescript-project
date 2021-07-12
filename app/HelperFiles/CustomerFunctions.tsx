import { PrivateBusinessData, ProductCategory, ProductData, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore, storage } from "./Constants"
import uuid from 'react-native-uuid';
import { getCompressedImage } from "./ClientFunctions"

export abstract class CustomerFunctions {
    /* ONLY FOR CANADA CURRENTLY */
    public static async getPublicBusinessData(businessID: string) {
        try {
            const userData = (await UserFunctions.getUserDoc()) as UserData
            const publicDocPath = "/publicBusinessData/".concat(userData.country).concat("/businesses/").concat(businessID)
            const publicDocRef = firestore.doc(publicDocPath)
            const publicData = (await ServerData.getDoc(publicDocRef))
            return {...publicData} as PublicBusinessData
        } catch(e) {
            throw e
        }
    }

    public static async getProductCategory(businessID: string, name: string) {
        try {
            const publicData = await CustomerFunctions.getPublicBusinessData(businessID)
            let productList = publicData.productList ? publicData.productList : []
            // Find the index of the product category to retrieve
            let catIndex = productList.findIndex((value, index) => {
                if (value.name === name) {
                  return true
                }
            })
            return productList[catIndex]
        } catch(e) {
            throw e
        }
    }

    public static async getProduct(businessID: string, productID: string) {
        try {
            const publicData = await CustomerFunctions.getPublicBusinessData(businessID)
            const country = publicData.country
            if (country === undefined) {
                throw new Error("Tried to retrieve product ID ".concat(productID).concat(", could not find business' country."))
            }
            const productDocRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(businessID).concat("/products/").concat(productID))
            const productDoc = (await ServerData.getDoc(productDocRef)) as ProductData
            return productDoc
        } catch(e) {
            throw e
        }
    }
}