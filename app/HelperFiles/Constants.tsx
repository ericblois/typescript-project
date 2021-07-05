import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import PropTypes from 'prop-types';
import { Image } from "react-native";
import {ProductData, ProductOption, ProductOptionType, ProductCategory, PublicBusinessData } from "./DataTypes"

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

export const auth = firebase.default.auth();

export const firestore = firebase.default.firestore();

export const storage = firebase.default.storage();

export const businessDB = firestore.collection("businesses");

const pluralize = require("pluralize");
// Splits a string into individual query terms
export const getQueryTerms = (searchText: string) => {
  // Convert the search text to lowercase, and remove any apostrophes
  let formattedSearch = searchText.toLowerCase().replace(/’+|'+/gi, "");
  // Seperate the search string into its individual words, based on any non-word characters (anything that isn't 0-9, a-z, A-Z, or _)
  let strings = formattedSearch.split(/\W+/g);
  // Convert plural words into their singular form
  let keywords: string[] = [];
  strings.forEach((string) => {
    let singular: string = pluralize.singular(string);
    if (!(keywords.includes(singular))) {
      keywords.push(singular);
    }
  })
  return keywords;
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

// List of cached image URLs
let cachedImages: string[] = [];

// Prefetch the images before rendering the page, and cache them for later use
export const prefetchImages = async (urlArray: string[]) => {
    let unfetchedURLs: string[] = [];
    //Check if images have already been prefetched
    urlArray.forEach((url) => {
      if (!cachedImages.includes(url)) {
        unfetchedURLs.push(url);
      }
    })
    
    // Get array of prefetch tasks for each image URL
    const prefetchTasks = unfetchedURLs.map((url) => {
        // Attempt to prefetch the URL, if it fails then print the error message
        return Image.prefetch(url).catch((e) => console.error(e));
    })
    // Check if all images were successfully downloaded / prefetched
    await Promise.all(prefetchTasks).then((results) => {
        let downloadedAll = true;
        let failCount = 0;
        // Add successful prefetches to the cahed URLs, count failures
        results.forEach((result, index) => {
            if (!result) {
                downloadedAll = false;
                failCount++;
            } else {
              cachedImages.push(unfetchedURLs[index])
            }
        })
        if (downloadedAll) {
            console.log("All images were fetched.");
        } else {
            console.log(failCount.toString() + "/" + unfetchedURLs.length.toString() + " images failed to prefetch");
        }
  })
}

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