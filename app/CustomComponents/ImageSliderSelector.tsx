import React, { Component } from "react";
import { View, Image, StyleSheet, FlatList, Text, ImageStyle } from "react-native";
import { icons, styleValues } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import IconButton from "../CustomComponents/IconButton";
import { accessPhotos } from "../HelperFiles/ClientData"
import * as ImagePicker from 'expo-image-picker';

type ImageInfo = {
    uri: string,
    ratio: number
}

type Props = {
    uris: string[],
    loadResponse?: () => void,
}

type State = {
    showGalleryIcon: boolean,
    images: ImageInfo[],
    galleryHeight: number
}

export default class ImageSliderSelector extends Component<Props, State> {

    prevImages: string[] = []

    galleryHeight: number = styleValues.winHeight / 4

    constructor(props: Props) {
        super(props)
        this.state = {
            showGalleryIcon: true,
            images: new Array<ImageInfo>(props.uris.length),
            galleryHeight: styleValues.winHeight / 4
        }
    }

    componentDidMount() {
        this.setGalleryHeight()
        this.setInitialRatios(this.props.uris)
        //this.setInitialImages(this.props.uris)
    }

    componentDidUpdate() {
        /*
        // Check if first element has changed
        if (this.state.uris.length > 0 && this.prevImages.length > 0 && this.state.uris[0] !== this.prevImages[0]) {
            this.setGalleryHeight()
            this.prevImages = this.state.uris
            return
        }
        // Check if lengths differ
        if (this.state.uris.length !== this.prevImages.length) {
            this.setGalleryHeight()
            this.prevImages = this.state.uris
            return
        }
        */
    }
    // Append an image to the end of the selector
    addImage(uri: string) {
        // Get current URIs
        let currentImages = this.state.images;
        // Create a new image component
        Image.getSize(uri, (height, width) => {
            const ratio = height / width
            // Check if this is the first image to be added
            if (currentImages.length === 0) {
                // Update the gallery height
                let galleryHeight = (styleValues.winWidth - styleValues.mediumPadding*2) / ratio
                if (galleryHeight / styleValues.winHeight > 0.4) {
                    galleryHeight = 0.4 * styleValues.winHeight
                } else if (galleryHeight / styleValues.winHeight < 0.2) {
                    galleryHeight = 0.2 * styleValues.winHeight
                }
                this.galleryHeight = galleryHeight
            }
            currentImages.push({uri: uri, ratio: ratio})
            // Update the URIs and images
            this.setState({images: currentImages})
        })
    }
    // Remove an image based on its index
    removeImage(index: number) {
        // Get current images
        let currentImages = this.state.images
        currentImages.splice(index, 1)
        // Update gallery height
        if (index === 0 && currentImages.length > 0) {
            const ratio = currentImages[0].ratio
            let galleryHeight = (styleValues.winWidth - styleValues.mediumPadding*2) / ratio
            if (galleryHeight / styleValues.winHeight > 0.4) {
                galleryHeight = 0.4 * styleValues.winHeight
            } else if (galleryHeight / styleValues.winHeight < 0.2) {
                galleryHeight = 0.2 * styleValues.winHeight
            }
            this.galleryHeight = galleryHeight
        }
        // Update URIs and images
        this.setState({images: currentImages})
    }
    // Get the images of the initial images
    setInitialRatios(uris: string[]) {
        let images: ImageInfo[] = uris.map((uri) => {
            return {uri: uri, ratio: -1}
        })
        uris.forEach((uri, index) => {
            Image.getSize(uri, (width, height) => {
                images[index] = {uri: uri, ratio: height / width}
                let isFinal = true
                images.forEach((info) => {
                    if (info.ratio === -1) {
                        isFinal = false
                    }
                })
                if (isFinal) {
                    this.setState({images: images})
                }
            })
        })
    }
    /*
    // Generate image components for a list of URIs
    setInitialImages(uris: string []) {
        let imageComps = new Array<JSX.Element>(uris.length);
        uris.forEach((uri, index) => {
            Image.getSize(uri, (height, width) => {
                const ratio = height / width
                const imageComp = this.renderImage(uri, ratio)
                imageComps[index] = imageComp
                // Check if this is the last image element to be created
                let lastImage = true
                imageComps.forEach((element) => {
                    if (element === undefined) {
                        lastImage = false
                    }
                })
                if (lastImage) {
                    this.setState({uris: uris, images: imageComps})
                }
            })
        })
    }
    */
    // Format the gallery height to match the aspect ratio of the first gallery image (run callback on completion)
    setGalleryHeight(uri?: string) {
        if (uri) {
            Image.getSize(uri, (width, height) => {
                // --- IMPORTANT: iOS gives width as height and vice versa ---
                const ratio = height / width
                let galleryHeight = (styleValues.winWidth - styleValues.mediumPadding*2) * ratio
                if (galleryHeight / styleValues.winHeight > 0.4) {
                    galleryHeight = 0.4 * styleValues.winHeight
                } else if (galleryHeight / styleValues.winHeight < 0.2) {
                    galleryHeight = 0.2 * styleValues.winHeight
                }
                this.galleryHeight = galleryHeight
            })
        } else {
            this.galleryHeight = styleValues.winHeight / 4
        }
    }

