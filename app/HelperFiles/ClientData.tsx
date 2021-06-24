import * as ImagePicker from 'expo-image-picker';

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