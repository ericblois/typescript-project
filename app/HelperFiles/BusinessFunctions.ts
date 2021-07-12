import { PrivateBusinessData, ProductCategory, ProductData, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore, storage } from "./Constants"
import uuid from 'react-native-uuid';
import { getCompressedImage } from "./ClientFunctions"

export class BusinessFunctions {

    businessID: Readonly<string>

    constructor(businessID: string) {
        this.businessID = businessID
    }

    public async getPrivateData() {
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

    public async getPublicData() {
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
            // Delete all products in category
            await Promise.all(productList[catIndex].productIDs.map((productID) => {
                return this.deleteProduct(productID)
            }))
            // Delete category
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
            const newDocRef = productColRef.doc()
            // Update the product's product ID
            let newProductData = productData
            newProductData.productID = newDocRef.id
            // Update the corresponding product category
            let productCat = await this.getProductCategory(newProductData.category)
            productCat.productIDs.push(newProductData.productID)
            // Get product list
            let productList = publicData.productList
            // Find the index of the corresponding product category
            const catIndex = productList.findIndex((productCat) => {
                return productCat.name === productData.category
            })
            if (catIndex > -1) {
                // Update the category
                productList[catIndex] = productCat
                // Send transaction to server in a batch
                await firestore.runTransaction(async (transaction) => {
                    transaction.set(productColRef.doc(), newProductData)
                    const businessRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(this.businessID))
                    const updateData: Partial<PublicBusinessData> = {productList: productList}
                    transaction.update(businessRef, updateData)
                })
                return newProductData.productID
            } else {
                throw new Error("Could not find product category: ".concat(productData.category))
            }
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
                throw new Error("Tried to create new product, could not find business' country.")
            }
            // Add the product to this business' products collection
            const productDocRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(this.businessID).concat("/products/").concat(productID))
            // Get the product doc
            const productData = await this.getProduct(productID)
            // Update the corresponding product category
            let productCat = await this.getProductCategory(productData.category)
            // Get index of product
            const productIndex = productCat.productIDs.findIndex((id) => {
                return id === productID
            })
            if (productIndex > -1) {
                productCat.productIDs.splice(productIndex, 1)
                // Get product list
                let productList = publicData.productList
                // Find the index of the corresponding product category
                const catIndex = productList.findIndex((productCat) => {
                    return productCat.name === productData.category
                })
                if (catIndex > -1) {
                    // Update the category
                    productList[catIndex] = productCat
                    // Send transaction to server in a batch
                    await firestore.runTransaction(async (transaction) => {
                        transaction.delete(productDocRef)
                        const businessRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(this.businessID))
                        const updateData: Partial<PublicBusinessData> = {productList: productList}
                        transaction.update(businessRef, updateData)
                    })
                }
            }
        } catch(e) {
            throw e
        }
    }

    public async uploadImages(imagePaths: string[]) {
        try {
            const downloadURLs = await Promise.all(imagePaths.map(async (localPath) => {
                // Generate a new uuid to be used as the filename
                const newID = uuid.v4() as string
                const serverPath = "images/businessImages/".concat(this.businessID).concat("/").concat(newID).concat(".jpg")
                const result = await ServerData.uploadFile(localPath, serverPath)
                return result
            }))
            return downloadURLs
        } catch (e) {
            throw e
        }
    }

    public async deleteImages(downloadURLs: string[]) {
        try {
            await Promise.all(downloadURLs.map((downloadURL) => {
                return ServerData.deleteFile(downloadURL)
            }))
        } catch (e) {
            throw e
        }
    }

}