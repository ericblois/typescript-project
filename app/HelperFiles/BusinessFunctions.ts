import { PrivateBusinessData, ProductCategory, ProductData, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore, storage } from "./Constants"
import uuid from 'react-native-uuid';
import * as ImageManipulator from "expo-image-manipulator"

export class BusinessFunctions {

    businessID: Readonly<string>
    private privateData?: PrivateBusinessData
    private publicData?: PublicBusinessData

    constructor(businessID: string) {
        this.businessID = businessID
        this.initializeData()
    }
    // Get local copies of private and public data on construction
    async initializeData() {
        this.privateData = await this.getPrivateData()
        this.publicData = await this.getPublicData()
    }

    public async getPrivateData() {
        if (this.privateData) {
            return {...this.privateData} as PrivateBusinessData
        } else {
            try {
                const userID = UserFunctions.getCurrentUser().uid
                const privateDocPath = "/userData/".concat(userID).concat("/businesses/").concat(this.businessID)
                const privateDocRef = firestore.doc(privateDocPath)
                const privateData = (await ServerData.getDoc(privateDocRef))
                return {...privateData} as PrivateBusinessData
            } catch(e) {
                throw e
            }
        }
    }

    public async getPublicData() {
        if (this.publicData) {
            return {...this.publicData} as PublicBusinessData
        } else {
            try {
                const userData = (await UserFunctions.getUserDoc()) as UserData
                const publicDocPath = "/publicBusinessData/".concat(userData.country).concat("/businesses/").concat(this.businessID)
                const publicDocRef = firestore.doc(publicDocPath)
                const publicData = (await ServerData.getDoc(publicDocRef))
                return {...publicData} as PublicBusinessData
            } catch(e) {
                throw e
            }
        }
    }

    public async updatePrivateData(data: Partial<PrivateBusinessData>) {
        try {
            const userID = UserFunctions.getCurrentUser().uid
            const privateDocPath = "/userData/".concat(userID).concat("/businesses/").concat(this.businessID)
            const privateDocRef = firestore.doc(privateDocPath)
            await ServerData.updateDoc(data, privateDocRef)
            this.privateData = {...this.privateData, ...data} as PrivateBusinessData
            return (await this.getPrivateData())
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
            this.publicData = {...this.publicData, ...data} as PublicBusinessData
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

    public async createProductCategory(name: string) {
        try {
            const publicData = await this.getPublicData()
            let productList = publicData.productList ? publicData.productList : []
            // Create a new product category
            const newProductCat: ProductCategory = {
                name: name,
                productIDs: []
            }
            productList.push(newProductCat)
            publicData.productList = productList
            await this.updatePublicData(publicData)
        } catch(e) {
            throw e
        }
    }

    public async createProduct(productData: ProductData) {
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
            await this.updateProductCategory(productCat.name, productCat)
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

    public async deleteProduct(productID: string) {
        try {
            const publicData = await this.getPublicData()
            const country = publicData.country
            if (country === undefined) {
                throw new Error("Tried to retrieve product ID ".concat(productID).concat(", could not find business' country."))
            }
            const productDocRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(this.businessID).concat("/products/").concat(productID))
            await ServerData.deleteDoc(productDocRef)
        } catch(e) {
            throw e
        }
    }

    public async addImage(localImagePath: string) {
        try {
            // Compress the image
            const compressedImg = await ImageManipulator.manipulateAsync(localImagePath, [], {
                compress: 0.75,
                format: ImageManipulator.SaveFormat.JPEG
            })
            // Generate a new uuid to be used as the filename
            const newID = uuid.v4() as string
            const serverPath = "images/businessImages/".concat(this.businessID).concat("/").concat(newID).concat(".jpg")
            const result = await ServerData.uploadFile(compressedImg.uri, serverPath)
            console.log(result)
        } catch (e) {
            throw e
        }
    }
}