import { DefaultProductOption, OrderData, PrivateBusinessData, ProductCategory, ProductData, ProductOption, ProductOptionType, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore, storage, functions } from "./Constants"
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

    getPrivateRef() {
        return firestore.doc(`/privateBusinessData/${this.businessID}`)
    }

    async getPublicRef() {
        try {
            if (this.country) {
                return firestore.doc(`/publicBusinessData/${this.country}/businesses/${this.businessID}`)
            }
            const privateData = await this.getPrivateData()
            this.country = privateData.country
            return firestore.doc(`/publicBusinessData/${this.country}/businesses/${this.businessID}`)
        } catch (e) {
            throw e
        }
    }

    public async getPrivateData() {
        try {
            const userID = UserFunctions.getCurrentUser().uid
            const privateDocRef = this.getPrivateRef()
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
            const publicDocRef = await this.getPublicRef()
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
            const privateDocRef = this.getPrivateRef()
            this.hasUpdatedPrivate = true
            await ServerData.updateDoc(data, privateDocRef)
        } catch(e) {
            throw e
        }
    }
    // Update this business' public data, then return the changed result
    public async updatePublicData(data: PublicBusinessData) {
        try {
            if (!this.country) {
                this.country = data.country
            }
            // Get new and old data
            let newPublicData = {...data} as PublicBusinessData
            const oldPublicData = (await this.getPublicData()) as Readonly<PublicBusinessData>
            // Check if gallery images have changed
            let newImages: string[] = []
            let deletedImages: string[] = []
            // Find new images
            for (const url of newPublicData.galleryImages) {
                if (!oldPublicData.galleryImages.includes(url)) {
                    newImages.push(url)
                }
            }
            // Find deleted images
            for (const url of oldPublicData.galleryImages) {
                if (!newPublicData.galleryImages.includes(url)) {
                    deletedImages.push(url)
                }
            }
            // Add new images
            let downloadURLs: string[] = await this.uploadImages(newImages)
            // Replace local URIs with download URLs
            newImages.forEach((newImagesURL, newImagesIndex) => {
                // Get index of url in newPublicData's images list
                const publicDataIndex = newPublicData.galleryImages.findIndex((publicDataURL) => {
                    return publicDataURL === newImagesURL
                })
                // Replace the local URI with the download URL
                newPublicData.galleryImages[publicDataIndex] = downloadURLs[newImagesIndex]
            })
            // Delete images
            await this.deleteImages(deletedImages)
            this.hasUpdatedPublic = true
            const updateData = {
                businessID: this.businessID,
                publicData: data
            }
            const updatePublicBusinessData = functions.httpsCallable("updatePublicBusinessData")
            const result = await updatePublicBusinessData(updateData)
            return result.data
        } catch(e) {
            throw e
        }
    }

    public async getProductCategory(name: string) {
        try {
            const publicData = await this.getPublicData()
            let category = publicData.productList.find((productCat) => {
                return productCat.name === name
            })
            if (!category) {
                throw new Error(`Could not find product category: '${name}'`)
            }
            return category
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
            const newPublicData = {...await this.getPublicData()} as PublicBusinessData
            // Find the index of the product category to retrieve
            let catIndex = newPublicData.productList.findIndex((value) => {
                return value.name === name
            })
            if (catIndex < 0) {
                throw new Error(`Could not find product category: '${name}'`)
            }
            newPublicData.productList[catIndex] = category
            await this.updatePublicData(newPublicData)
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
            // Add the product to this business' products collection
            const publicDocRef = await this.getPublicRef()
            const docSnap = await publicDocRef.get()
            if (!docSnap.exists) {
                throw new Error(`Could not find public business ID: '${this.businessID}'`)
            }
            const publicData = docSnap.data() as PublicBusinessData
            const productColRef = firestore.collection(`${publicDocRef.path}/products`)
            const newDocRef = productColRef.doc()
            // Update the product's product ID
            let newProductData = productData
            newProductData.productID = newDocRef.id
            // Update the corresponding product category
            const catIndex = publicData.productList.findIndex((currentCat) => {
                return currentCat.name === productData.category
            })
            if (catIndex < 0) {
                throw new Error(`Could not find category: '${productData.category}' in public business ID: '${this.businessID}'`)
            }
            publicData.productList[catIndex].productIDs.push(newProductData.productID)
            // Send transaction to server in a batch
            await firestore.runTransaction(async (transaction) => {
                transaction.set(newDocRef, newProductData)
                transaction.update(publicDocRef, publicData)
            })
            this.hasUpdatedPublic = true
            return newProductData.productID
        } catch(e) {
            throw e
        }
    }

    public async getProduct(productID: string) {
        try {
            const publicDocRef = await this.getPublicRef()
            const productDocRef = firestore.doc(`${publicDocRef.path}/products/${productID}`)
            let docSnap: firebase.default.firestore.DocumentSnapshot
            try {
                docSnap = await productDocRef.get({source: "cache"})
            } catch (e) {
                docSnap = await productDocRef.get({source: "server"})
            }
            if (!docSnap.exists) {
                throw new Error(`Could not find product ID: '${productID}'`)
            }
            return docSnap.data() as ProductData
        } catch(e) {
            throw e
        }
    }

    public async updateProduct(productData: ProductData) {
        try {
            // Get new and old data
            let newProductData = {...productData} as ProductData
            const oldProductData = (await this.getProduct(productData.productID)) as Readonly<ProductData>
            // Find new images
            let newImages: string[] = []
            for (const url of newProductData.images) {
                if (!oldProductData.images.includes(url)) {
                    newImages.push(url)
                }
            }
            // Find deleted images
            let deletedImages: string[] = []
            for (const url of oldProductData.images) {
                if (!newProductData.images.includes(url)) {
                    deletedImages.push(url)
                }
            }
            // Add new images
            let downloadURLs: string[] = await this.uploadImages(newImages)
            // Replace local URIs with download URLs
            newImages.forEach((newImagesURL, newImagesIndex) => {
                // Get index of url in productData's images list
                const productIndex = newProductData.images.findIndex((productURL) => {
                    return productURL === newImagesURL
                })
                // Replace the local URI with the download URL
                newProductData.images[productIndex] = downloadURLs[newImagesIndex]
            })
            // Delete images
            await this.deleteImages(deletedImages)
            // Update product data
            const updateData = {
                businessID: this.businessID,
                productID: productData.productID,
                productData: newProductData
            }
            const updateProduct = functions.httpsCallable("updateProduct")
            const result = await updateProduct(updateData)
            return result.data
        } catch(e) {
            throw e
        }
    }

    public async deleteProduct(productID: string) {
        try {
            const publicData = await this.getPublicData()
            const publicDocRef = await this.getPublicRef()
            const productDocRef = firestore.doc(`${publicDocRef.path}/products/${productID}`)
            // Get the product doc
            const productData = await this.getProduct(productID)
            let deletedImages: string[] = productData.images
            // Search through options to find any images to delete
            for (const optionType of productData.optionTypes) {
                for (const option of optionType.options) {
                    deletedImages = deletedImages.concat(option.images)
                }
            }
            // Update the corresponding product category
            let category = await this.getProductCategory(productData.category)
            // Get index of product
            const productIndex = category.productIDs.findIndex((id) => {
                return id === productID
            })
            if (productIndex < 0) {
                throw new Error(`Could not find product ID: '${productID}' in category: '${productData.category}'`)
            }
            category.productIDs.splice(productIndex, 1)
            // Get product list
            let productList = publicData.productList
            // Find the index of the corresponding product category
            const catIndex = productList.findIndex((productCat) => {
                return productCat.name === productData.category
            })
            if (catIndex < 0) {
                throw new Error(`Could not find category: '${category.name}' in business ID: '${publicData.businessID}'`)
            }
            // Update the category
            productList[catIndex] = category
            // Delete images
            await this.deleteImages(deletedImages)
            // Send transaction to server in a batch
            await firestore.runTransaction(async (transaction) => {
                transaction.delete(productDocRef)
                const updateData: Partial<PublicBusinessData> = {productList: productList}
                transaction.update(publicDocRef, updateData)
            })
            return
        } catch(e) {
            throw e
        }
    }

    public async getOptionType(productID: string, optionTypeName: string) {
        try {
            const productData = await this.getProduct(productID)
            const optionType = productData.optionTypes.find((currentOptionType) => {
                return (currentOptionType.name === optionTypeName)
            })
            if (!optionType) {
                throw new Error(`Could not find option type: '${optionTypeName}' in product ID: '${productID}'`)
            }
            return optionType
        } catch (e) {
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
            const updateData = {
                businessID: this.businessID,
                productID: productID,
                productData: newProductData
            }
            const updateProduct = functions.httpsCallable("updateProduct")
            const result = await updateProduct(updateData)
            return result.data
          } catch (e) {
            throw e
          }
    }

    public async deleteOptionType(productID: string, optionTypeName: string) {
        try {
            let newProductData = await this.getProduct(productID)
            // Get option type
            const optionTypeIndex = newProductData.optionTypes.findIndex((currentType) => {
                return currentType.name === optionTypeName
            })
            if (optionTypeIndex < 0) {
                throw new Error(`Could not find option type: ${optionTypeName}`)
            }
            // Delete all options' images
            await Promise.all(newProductData.optionTypes[optionTypeIndex].options.map((option) => {
                return this.deleteImages(option.images)
            }))
            // Update product data
            newProductData.optionTypes.splice(optionTypeIndex, 1)
            const updateData = {
                businessID: this.businessID,
                productID: productID,
                productData: newProductData
            }
            const updateProduct = functions.httpsCallable("updateProduct")
            const result = await updateProduct(updateData)
            return result.data
          } catch (e) {
            throw e
          }
    }

    public async getOption(productID: string, optionTypeName: string, optionName: string) {
        try {
            const optionType = await this.getOptionType(productID, optionTypeName)
            const option = optionType.options.find((currentOption) => {
                return (currentOption.name === optionName)
            })
            if (!option) {
                throw new Error(`Could not find option: '${optionName}' in option type: '${optionTypeName}' in product ID: '${productID}'`)
            }
            return option
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
            const updateData = {
                businessID: this.businessID,
                productID: productID,
                productData: newProductData
            }
            const updateProduct = functions.httpsCallable("updateProduct")
            const result = await updateProduct(updateData)
            return result.data
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
            const updateData = {
                businessID: this.businessID,
                productID: productID,
                productData: newProductData
            }
            const updateProduct = functions.httpsCallable("updateProduct")
            const result = await updateProduct(updateData)
            return result.data
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
            const orderDocPath = `${this.getPrivateRef().path}/orders/${orderID}`
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
            const ordersColPath = `${this.getPrivateRef().path}/orders`
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