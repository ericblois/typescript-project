import React, { Component } from "react";
import { View, Image, StyleSheet, FlatList, Text, ImageStyle, ViewStyle, TouchableWithoutFeedback } from "react-native";
import { icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import IconButton from "../CustomComponents/IconButton";
import { accessPhotos, getCompressedImage } from "../HelperFiles/ClientFunctions"
import * as ImagePicker from 'expo-image-picker';
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { TouchableOpacity } from "react-native-gesture-handler";
import GradientView from "../CustomComponents/GradientView";

type ImageInfo = {
    uri: string,
    ratio: number
}

type Props = {
    uris: string[],
    style?: ViewStyle,
    onChange?: (uris: {
        all: string[],
        new: string[],
        deleted: string[]
    }) => void,
    onImagesLoaded?: () => void,
}

type State = {
    showGalleryIcon: boolean,
    images: ImageInfo[],
    newImages: ImageInfo[],
    deletedImages: string[],
    galleryHeight: number,
}

export default class ImageSliderSelector extends Component<Props, State> {

    loadCount: number

    constructor(props: Props) {
        super(props)
        this.state = {
            showGalleryIcon: true,
            images: props.uris.map((uri, index) => {
                Image.getSize(uri, (width, height) => {
                    // --- IMPORTANT: iOS gives width as height and vice versa ---
                    this.state.images[index] = {uri: uri, ratio: width / height}
                    if (index === 0) {
                        this.setGalleryHeight()
                    } else {
                        this.forceUpdate()
                    }
                })
                return {uri: uri, ratio: -1}
            }),
            newImages: [],
            deletedImages: [],
            galleryHeight: styleValues.winHeight / 4
        }
        this.loadCount = 0
    }
    componentDidMount() {
        if (this.props.uris.length === 0 && this.props.onImagesLoaded) {
            this.props.onImagesLoaded()
        }
    }
    // Append an image to the end of the selector
    addImage(uri: string) {
        getCompressedImage(uri, (newURI) => {
            // Create a new image component
            Image.getSize(newURI, (height, width) => {
                const ratio = height / width
                const newImages = this.state.newImages
                newImages.push({uri: newURI, ratio: ratio})
                // Update the URIs and images
                this.setState({newImages: newImages}, () => {
                    // Check if this is the first image to be added
                    if (this.state.images.length === 0 && this.state.newImages.length === 1) {
                        // Update the gallery height
                        this.setGalleryHeight()
                    }
                    if (this.props.onChange) {
                        this.props.onChange({
                            all: this.state.images.map(({uri}) => uri),
                            new: this.state.newImages.map(({uri}) => uri),
                            deleted: this.state.deletedImages
                        })
                    }
                })
            })
        })
    }
    // Remove an image based on its index
    removeImage(uri: string) {
        // Check if gallery's height should be updated
        let updateHeight = false
        // Check gallery images for change
        let currentURIs = this.state.images.map(({uri}) => uri)
        let currentImages = this.state.images
        // Get deleted images
        let deleted = this.state.deletedImages
        let index = currentURIs.indexOf(uri)
        if (index > -1) {
            deleted.push(uri)
            // Update images
            currentImages.splice(index, 1)
        }
        // Update gallery height
        updateHeight = index === 0
        // Update URIs and images
        index = this.state.newImages.map(({uri}) => uri).indexOf(uri)
        let newImages = this.state.newImages
        if (index > -1) {
          newImages.splice(index, 1)
        }
        updateHeight = index === 0 && this.state.images.length === 0
        // Update gallery height
        this.setState({images: currentImages, newImages: newImages, deletedImages: deleted}, () => {
            this.setGalleryHeight()
            if (this.props.onChange) {
                this.props.onChange({
                    all: this.state.images.map(({uri}) => uri),
                    new: this.state.newImages.map(({uri}) => uri),
                    deleted: this.state.deletedImages
                })
            }
        })
    }
    // Format the gallery height to match the aspect ratio of the first gallery image (run callback on completion)
    setGalleryHeight() {
        // Get ratio of first image
        let ratio = this.state.newImages.length > 0 ? this.state.newImages[0].ratio : 2
        ratio = this.state.images.length > 0 ? this.state.images[0].ratio : ratio
        // Set the gallery height
        let galleryHeight = (styleValues.winWidth - styleValues.mediumPadding*2) / ratio
        if (galleryHeight / styleValues.winHeight > 0.4) {
            galleryHeight = 0.4 * styleValues.winHeight
        } else if (galleryHeight / styleValues.winHeight < 0.2) {
            galleryHeight = 0.2 * styleValues.winHeight
        }
        this.setState({galleryHeight: galleryHeight})
    }

    renderImage(item: ImageInfo) {
        return (
            <TouchableWithoutFeedback>
                <View>
                <Image
                    source={{uri: item.uri}}
                    resizeMethod={"scale"}
                    resizeMode={"cover"}
                    style={{width: item.ratio * this.state.galleryHeight, height: this.state.galleryHeight, borderRadius: styleValues.mediumPadding,}}
                    onLoadEnd={() => {
                        if (this.props.onImagesLoaded) {
                            this.loadCount += 1
                            if (this.loadCount === this.state.images.length + this.state.newImages.length) {
                                this.props.onImagesLoaded()
                                this.loadCount = 0
                            }
                        }
                    }}
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
                        tintColor: colors.whiteColor
                    }}
                    buttonFunc={() => {
                        this.removeImage(item.uri)
                    }}
                />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderGallery() {
        const imagesToRender = this.state.images.concat(this.state.newImages)
        if (imagesToRender.length > 0) {
            return (
                <FlatList
                    style={[styles.gallery, {height: this.state.galleryHeight}]}
                    data={imagesToRender}
                    keyExtractor={(item) => (item.uri)}
                    renderItem={({item}) => this.renderImage(item)}
                    horizontal={true}
                    ListHeaderComponent={() => (<View style={{width: styleValues.mediumPadding}}/>)}
                    ListFooterComponent={() => (<View style={{width: styleValues.mediumPadding}}/>)}
                    ItemSeparatorComponent={() => <View style={{width: styleValues.mediumPadding}}/>}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={imagesToRender.length > 1}
                ></FlatList>
            )
        } else {
            return (
                <View style={{marginHorizontal: styleValues.mediumPadding}}>
                <View style={[styles.gallery, {
                    height: this.state.galleryHeight,
                    backgroundColor: colors.lightColor,
                    borderWidth: styleValues.minorBorderWidth,
                    borderRadius: styleValues.bordRadius,
                    borderColor: colors.darkColor,
                    alignItems: "center",
                    justifyContent: "center",
                }]}>
                    <Text style={{
                        color: colors.darkColor,
                        fontSize: styleValues.smallerTextSize
                    }}>
                        There are no images to show.
                    </Text>
                </View>
                </View>
            )
        }
    }

    renderAddButton() {
        return (
            <IconButton
                iconSource={icons.plus}
                buttonStyle={styles.imageSelectButton}
                iconStyle={{tintColor: colors.whiteColor}}
                buttonFunc={async () => {
                    const result = await accessPhotos()
                    if (result) {
                        this.addImage(result)
                    }
                }}
            />
        )
    }

    render() {
        return (
            <View 
                style={{...{
                    width: styleValues.winWidth,
                    height: this.state.galleryHeight,
                    marginBottom: styleValues.mediumPadding
                }, ...this.props.style}}
            >
                {this.renderGallery()}
                <GradientView horizontal/>
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
        left: styleValues.mediumPadding,
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