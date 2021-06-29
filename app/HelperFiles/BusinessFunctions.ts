import { PrivateBusinessData, ProductCategory, ProductData, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore } from "./Constants"

export class BusinessFunctions {

    businessID: string

    constructor(businessID: string) {
        this.businessID = businessID
    }

    public async getPrivateData() {
        try {
            const userID = UserFunctions.getCurrentUser().uid
            const privateDocPath = "/userData/".concat(userID).concat("/businesses/").concat(this.businessID)
            const privateDocRef = firestore.doc(privateDocPath)
            const privateData = (await ServerData.getDoc(privateDocRef)) as PrivateBusinessData
            return privateData
        } catch(e) {
            throw e
        }
    }

    public async getPublicData() {
        try {
            const userData = (await UserFunctions.getUserDoc()) as UserData
            const publicDocPath = "/publicBusinessData/".concat(userData.country).concat("/businesses/").concat(this.businessID)
            const publicDocRef = firestore.doc(publicDocPath)
            const publicData = (await ServerData.getDoc(publicDocRef)) as PublicBusinessData
            return publicData
        } catch(e) {
            throw e
        }
    }

    public async updatePrivateData(data: Partial<PrivateBusinessData>) {
        try {
            const userID = UserFunctions.getCurrentUser().uid
            const privateDocPath = "/userData/".concat(userID).concat("/businesses/").concat(this.businessID)
            const privateDocRef = firestore.doc(privateDocPath)
            await ServerData.updateDoc(data, privateDocRef)
        } catch(e) {
            throw e
        }
    }
    // Update this business' public data, then return the changed result
    public async updatePublicData(data: Partial<PublicBusinessData>) {
        try {
            const userData = (await UserFunctions.getUserDoc()) as UserData
            const publicDocPath = "/publicBusinessData/".concat(userData.country).concat("/businesses/").concat(this.businessID)
            const publicDocRef = firestore.doc(publicDocPath)
            await ServerData.updateDoc(data, publicDocRef)
            return (await this.getPublicData())
        } catch(e) {
            throw e
        }
    }

    public async getProductCategory(name: string) {
        try {
            const publicData = await this.getPublicData()
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

    public async deleteProductCategory(name: string) {
        try {
            const publicData = await this.getPublicData()
            let productList = publicData.productList ? publicData.productList : []
            // Find the index of the product category to delete
            let catIndex = productList.findIndex((value, index) => {
                if (value.name === name) {
                  return true
                }
            })
            productList.splice(catIndex, 1)
            publicData.productList = productList
            await this.updatePublicData(publicData)
        } catch(e) {
            throw e
        }
    }

    public async updateProductCategory(name: string, category: ProductCategory) {
        try {
            const publicData = await this.getPublicData()
            let productList = publicData.productList ? publicData.productList : []
            // Find the index of the product category to retrieve
            let catIndex = productList.findIndex((value, index) => {
                if (value.name === name) {
                  return true
                }
            })
            productList[catIndex] = category
            publicData.productList = productList
            await this.updatePublicData(publicData)
        } catch(e) {
            throw e
        }
    }

    public async addProduct(productData: ProductData) {
        try {
            const publicData = await this.getPublicData()
            const country = publicData.country
            if (country === undefined) {
                throw new Error("Tried to create new product, could not find business' country.")
            }
            // Add the product to this business' products collection
            const productColRef = firestore.collection("/publicBusinessData/".concat(country).concat("/businesses/").concat(this.businessID).concat("/products"))
            const newDocRef = await ServerData.addDoc(productData, productColRef)
            // Update the product's product ID
            let newProductData = productData
            newProductData.productID = newDocRef.id
            await ServerData.updateDoc(newProductData, newDocRef)
            // Update the corresponding product category
            let productCat = await this.getProductCategory(newProductData.category)
            productCat.productIDs.push(newProductData.productID)
            await this.updateProductCategory(newProductData.category, productCat)
            return newProductData.productID
        } catch(e) {
            throw e
        }
    }

    public async getProduct(productID: string) {
        try {
            const publicData = await this.getPublicData()
            const country = publicData.country
            if (country === undefined) {
                throw new Error("Tried to retrieve product ID ".concat(productID).concat(", could not find business' country."))
            }
            const productDocRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(this.businessID).concat("/products/").concat(productID))
            const productDoc = (await ServerData.getDoc(productDocRef)) as ProductData
            return productDoc
        } catch(e) {
            throw e
        }
    }

    public async updateProduct(productID: string, productData: ProductData) {
        try {
            const publicData = await this.getPublicData()
            const country = publicData.country
            if (country === undefined) {
                throw new Error("Tried to retrieve product ID ".concat(productID).concat(", could not find business' country."))
            }
            const productDocRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(this.businessID).concat("/products/").concat(productID))
            await ServerData.updateDoc(productData, productDocRef)
        } catch(e) {
            throw e
        }
    }
}