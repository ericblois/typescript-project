import { DefaultProductOption, OrderData, PrivateBusinessData, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore, storage, functions, getPrivateBusinessRef, getPublicBusinessRef } from "./Constants"
import uuid from 'react-native-uuid';
import { getCompressedImage } from "./ClientFunctions"

export class BusinessFunctions {

    businessID: Readonly<string>
    country?: Readonly<string>
    hasUpdatedPrivate: boolean
    hasUpdatedPublic: boolean

    constructor(businessID: string) {
        this.businessID = businessID
        this.hasUpdatedPrivate = true
        this.hasUpdatedPublic = true
    }

    public async getPrivateData() {
        try {
            const userID = UserFunctions.getCurrentUser().uid
            const privateDocRef = getPrivateBusinessRef(this.businessID)
            let docSnap: firebase.default.firestore.DocumentSnapshot
            if (this.hasUpdatedPrivate) {
                docSnap = await privateDocRef.get({source: "server"})
            } else {
                try {
                    docSnap = await privateDocRef.get({source: "cache"})
                } catch (e) {
                    docSnap = await privateDocRef.get({source: "server"})
                }
            }
            if (!docSnap.exists) {
                throw new Error(`Unable to find private data for business ID: ${this.businessID}`)
            }
            this.hasUpdatedPrivate = false
            return {...docSnap.data()} as PrivateBusinessData
        } catch(e) {
            throw e
        }
    }

    public async getPublicData() {
        try {
            if (!this.country) {
                this.country = (await this.getPrivateData()).country
            }
            const publicDocRef = getPublicBusinessRef(this.country!, this.businessID)
            let docSnap: firebase.default.firestore.DocumentSnapshot
            if (this.hasUpdatedPublic) {
                docSnap = await publicDocRef.get({source: "server"})
            } else {
                try {
                    docSnap = await publicDocRef.get({source: "cache"})
                } catch (e) {
                    docSnap = await publicDocRef.get({source: "server"})
                }
            }
            if (!docSnap.exists) {
                throw new Error(`Unable to find private data for business ID: ${this.businessID}`)
            }
            this.hasUpdatedPublic = false
            return {...docSnap.data()} as PublicBusinessData
        } catch(e) {
            throw e
        }
    }

