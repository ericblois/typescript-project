import { CartItem, PrivateBusinessData, ProductCategory, ProductData, PublicBusinessData, UserData } from "./DataTypes"
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
                throw new Error("Tried to retrieve product ID '".concat(productID).concat("', could not find business' country."))
            }
            const productDocRef = firestore.doc("/publicBusinessData/".concat(country).concat("/businesses/").concat(businessID).concat("/products/").concat(productID))
            const productDoc = (await ServerData.getDoc(productDocRef)) as ProductData
            return productDoc
        } catch(e) {
            throw e
        }
    }
    // Get list of favorite businesses (by their ID)
    public static async getFavorites() {
        try {
            const userData = await UserFunctions.getUserDoc()
            return userData.favorites
        } catch (e) {
            throw e
        }
    }
    // Add a business to favorites
    public static async addToFavorites(businessID: string) {
        try {
            const userData = await UserFunctions.getUserDoc()
            let newFavorites = userData.favorites
            if (!newFavorites.includes(businessID)) {
                newFavorites.push(businessID)
                await UserFunctions.updateUserDoc({favorites: newFavorites})
            }
        } catch (e) {
            throw e
        }
    }
    // Delete a favorite business
    public static async deleteFavorite(businessID: string) {
        try {
            const userData = await UserFunctions.getUserDoc()
            let newFavorites = userData.favorites
            const favIndex = newFavorites.findIndex((id) => {
                return id === businessID
            })
            if (favIndex < 0) {
                throw new Error("Could not find a favourite with the ID: ".concat(businessID))
            }
            newFavorites.splice(favIndex, 1)
            await UserFunctions.updateUserDoc({favorites: newFavorites})
        } catch (e) {
            throw e
        }
    }

    public static async getCart(businessID?: string) {
        try {
            const userData = await UserFunctions.getUserDoc()
            let cartItems = userData.cartItems
            if (businessID) {
                cartItems = cartItems.filter((item) => {
                    return item.businessID === businessID
                })
            }
            return cartItems
        } catch (e) {
            throw e
        }
    }

    public static async addToCart(cartItem: CartItem) {
        try {
            const userDoc = await UserFunctions.getUserDoc()
            const cart = userDoc.cartItems
            let newItem = true
            // Check if cart already contains this item
            cart.forEach((item, index) => {
                // Check if product has been added to cart already
                if (item.businessID === cartItem.businessID && item.productID === cartItem.productID) {
                    // Check if product's options are the same
                    let sameOptions = true
                    for (const [optionType, selection] of Object.entries(item.productOptions)) {
                        const option = cartItem.productOptions[optionType]
                        if (!option || option.optionName !== selection.optionName) {
                            sameOptions = false
                            break
                        }
                    }
                    // Add this cart item to the existing same cart item
                    if (sameOptions) {
                        cart[index].quantity = cart[index].quantity + cartItem.quantity
                        newItem = false
                    }
                }
            })
            if (newItem) {
                cart.push(cartItem)
            }
            await UserFunctions.updateUserDoc({cartItems: cart})
        } catch (e) {
            throw e
        }
    }

    public static async updateCartQuantity(cartItem: CartItem, newQuantity: number) {
        try {
            let cart = await CustomerFunctions.getCart(cartItem.businessID)
            const itemIndex = cart.findIndex((item) => {
                // Check if product is the same
                if (cartItem.productID === item.productID) {
                    // Check if options are the same
                    let sameOptions = true
                    for (const [type, selection] of Object.entries(item.productOptions)) {
                        if (Object.keys(cartItem.productOptions).includes(type)) {
                            if (cartItem.productOptions[type].optionName === selection.optionName) {
                                continue
                            }
                        }
                        sameOptions = false
                        break
                    }
                    return sameOptions
                }
                return false
            })
            // Update the cart
            cart[itemIndex].quantity = newQuantity
            await UserFunctions.updateUserDoc({cartItems: cart})
            return cart[itemIndex]
        } catch (e) {
            throw e
        }
    }

    public static async deleteCartItem(cartItem: CartItem) {
        try {
            let cart = await CustomerFunctions.getCart(cartItem.businessID)
            const itemIndex = cart.findIndex((item) => {
                // Check if product is the same
                if (cartItem.productID === item.productID) {
                    // Check if options are the same
                    let sameOptions = true
                    for (const [type, selection] of Object.entries(item.productOptions)) {
                        if (Object.keys(cartItem.productOptions).includes(type)) {
                            if (cartItem.productOptions[type].optionName === selection.optionName) {
                                continue
                            }
                        }
                        sameOptions = false
                        break
                    }
                    return sameOptions
                }
                return false
            })
            // Update the cart
            cart.splice(itemIndex, 1)
            UserFunctions.updateUserDoc({cartItems: cart})
        } catch (e) {
            throw e
        }
    }
}