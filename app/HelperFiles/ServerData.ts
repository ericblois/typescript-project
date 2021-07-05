import { auth, firestore, locationDocString, storage } from "./Constants";
import { UserData, PrivateBusinessData } from "./DataTypes";
import RNFetchBlob from 'rn-fetch-blob'
import { Platform } from "react-native";

export default class ServerData {

    // Get a document from a collection
    static getDoc = async (docRef: firebase.default.firestore.DocumentReference) => {
      try {
        // Get snapshot
        const docSnap = await docRef.get();
        const data = docSnap.data()!
        return data
      } catch (e) {
        throw e;
      }
    }
    // Add a document to a collection, optionally with a custom ID
    static addDoc = async (data: object, destinationCol: firebase.default.firestore.CollectionReference, docID?: string) => {
      try {
        // Check if there is a specific doc ID to be made
        if (docID) {
          // Get a snapshot of the new location for the document
          const newDocSnap = await destinationCol.doc(docID).get();
          // Check if no document with the same ID exists in the collection
          if (!newDocSnap.exists) {
            // Create a new document with the specified ID
            await destinationCol.doc(docID).set(data);
            return destinationCol.doc(docID);
          }
        }
        // Add a document with a new ID to the collection
        return await destinationCol.add(data)
      } catch (e) {
        throw e;
      }
    }
    // Delete a document from a collection
    static deleteDoc = async (targetDoc: firebase.default.firestore.DocumentReference) => {
      try {
        await targetDoc.delete()
      } catch (e) {
        throw e;
      }
    }
    // Overwrite an existing document
    static overwriteDoc = async (data: object, docRef: firebase.default.firestore.DocumentReference) => {
      try {
        // Write the document to the collection
        const result = await docRef.set(data);
      } catch (e) {
        throw e;
      }
    }
    // Overwrite an existing document
    static updateDoc = async (data: object, docRef: firebase.default.firestore.DocumentReference) => {
      try {
        // Write the document to the collection
        const result = await docRef.update(data)
      } catch (e) {
        throw e;
      }
    }
    // Move a document to a new collection
    static moveDoc = async (sourceDoc: firebase.default.firestore.DocumentReference, destinationCol: firebase.default.firestore.CollectionReference) => {
      try {
        const docSnap = await sourceDoc.get()
        // Check if document exists
        if (!docSnap.exists) {
          throw new Error("Could not find a document at location: " + sourceDoc);
        }
        const data = docSnap.data() as firebase.default.firestore.DocumentData;
        const docRef = await ServerData.addDoc(data, destinationCol, sourceDoc.id)
        await sourceDoc.delete();
        return docRef;
      } catch (e) {
        throw e;
      }
    }
    // Create a new user from a UserData object, returns UserCredential
    static createNewUser = async (email: string, pass: string, userData: UserData) => {
      try {
        // Create a new user account using email
        const cred = await auth.createUserWithEmailAndPassword(email, pass)
        // Add name to user account
        cred.user?.updateProfile({ displayName: userData.name })
        // Create a new user document
        const userDataCol = firestore.collection("/userData");
        const userDoc = await ServerData.addDoc(userData, userDataCol, cred.user?.uid)
        // Return the user document's reference
        return cred;
      } catch (e) {
        throw e;
      }
    }

    static queryBusinesses = async (searchTerms: string[]) => {
      try {
        // Get the city's collection of business references
        const cityCol = firestore.collection(locationDocString + "/ids");
        // Get all business references matching the query terms
        const queryResults = await cityCol.where('keywords', 'array-contains-any', searchTerms).get();
        // Create a list of PrivateBusinessData objects
        const businesses: PrivateBusinessData[] = [];
        queryResults.forEach((refSnap) => {
          businesses.push(BusinessDataHandler.create(refSnap.id, refSnap));
        })
        return businesses;
      } catch (e) {
        throw e;
      }
    }

    static async uploadFile(localDataPath: string, serverPath: string) {
      try {
        const fileURI = Platform.OS === "ios" ? localDataPath.replace("file://", "") : localDataPath
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob
        RNFetchBlob.
        fs.readFile(fileURI, "base64").then((value) => {
          return Blob.
        })
        const targetRef = storage.ref(serverPath)
        const response = await RNFetchBlob.fetch("GET", localDataPath)
        const blob = await response.base64()
        const task = await targetRef.put(file).catch((e) => {throw e})
        return task
      } catch (e) {
        throw e
      }
    }
}