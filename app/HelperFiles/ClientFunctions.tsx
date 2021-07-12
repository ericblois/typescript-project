import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator"
import { Image } from "react-native"
import * as keyword_extractor from "keyword-extractor"

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
            //console.log("All images were fetched.");
        } else {
            console.log(failCount.toString() + "/" + unfetchedURLs.length.toString() + " images failed to prefetch");
        }
  })
}
// Request access to the photo library and open it
export async function accessPhotos(options?: ImagePicker.ImagePickerOptions) {
    let requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync().catch((e) => {throw e})
    if (requestResult.granted) {
        let permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync().catch((e) => {throw e})
        if (permissionResult.granted) {
            // Default options for image picker
            let imageOptions: ImagePicker.ImagePickerOptions = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            }
            // Add any modified options
            imageOptions = options ? {...imageOptions, ...options} : imageOptions
            // Get images
            let imageResult = await ImagePicker.launchImageLibraryAsync(imageOptions)
            if (!imageResult.cancelled) {
                return imageResult.uri
            }
        }
    }
}
// Get a smaller version of an image
export async function getCompressedImage(uri: string, onSuccess?: (uri: string) => void) {
    Image.getSize(uri, async (width, height) => {
        // Resize the image if it is too large
        let actions: ImageManipulator.Action[] = []
        if (width > 1024) {
            actions = [{resize: {width: 1024}}]
        } else if (height > 1024) {
            actions = [{resize: {height: 1024}}]
        }
        // Compress the image
        const compressedImg = await ImageManipulator.manipulateAsync(uri, actions, {
            compress: 0.6,
            format: ImageManipulator.SaveFormat.JPEG
        })
        const result = compressedImg.uri
        if (onSuccess) {
            onSuccess(result)
        }
    })
}
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
// Extracts keywords from a string
export function extractKeywords(text: string) {
    const result = keyword_extractor.default.extract(text, {
        language: "english",
        remove_digits: true,
        remove_duplicates: true,
        return_changed_case: true,
    })
    return result
}