    renderImage(uri: string, ratio: number) {
        return (
            <View>
                <Image
                    source={{uri: uri}}
                    resizeMethod={"scale"}
                    resizeMode={"cover"}
                    style={{width: ratio * this.galleryHeight, height: this.galleryHeight, borderRadius: styleValues.mediumPadding,}}
                />
                {/* Add a delete button */}
                <IconButton
                    iconSource={icons.minus}
                    buttonStyle={{
                        position: "absolute",
                        width: styleValues.iconSmallSize,
                        height: styleValues.iconSmallSize,
                        margin: styleValues.mediumPadding,
                        top: 0,
                        right: 0,
                    }}
                    iconStyle={{
                        tintColor: styleValues.whiteColor
                    }}
                    buttonFunc={() => {
                        // Find this image's index in the array and delete it
                        const uriIndex = this.state.images.findIndex((imageInfo) => {
                            return imageInfo.uri === uri
                        })
                        this.removeImage(uriIndex)
                    }}
                />
            </View>
        )
    }

    renderGallery() {
        if (this.state.images.length > 0) {
            return (
                <FlatList
                style={[styles.gallery, {height: this.galleryHeight}]}
                data={this.state.images}
                keyExtractor={(item, index) => index.toString()}
                onScroll={(event) => {
                    this.setState({showGalleryIcon: event.nativeEvent.contentOffset.x == 0});
                }}
                ListFooterComponent={<View style={{width: styleValues.mediumPadding}}/>}
                ItemSeparatorComponent={() => <View style={{width: styleValues.mediumPadding}}/>}
                renderItem={({item}) => {
                    return this.renderImage(item.uri, item.ratio)
                }}
                horizontal={true}
                extraData={this.state}
                />
            )
        } else {
            return (
                <View style={[styles.gallery, {
                    height: this.galleryHeight,
                    backgroundColor: styleValues.lightColor,
                    borderWidth: styleValues.minorBorderWidth,
                    borderRadius: styleValues.bordRadius,
                    borderColor: styleValues.darkColor,
                    alignItems: "center",
                    justifyContent: "center"
                }]}>
                    <Text style={{
                        color: styleValues.darkColor,
                        fontSize: styleValues.smallerTextSize
                    }}>
                        There are no images to show.
                    </Text>
                </View>
            )
        }
    }

    // Render the gallery icon that shows when there are multiple images in the gallery
    renderGalleryIcon() {
        if (this.state.showGalleryIcon) {
            return (
                <Image 
                    style={[styles.headerIcon, {}]}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                    source={require("../../assets/stackedSquares.png")}
                />
            )
        }
    }

    renderAddButton() {
        return (
            <IconButton
                iconSource={icons.plus}
                buttonStyle={styles.imageSelectButton}
                iconStyle={{tintColor: styleValues.whiteColor}}
                buttonFunc={async () => {
                    const result = await accessPhotos()
                    if (result) {
                        this.addImage(result!)
                    }
                }}
            />
        )
    }

    render() {
        return (
            <View style={{width: "100%", height: this.galleryHeight, marginBottom: styleValues.mediumPadding}}>
                {this.renderGallery()}
                {this.renderGalleryIcon()}
                {this.renderAddButton()}
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    gallery: {
        width: "100%",
    },
    imageSelectButton: {
        width: styleValues.iconLargeSize,
        height: styleValues.iconLargeSize,
        position: "absolute",
        margin: styleValues.mediumPadding,
        bottom: 0,
        left: 0,
    },
    headerIcon: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: styleValues.mediumPadding,
        width: styleValues.iconMediumSize,
        height: styleValues.iconMediumSize,
        opacity: 0.75
    },
    photo: {
        
    }
});