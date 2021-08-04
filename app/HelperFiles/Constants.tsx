import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import PropTypes from 'prop-types';
import { Image } from "react-native";
import * as geofireSource from "geofire-common"
//import * as functionsSource from "firebase-functions"
//import * as adminSource from "firebase-admin"
import "firebase/functions";

//const functionsSource = require("firebase-functions")

export const locationDocString = "/publicBusinessData/canada/regions/quebec/cities/montreal"

export const googleAPIKey = "AIzaSyCaUD7QSZ1d_Mo4ygBA0BhMp7DYMIlu2vo";

export const firebaseConfig = {
  apiKey: "AIzaSyBb7qoF1YQEAcovFU93LfVOI_JEFxPqB7o",
  authDomain: "testproject-7e9fe.firebaseapp.com",
  databaseURL: "https://testproject-7e9fe.firebaseio.com",
  projectId: "testproject-7e9fe",
  storageBucket: "testproject-7e9fe.appspot.com",
  messagingSenderId: "608655605733",
  appId: "1:608655605733:web:1b1ac787f3eb724dcc390c",
  measurementId: "G-2BEXHVGXH8"
}

const firebaseAppName = "TestApp"

// Initialize Firebase
if (!firebase.default.apps.length) {
    firebase.default.initializeApp(firebaseConfig);
}
// The Firebase Admin SDK to access Firestore.
//export const admin = adminSource

//export const functions = functionsSource

export const auth = firebase.default.auth();

export const firestore = firebase.default.firestore();
// Set firestore cache to 256 MB
firestore.settings({
  cacheSizeBytes: 1024*1024*256
})

export const storage = firebase.default.storage();

export const functions = firebase.default.functions();

export const geofire = geofireSource



export const currencyFormatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD"
  } as Intl.NumberFormatOptions
)

export const getPublicBusinessRef = (country: string, businessID: string) => {
  return firestore.doc(`/publicBusinessData/${country}/businesses/${businessID}`)
}

export const getPrivateBusinessRef = (businessID: string) => {
  return firestore.doc(`/privateBusinessData/${businessID}`)
}

export const businessPropType = PropTypes.shape({
  "id": PropTypes.string.isRequired,
  "name": PropTypes.string.isRequired,
  "profileImage": PropTypes.string.isRequired,
  "galleryImages": PropTypes.arrayOf(PropTypes.string).isRequired,
  "businessType": PropTypes.string.isRequired,
  "totalRating": PropTypes.number.isRequired,
  "description": PropTypes.string.isRequired,
  "address": PropTypes.string.isRequired,
  "city": PropTypes.string.isRequired,
  "region": PropTypes.string.isRequired,
  "postalCode": PropTypes.string.isRequired,
});

export const productPropType = PropTypes.shape({
  "name": PropTypes.string.isRequired,
  "description": PropTypes.string.isRequired,
  "price": PropTypes.number.isRequired,
  "images": PropTypes.arrayOf(PropTypes.string).isRequired,
  "optionTypes": PropTypes.arrayOf(PropTypes.shape({
    "name": PropTypes.string.isRequired,
    "selections": PropTypes.arrayOf(PropTypes.shape({
      "name": PropTypes.string.isRequired,
      "priceChange": PropTypes.number.isRequired,
      "image": PropTypes.string
    }))
  })),
  "ratings": PropTypes.arrayOf(PropTypes.number).isRequired,
  "extraInfo": PropTypes.string.isRequired
})

export const formatText = (string: string) => {
  // Replace newline characters with actual newlines
  return string.replace(/\\n/g, "\n")
}

export const currency = "$";

export const regionCodes = {
  "Ontario": "ON",
  "Quebec": "QC",
  "British Columbia": "BC",
  "Alberta": "AB",
  "Manitoba": "MB",
  "Saskatchewan": "SK",
  "Nova Scotia": "NS",
  "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL",
  "Prince Edward Island": "PE",
  "Northwest Territories": "NT",
  "Nunavut": "NU",
  "Yukon": "YT"
}