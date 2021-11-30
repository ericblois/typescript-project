import { CartItem, OptionSelections, OrderData, PrivateBusinessData, ProductCategory, ProductData, PublicBusinessData, ShippingInfo, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore, functions, storage, geofire, getPublicBusinessRef } from "./Constants"
import uuid from 'react-native-uuid';
import { getCompressedImage } from "./ClientFunctions"
import orderId from "order-id";

export abstract class CustomerFunctions {
    /* ONLY FOR CANADA CURRENTLY */
    public static async getPublicBusinessData(businessID: string) {
        try {
            const userData = await UserFunctions.getUserDoc()
            const publicDocRef = getPublicBusinessRef(businessID, userData.country)
            const docSnap = await publicDocRef.get()
            if (!docSnap.exists) {
                await CustomerFunctions.removeBusinessReferences(businessID)
                throw new Error(`Could not find business ID: ${businessID}`)
            }
            return {...docSnap.data()} as PublicBusinessData
        } catch(e) {
            throw e
        }
    }
    // In the case that a business is deleted, run this function to clear user data of any references to the business
    public static async removeBusinessReferences(businessID : string) {
        try {
            // Clear favourites
            let newUserData = await UserFunctions.getUserDoc()
            if (newUserData.favorites.includes(businessID)) {
                const favIndex = newUserData.favorites.findIndex((id) => {
                    return id === businessID
                })
                if (favIndex > -1) {
                    newUserData.favorites.splice(favIndex, 1)
                }
            }
            // Clear cart
            const cartIndices: number[] = []
            newUserData.cartItems.forEach((item, index) => {
                if (item.businessID === businessID) {
                    cartIndices.push(index)
                }
            })
            // Go through indices in descending order and remove them
            cartIndices.sort()
            for (const index of cartIndices.reverse()) {
                newUserData.cartItems.splice(index, 1)
            }
            await UserFunctions.updateUserDoc(newUserData)
        } catch (e) {
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
            const productDocRef = firestore.doc(`${getPublicBusinessRef(businessID, publicData.country).path}/products/${productID}`)
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

    public static createCartItem(productData: ProductData, selections: OptionSelections, quantity: number) {
        const newCartItem: CartItem = {
            basePrice: productData.price,
            businessID: productData.businessID,
            productID: productData.productID,
            productOptions: selections,
            quantity: quantity,
            totalPrice: productData.price
        }
        // Option types
        for (const optionType of Object.keys(selections)) {
            // Selections
            for (const selection of selections[optionType]) {
                newCartItem.totalPrice += selection.priceChange
            }
        }
        return newCartItem
    }

    public static compareCartItems(firstItem: CartItem, secondItem: CartItem) {
        let sameItem = true
        // Check if IDs match
        if (firstItem.businessID === secondItem.businessID && firstItem.productID === secondItem.productID) {
            const secondOptionTypes = Object.keys(secondItem.productOptions)
            // Check if each item's options are the same
            optionLoop: for (const firstOptionType of Object.keys(firstItem.productOptions)) {
                // Check for matching option types
                if (secondOptionTypes.includes(firstOptionType)) {
                    // Check if same number of selections were made
                    if (firstItem.productOptions[firstOptionType].length !== secondItem.productOptions[firstOptionType].length) {
                        sameItem = false
                        break
                    }
                    const secondSelectionNames = secondItem.productOptions[firstOptionType].map(({optionName}) => optionName)
                    // Check option selections
                    for (const firstSelection of firstItem.productOptions[firstOptionType]) {
                        if (!secondSelectionNames.includes(firstSelection.optionName)) {
                            sameItem = false
                            break optionLoop
                        }
                    }
                } else {
                    sameItem = false
                    break
                }
            }
        } else {
            sameItem = false
        }
        return sameItem
    }

    public static async addToCart(cartItem: CartItem) {
        try {
            // Get cart
            const cart = await CustomerFunctions.getCart()
            // Check if cart already contains this item
            let itemIndex = cart.findIndex((item) => {
                return CustomerFunctions.compareCartItems(cartItem, item)
            })
            // Add to cart
            if (itemIndex < 0) {
                cart.push(cartItem)
            } else {
                // Update quantity
                cart[itemIndex].quantity += cartItem.quantity
            }
            await UserFunctions.updateUserDoc({cartItems: cart})
        } catch (e) {
            throw e
        }
    }

    public static async updateCartItem(cartItem: CartItem) {
        try {
            if (cartItem.quantity <= 0) {
                await CustomerFunctions.deleteCartItem(cartItem)
                return
            }
            let cart = await CustomerFunctions.getCart(cartItem.businessID)
            const itemIndex = cart.findIndex((item) => {
                return CustomerFunctions.compareCartItems(cartItem, item)
            })
            // Check if item exists in cart
            if (itemIndex < 0) {
                cart.push(cartItem)
            } else {
                // Update the cart
                cart[itemIndex] = cartItem
            }
            await UserFunctions.updateUserDoc({cartItems: cart})
        } catch (e) {
            throw e
        }
    }

    public static async deleteCartItem(cartItem: CartItem) {
        try {
            let cart = await CustomerFunctions.getCart(cartItem.businessID)
            const itemIndex = cart.findIndex((item) => {
                return CustomerFunctions.compareCartItems(cartItem, item)
            })
            if (itemIndex < 0) {
                return
            }
            if (cartItem.quantity >= cart[itemIndex].quantity) {
                // Update the cart
                cart.splice(itemIndex, 1)
            } else {
                cart[itemIndex].quantity -= cartItem.quantity
            }
            await UserFunctions.updateUserDoc({cartItems: cart})
        } catch (e) {
            throw e
        }
    }
    // Removes a quantity of cart items from cart
    public static async deleteCartItems(cartItems: CartItem[]) {
        try {
            let cart = await CustomerFunctions.getCart()
            for (const cartItem of cartItems) {
                const itemIndex = cart.findIndex((item) => {
                    return CustomerFunctions.compareCartItems(cartItem, item)
                })
                if (itemIndex < 0) {
                    continue
                }
                if (cartItem.quantity >= cart[itemIndex].quantity) {
                    // Update the cart
                    cart.splice(itemIndex, 1)
                } else {
                    cart[itemIndex].quantity -= cartItem.quantity
                }
            }
            await UserFunctions.updateUserDoc({cartItems: cart})
        } catch (e) {
            throw e
        }
    }

    public static async getOrder(orderID: string) {
        try {
            const currentUser = UserFunctions.getCurrentUser()
            const orderDocPath = `userData/${currentUser.uid}/orders/${orderID}`
            const orderDocRef = firestore.doc(orderDocPath)
            const orderDocSnap = await orderDocRef.get()
            if (!orderDocSnap.exists) {
                throw new Error(`Could not find order ID: ${orderID}`)
            }
            return orderDocSnap.data() as OrderData
        } catch (e) {
            throw e
        }
    }

    public static async getOrders(types?: OrderData["status"][]) {
        try {
            const currentUser = UserFunctions.getCurrentUser()
            const ordersColPath = `userData/${currentUser.uid}/orders`
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

    public static async placeOrder(businessID: string, cartItems: CartItem[], shippingInfo: ShippingInfo, deliveryMethod: OrderData["deliveryMethod"], deliveryPrice: number) {
        try {
            const orderData = {
                businessID: businessID,
                cartItems: cartItems,
                shippingInfo: shippingInfo,
                deliveryMethod: deliveryMethod,
                deliveryPrice: deliveryPrice
            }
            const createOrder = functions.httpsCallable("createOrder")
            const result = await createOrder(orderData)
            // Delete cart items
            await CustomerFunctions.deleteCartItems(cartItems)
            return result.data as OrderData
        } catch (e) {
            throw e
        }
    }

    public static async cancelOrder(orderID: string, businessID: string) {
        try {
            const cancelOrder = functions.httpsCallable("cancelOrder")
            await cancelOrder({
                orderID: orderID,
                businessID: businessID
            })
        } catch (e) {
            throw e
        }
    }

    // Find businesses that match keywords within a certain range
    static async findLocalBusinessesInRange(keywords: string[], location: {latitude: number, longitude: number}, rangeInKm?: number) {
        let tenKeywords = keywords
        if (keywords.length > 10) {
          tenKeywords = keywords.slice(0,10)
        }
        // Get user data to find country to search
        const userDoc = await UserFunctions.getUserDoc()
        const colRef = firestore.collection("publicBusinessData/".concat(userDoc.country).concat("/businesses"))
        const rangeInM = rangeInKm ? rangeInKm * 1000 : 50000
        let currentLoc = [location.latitude, location.longitude]
        // Get query bounds
        const bounds = geofire.geohashQueryBounds(currentLoc, rangeInM)
        // Get query promises
        let promises = []
        for (const bound of bounds) {
          const query = colRef
            .orderBy('geohash')
            .startAt(bound[0])
            .endAt(bound[1])
            .where("keywords", "array-contains-any", tenKeywords)
            .where("isValid", "==", true)
            .limit(10)
          promises.push(query.get())
        }
        // Filter out false positives
        const matchingBusinesses: PublicBusinessData[] = []
        const querySnapshots = await Promise.all(promises)
        querySnapshots.forEach((querySnap) => {
          querySnap.docs.forEach((docSnap) => {
            // Get data as public business data
            const publicData = docSnap.data() as PublicBusinessData
            // Check if the business's location is within range
            if (publicData.coords!.latitude && publicData.coords!.longitude) {
              const distanceInKm = geofire.distanceBetween([publicData.coords!.latitude, publicData.coords!.longitude], currentLoc);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= rangeInM) {
                matchingBusinesses.push(publicData);
              }
            }
          })
        })
        return matchingBusinesses
      }
}