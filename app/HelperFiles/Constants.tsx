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


/*
export const createNewBusiness = async (email: string, password: string, businessInfo: PublicBusinessData) => {
  return await auth.createUserWithEmailAndPassword(email, password).then(async (cred) => {
    if (cred.user === null) {
      console.error("Failed to create new business.");
      return false;
    }
    const formattedCountry = businessInfo["country"].toLowerCase().replace(/\s+/g, "_").replace(/\W+/g, "");
    const formattedRegion = businessInfo["region"] ? businessInfo["region"].toLowerCase().replace(/\s+/g, "_").replace(/\W+/g, "") : null;
    const formattedCity = businessInfo["city"].toLowerCase().replace(/\s+/g, "_").replace(/\W+/g, "");
    let cityCollection = firestore.collection("/publicbusinessData/" + formattedCountry + "/regions/" + formattedRegion + "/cities/" + formattedCity + "/ids");
    return await ServerData.addDocument(businessInfo, cityCollection, cred.user.uid).catch((e) => {throw e});
  })
}*/

export const isProductOption = (input: any): boolean => {
  if (input === undefined || input === null) {
    return false;
  }
  console.log(input)
  // Create a schema of a ProductOption object
  const optionSchema: Record<"name" | "priceChange" | "image", string> = {
    name: "string",
    priceChange: "number",
    image: "string"
  }
  let isValid = true;
  // If any property doesn't exist, stop iterating and return
  for (const key in optionSchema) {
    if (input[key] === undefined || input[key] === null) {
      console.log(key)
      isValid = false;
      break;
    }
  }
  return isValid;
}

export const isProductOptionType = (input: any): boolean => {
  if (input === undefined || input === null) {
    return false;
  }
  // Create a schema of a ProductOptionType object
  const optionTypeSchema: Record<"name" | "options", string> = {
    name: "string",
    options: "object[]"
  }
  let isValid = true;
  // If any property doesn't exist, stop iterating and return
  for (const key in optionTypeSchema) {
    // Check if the property exists
    if (input[key] === undefined || input[key] === null) {
      isValid = false;
      break;
    }
    if (key === "options") {
      const options = input[key] as ProductOption[]
      const invalidOptions = options.filter((option) => !isProductOption(option));
      if (invalidOptions.length !== 0) {
        isValid = false;
        break;
      }
    }
  }
  return isValid;
}

export const isProductData = (input: any): boolean => {
  if (input === undefined || input === null) {
    return false;
  }
  // Create a schema of a ProductData object
  const productSchema: Record<keyof ProductData, string> = {
    businessID: "string",
    category: "string",
    name: "string",
    price: "number",
    description: "string",
    images: "string[]",
    optionTypes: "object[]",
    ratings: "number[]",
    extraInfo: "string"
  }
  let isValid = true;
  // If any property doesn't exist, stop iterating and return
  for (const key in productSchema) {
    // Check if the property exists
    if (input[key] === undefined || input[key] === null) {
      isValid = false;
      break;
    }
    if (key === "optionTypes") {
      const optionTypes = input[key] as ProductOptionType[];
      const invalidOptionTypes = optionTypes.filter((optionType) => !isProductOptionType(optionType));
      if (invalidOptionTypes.length !== 0) {
        isValid = false;
        break;
      }
    }
  }
  return isValid;
}

export const isProductCategory = (input: any): boolean => {
  // Check if the category exists
  if (input === undefined || input === null) {
    return false;
  }
  console.log(input)
  // Create a schema of a ProductCategory object
  const categorySchema: Record<keyof ProductCategory, string> = {
    category: "string",
    products: "ProductData[]"
  }
  let isValid = true;
  // If any property doesn't exist, stop iterating and return
  for (const key in categorySchema) {
    // Check if the property exists on the input
    if (input[key] === undefined || input[key] === null) {
      console.log(key);
      isValid = false;
      break;
    }
    if (key === "products") {
      const products = input[key] as ProductData[];
      const invalidProducts = products.filter((product) => !isProductOptionType(product));
      if (invalidProducts.length !== 0) {
        console.log(key);
        isValid = false;
        break;
      }
    }
  }
  return isValid;
}

export const isProductList = (input: any): boolean => {
  const productList = input as ProductCategory[]
  // Check if the array exists
  if (input === undefined || input === null) {
    return false;
  }
  let isValid = true;
  for (const index in productList) {
    const isCategory = isProductCategory(productList[index]);
    if (!isCategory) {
      isValid = isCategory;
      break;
    }
  }
  return isValid;
}

export const isBusinessInfo = (input: any): boolean => {
  // Create a schema of a PublicBusinessData object
  const infoSchema: Record<keyof PublicBusinessData, string> = {
    userID: "string",
    businessID: "string",
    name: "string",
    profileImage: "string",
    galleryImages: "string[]",
    businessType: "string",
    totalRating: "number",
    description: "string",
    address: "string",
    city: "string",
    region: "string",
    country: "string",
    postalCode: "string",
    keywords: "string[]"
  }
  let isValid = true;
  // If any property doesn't exist, stop iterating and return
  for (const key in infoSchema) {
    if (input[key] === undefined || input[key] === null) {
      isValid = false;
      break;
    }
  }
  return isValid;
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

const product: ProductData = {
  "businessID": "eCHvdt5OwSpxphawLMaW",
  "category": "Coffee",
  "name": "Coffee",
  "description": "A freshly brewed coffee that you can enjoy throughout the day. In 2008 our master blenders and roasters created this for you — a smooth, well-rounded blend of Latin American coffees with subtly rich flavors of chocolate and toasted nuts, it’s served fresh every day.",
  "price": 2.99,
  "images": [
    "https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG",
    "https://post.healthline.com/wp-content/uploads/2020/08/ways-to-make-coffee-super-healthy-1200x628-facebook-1200x628.jpg",
    "https://loseitblog.com/wp-content/uploads/2019/01/Coffee-Islamorada-.png",
    "https://cdn.cancercenter.com/-/media/ctca/images/others/blogs/2019/01-january/01-blog-coffee-l.jpg"
  ],
  "optionTypes": [
    {
      "name": "Size",
      "options": [{
          "name": "Small",
          "priceChange": -1,
          "image": ""
        }, {
          "name": "Medium",
          "priceChange": 0,
          "image": ""
        }, {
          "name": "Large",
          "priceChange": 1,
          "image": ""
        }]
    }, {
      "name": "Roast",
      "options": [{
          "name": "Light",
          "priceChange": 0,
          "image": ""
        }, {
          "name": "Medium",
          "priceChange": 0,
          "image": ""
        }, {
          "name": "Dark",
          "priceChange": 0,
          "image": ""
        }]
    }
  ],
  "ratings": [17,3,56,117,83],
  "extraInfo": "May contain milk."
}

//addProduct(product, "eCHvdt5OwSpxphawLMaW")