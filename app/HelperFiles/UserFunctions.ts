import { auth, firestore } from "./Constants"
import { PrivateBusinessData, PublicBusinessData, UserData } from "./DataTypes"
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
    // Create a new business, returns business id
    static async createNewBusiness(country: string) {
        try {
            // Get user's data
            const userData = (await UserFunctions.getUserDoc()) as UserData
            const userID = UserFunctions.getCurrentUser().uid
            // Create initial private business data
            let privateBusinessData: PrivateBusinessData = {
                userID: userID,
            }
            // Create a new document for the private data
            const privateDocPath = "/userData/".concat(userID).concat("/businesses")
            const privateColRef = firestore.collection(privateDocPath)
            const privateDocRef = await ServerData.addDoc(privateBusinessData, privateColRef)

            const businessID = privateDocRef.id
            // Create a new document for the public data
            let publicBusinessData: PublicBusinessData = {
                id: businessID,
                country: country
            }
            const publicDocPath = "/publicBusinessData/".concat(userData.country).concat("/businesses")
            const publicColRef = firestore.collection(publicDocPath)
            const publicDocRef = await ServerData.addDoc(publicBusinessData, publicColRef, businessID)

            let newBusinessIDs = userData.businessIDs
            newBusinessIDs.push(businessID)
            UserFunctions.updateUserDoc({businessIDs: newBusinessIDs})

            return businessID
        } catch(e) {
            throw e;
        }
    }
}