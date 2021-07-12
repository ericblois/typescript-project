import { auth, firestore } from "./Constants"
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
        } catch (e) {
            throw e
        }
    }
    // Create a new business, returns business ID
    static async createNewBusiness() {
        try {
            // Get user's data
            const userData = (await UserFunctions.getUserDoc()) as UserData
            const userID = UserFunctions.getCurrentUser().uid
            // Create initial private business data
            let privateBusinessData: PrivateBusinessData = {...DefaultPrivateBusinessData, ...{
                userID: userID,
                country: userData.country
            }}
            // Create a new document for the private data
            const privateDocPath = "/userData/".concat(userID).concat("/businesses")
            const privateColRef = firestore.collection(privateDocPath)
            const privateDocRef = await ServerData.addDoc(privateBusinessData, privateColRef)

            const businessID = privateDocRef.id
            // Update private doc with business ID
            ServerData.updateDoc({businessID: businessID}, privateDocRef)
            // Create a new document for the public data
            let publicBusinessData: PublicBusinessData = {...DefaultPublicBusinessData, ...{
                userID: userID,
                businessID: businessID,
                country: userData.country
            }}
            const publicDocPath = "/publicBusinessData/".concat(userData.country).concat("/businesses")
            const publicColRef = firestore.collection(publicDocPath)
            const publicDocRef = await ServerData.addDoc(publicBusinessData, publicColRef, businessID)

            let newBusinessIDs = userData.businessIDs
            newBusinessIDs.push(businessID)
            await UserFunctions.updateUserDoc({businessIDs: newBusinessIDs})

            return businessID
        } catch(e) {
            throw e;
        }
    }
    // Delete a business
    static async deleteBusiness(businessID: string) {
        try {
            // Get user's data
            const userData = (await UserFunctions.getUserDoc()) as UserData
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
            await ServerData.deleteCollection(productsColRef)
            // Delete private and public data docs
            await ServerData.deleteDoc(privateDocRef)
            await ServerData.deleteDoc(publicDocRef)
            // Delete business ID from user's business ID's
            let newBusinessIDs = userData.businessIDs
            const businessIndex = newBusinessIDs.indexOf(businessID)
            newBusinessIDs.splice(businessIndex, 1)
            await UserFunctions.updateUserDoc({businessIDs: newBusinessIDs})
            return businessID
        } catch(e) {
            throw e;
        }
    }
}