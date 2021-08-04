import { auth, firestore, geofire, locationDocString, storage } from "./Constants";
import { UserData, PrivateBusinessData, PublicBusinessData } from "./DataTypes";
import RNFetchBlob from 'rn-fetch-blob'
import { Platform } from "react-native";
import UserFunctions from "./UserFunctions";

export default class ServerData {

    // Get a document from a collection
    static getDoc = async (docRef: firebase.default.firestore.DocumentReference) => {
      try {
        // Get snapshot
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          throw new Error(`Could not find document at path: ${docRef.path}`)
        }
        const data = docSnap.data()
        if (!data) {
          throw new Error(`Could not find document at path: ${docRef.path}`)
        }
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
    static async deleteCollection(targetCol: firebase.default.firestore.CollectionReference) {
      try {
        const collection = await targetCol.get()
        const promises = await Promise.all(collection.docs.map((docSnap) => {
          return ServerData.deleteDoc(docSnap.ref)
        }))
      } catch (e) {
        throw e
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
    // Uploads a file then returns the download URL 
    static async uploadFile(localDataPath: string, serverPath: string) {
      try {
        const fileURI = Platform.OS === "ios" ? localDataPath.replace("file://", "") : localDataPath
        const targetRef = storage.ref(serverPath)
        const response = await fetch(fileURI)
        const blob = await response.blob()
        const task = await targetRef.put(blob)
        return (await targetRef.getDownloadURL()) as string
      } catch (e) {
        throw e
      }
    }
    // Deletes a file
    static async deleteFile(downloadURL: string) {
      try {
        const targetRef = storage.refFromURL(downloadURL)
        await targetRef.delete()
      } catch (e) {
        throw e
      }
    }
}