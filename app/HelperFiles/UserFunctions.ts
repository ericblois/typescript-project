import { auth, firestore, functions } from "./Constants"
import { Country, DefaultPrivateBusinessData, DefaultPublicBusinessData, PrivateBusinessData, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"

export default abstract class UserFunctions {

    // Get the account data of the current user
    static getCurrentUser() {
        if (auth.currentUser) {
            return auth.currentUser
        } else {
            throw new Error("Could not retrieve the current user.")
        }
    }
    // Get the data document of the current user
    static async getUserDoc() {
        try {
            const id = UserFunctions.getCurrentUser().uid
            const docPath = "/userData/".concat(id)
            const docRef = firestore.doc(docPath)
            const userData = await ServerData.getDoc(docRef)
            return userData as UserData
        } catch(e) {
            throw e;
        }
    }
    // Update a field in the user's document
    static async updateUserDoc(data: Partial<UserData>) {
        try {
            const id = UserFunctions.getCurrentUser().uid
            const docPath = "/userData/".concat(id)
            const docRef = firestore.doc(docPath)
            await docRef.update(data)
        } catch(e) {
            throw e;
        }
    }
    // Delete the current user
    static async deleteAccount() {
        try {
            const currentUser = UserFunctions.getCurrentUser()
            const userDocRef = firestore.doc("/userData/".concat(currentUser.uid))
            const userDoc = (await userDocRef.get()).data() as UserData
            const deletedBusinesses = await Promise.all(userDoc.businessIDs.map((businessID) => {
                return UserFunctions.deleteBusiness(businessID)
            }))
            await currentUser.delete()
            await ServerData.deleteDoc(userDocRef)
            await firestore.runTransaction(async (transaction) => {
                
            })
        } catch (e) {
            throw e
        }
    }
    // Create a new business, returns business ID
    static async createNewBusiness() {
        try {
            const createNewBusiness = functions.httpsCallable("createNewBusiness")
            return (await createNewBusiness()).data
        } catch (e) {
            throw e
        }
    }
    // Delete a business
    static async deleteBusiness(businessID: string) {
        try {
            // Get user's data
            const userData = (await UserFunctions.getUserDoc())
            const userID = UserFunctions.getCurrentUser().uid
            // Get private data
            const privateDocPath = "/userData/".concat(userID).concat("/businesses/").concat(businessID)
            const privateDocRef = firestore.doc(privateDocPath)
            const privateDocData = (await privateDocRef.get()).data() as PrivateBusinessData
            // Get public data reference
            const publicDocPath = "/publicBusinessData/".concat(privateDocData.country).concat("/businesses/").concat(businessID)
            const publicDocRef = firestore.doc(publicDocPath)
            // Get products collection
            const productsColPath = publicDocPath.concat("/products")
            const productsColRef = firestore.collection(productsColPath)
            const productSnaps = (await productsColRef.get()).docs
            // Get updated business ID's
            let newBusinessIDs = userData.businessIDs
            const businessIndex = newBusinessIDs.indexOf(businessID)
            newBusinessIDs.splice(businessIndex, 1)
            const userDocRef = firestore.doc("userData/".concat(userID))
            await firestore.runTransaction(async (transaction) => {
                // Delete all product docs
                for (const docSnap of productSnaps) {
                    transaction.delete(docSnap.ref)
                }
                // Delete private and public data docs
                transaction.delete(privateDocRef)
                transaction.delete(publicDocRef)
                // Delete business ID from user's business ID's
                transaction.update(userDocRef, {businessIDs: newBusinessIDs})
            })
            return businessID
        } catch(e) {
            throw e;
        }
    }
}