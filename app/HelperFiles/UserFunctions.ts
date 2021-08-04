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
            return {...userData} as UserData
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
            const deleteBusiness = functions.httpsCallable("deleteBusiness")
            return (await deleteBusiness({businessID: businessID})).data
        } catch (e) {
            throw e
        }
    }
}