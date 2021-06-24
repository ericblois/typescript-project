import { PrivateBusinessData, PublicBusinessData, UserData } from "./DataTypes"
import ServerData from "./ServerData"
import UserFunctions from "./UserFunctions"
import { firestore } from "./Constants"

export class BusinessFunctions {

    businessID: string

    constructor(businessID: string) {
        this.businessID = businessID
    }

    public async getPrivateData() {
        try {
            const userID = UserFunctions.getCurrentUser().uid
            const privateDocPath = "/userData/".concat(userID).concat("/businesses/").concat(this.businessID)
            const privateDocRef = firestore.doc(privateDocPath)
            const privateData = (await ServerData.getDoc(privateDocRef)) as PrivateBusinessData
            return privateData
        } catch(e) {
            throw e
        }
    }

    public async getPublicData() {
        try {
            const userData = (await UserFunctions.getUserDoc()) as UserData
            const publicDocPath = "/publicBusinessData/".concat(userData.country).concat("/businesses/").concat(this.businessID)
            const publicDocRef = firestore.doc(publicDocPath)
            const publicData = (await ServerData.getDoc(publicDocRef)) as PublicBusinessData
            return publicData
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
}