    public async updatePrivateData(data: Partial<PrivateBusinessData>) {
        try {
            const userID = UserFunctions.getCurrentUser().uid
            const privateDocPath = "/userData/".concat(userID).concat("/businesses/").concat(this.businessID)
            const privateDocRef = firestore.doc(privateDocPath)
            this.hasUpdatedPrivate = true
            await ServerData.updateDoc(data, privateDocRef)
        } catch(e) {
            throw e
        }
    }
    // Update this business' public data, then return the changed result
    public async updatePublicData(data: Partial<PublicBusinessData>) {
        try {
            if (!this.country) {
                this.country = (await this.getPrivateData()).country
            }
            const publicDocRef = getPublicBusinessRef(this.country!, this.businessID)
            this.hasUpdatedPublic = true
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
            if (!this.country) {
                this.country = (await this.getPrivateData()).country
            }
            const publicDocRef = getPublicBusinessRef(this.country!, this.businessID)
            const productColRef = firestore.collection(`${publicDocRef.path}/products`)
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
                    transaction.set(newDocRef, newProductData)
                    const updateData: Partial<PublicBusinessData> = {productList: productList}
                    transaction.update(publicDocRef, updateData)
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
            if (!this.country) {
                this.country = (await this.getPrivateData()).country
            }
            const publicDocRef = getPublicBusinessRef(this.country!, this.businessID)
            const productDocRef = firestore.doc(`${publicDocRef.path}/products/${productID}`)
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
            if (!this.country) {
                this.country = (await this.getPrivateData()).country
            }
            const publicDocRef = getPublicBusinessRef(this.country!, this.businessID)
            const productDocRef = firestore.doc(`${publicDocRef.path}/products/${productID}`)
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
            if (!this.country) {
                this.country = (await this.getPrivateData()).country
            }
            const publicDocRef = getPublicBusinessRef(this.country!, this.businessID)
            const productDocRef = firestore.doc(`${publicDocRef.path}/products/${productID}`)
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
                        const updateData: Partial<PublicBusinessData> = {productList: productList}
                        transaction.update(publicDocRef, updateData)
                    })
                }
            }
        } catch(e) {
            throw e
        }
    }

    public async updateOptionType(productID: string, optionType: ProductOptionType) {
        try {
            let newProductData = await this.getProduct(productID)
            // Get option type
            const optionTypeIndex = newProductData.optionTypes.findIndex((currentType) => {
                return currentType.name === optionType.name
            })
            if (optionTypeIndex < 0) {
                throw new Error(`Could not find option type: ${optionType.name}`)
            }
            // Update product data
            newProductData.optionTypes[optionTypeIndex] = optionType
            await this.updateProduct(newProductData.productID, newProductData)
          } catch (e) {
            throw e
          }
    }

    public async deleteOptionType(productID: string, optionType: ProductOptionType) {
        try {
            let newProductData = await this.getProduct(productID)
            // Get option type
            const optionTypeIndex = newProductData.optionTypes.findIndex((currentType) => {
                return currentType.name === optionType.name
            })
            if (optionTypeIndex < 0) {
                throw new Error(`Could not find option type: ${optionType.name}`)
            }
            // Delete all options (to get rid of images)
            await Promise.all(newProductData.optionTypes[optionTypeIndex].options.map((option) => {
                return this.deleteOption(productID, option)
            }))
            // Update product data
            newProductData.optionTypes.splice(optionTypeIndex, 1)
            await this.updateProduct(newProductData.productID, newProductData)
          } catch (e) {
            throw e
          }
    }

    public async updateOption(productID: string, option: ProductOption) {
        try {
            let newOption = {...option} as ProductOption
            let newProductData = await this.getProduct(productID)
            // Get option type
            const optionTypeIndex = newProductData.optionTypes.findIndex((optionType) => {
                return optionType.name === newOption.optionType
            })
            if (optionTypeIndex < 0) {
                throw new Error(`Could not find option type: ${newOption.optionType}`)
            }
            // Get option
            const optionIndex = newProductData.optionTypes[optionTypeIndex].options.findIndex((currentOption) => {
                return currentOption.name === newOption.name
            })
            if (optionIndex < 0) {
                throw new Error(`Could not find option: ${newOption.name}`)
            }
            const oldOption = newProductData.optionTypes[optionTypeIndex].options[optionIndex]
            // Find new images
            let newImages: string[] = []
            for (const url of newOption.images) {
                if (!oldOption.images.includes(url)) {
                    newImages.push(url)
                }
            }
            // Find deleted images
            let deletedImages: string[] = []
            for (const url of oldOption.images) {
                if (!newOption.images.includes(url)) {
                    deletedImages.push(url)
                }
            }
            // Add new images
            let downloadURLs: string[] = await this.uploadImages(newImages)
            // Replace local URIs with download URLs
            newImages.forEach((newImagesURL, newImagesIndex) => {
                // Get index of url in option's images list
                const optionIndex = newOption.images.findIndex((optionURL) => {
                    return optionURL === newImagesURL
                })
                // Replace the local URI with the download URL
                newOption.images[optionIndex] = downloadURLs[newImagesIndex]
            })
            // Delete images
            await this.deleteImages(deletedImages)
            // Update product data
            newProductData.optionTypes[optionTypeIndex].options[optionIndex] = newOption
            await this.updateProduct(newProductData.productID, newProductData)
          } catch (e) {
            throw e
          }
    }

    public async deleteOption(productID: string, option: ProductOption) {
        try {
            let newProductData = await this.getProduct(productID)
            // Get option type
            const optionTypeIndex = newProductData.optionTypes.findIndex((optionType) => {
                return optionType.name === option.optionType
            })
            if (optionTypeIndex < 0) {
                throw new Error(`Could not find option type: ${option.optionType}`)
            }
            // Get option
            const optionIndex = newProductData.optionTypes[optionTypeIndex].options.findIndex((currentOption) => {
                return currentOption.name === option.name
            })
            if (optionIndex < 0) {
                throw new Error(`Could not find option: ${option.name}`)
            }
            // Delete images
            await this.deleteImages(option.images)
            // Update product data
            newProductData.optionTypes[optionTypeIndex].options.splice(optionIndex, 1)
            await this.updateProduct(newProductData.productID, newProductData)
          } catch (e) {
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

    public async getOrder(orderID: string) {
        try {
            const privateData = await this.getPrivateData()
            const orderDocPath = `${getPrivateBusinessRef(this.businessID).path}/orders/${orderID}`
            const orderDocSnap = await firestore.doc(orderDocPath).get()
            if (!orderDocSnap.exists) {
                throw new Error(`Could not find order ID: ${orderID}`)
            }
            return orderDocSnap.data() as OrderData
        } catch (e) {
            throw e
        }
    }

    public async getOrders(types?: OrderData["status"][]) {
        try {
            const privateData = await this.getPrivateData()
            const ordersColPath = `${getPrivateBusinessRef(this.businessID).path}/orders`
            const ordersColRef = firestore.collection(ordersColPath)
            if (types) {
                const ordersQuery = await ordersColRef.where("status", "in", types).get()
                const orders = ordersQuery.docs.map((snap) => {
                    return snap.data() as OrderData
                })
                return orders
            } else {
                const ordersQuery = await ordersColRef.get()
                const orders = ordersQuery.docs.map((snap) => {
                    return snap.data() as OrderData
                })
                return orders
            }
        } catch (e) {
            throw e
        }
    }

    public async respondToOrder(businessID: string, orderID: string, acceptOrder: boolean) {
        try {
            const orderInfo = {
                businessID: businessID,
                orderID: orderID,
                acceptOrder: acceptOrder
            }
            const respondToOrder = functions.httpsCallable("respondToOrder")
            const result = await respondToOrder(orderInfo)
            return result.data
        } catch (e) {
            throw e
        }
    }

    public async completeOrder(businessID: string, orderID: string, shipped: boolean) {
        try {
            const orderInfo = {
                businessID: businessID,
                orderID: orderID,
                shipped: shipped
            }
            const completeOrder = functions.httpsCallable("completeOrder")
            const result = await completeOrder(orderInfo)
            return result.data
        } catch (e) {
            throw e
        }
    }

}