import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, Image, StyleSheet, FlatList, Text, ImageStyle, ViewStyle, TouchableWithoutFeedback } from "react-native";
import { icons, styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import IconButton from "./IconButton";
import { accessPhotos, getCompressedImage } from "../HelperFiles/ClientFunctions"
import * as ImagePicker from 'expo-image-picker';
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { TouchableOpacity } from "react-native-gesture-handler";
import GradientView from "./GradientView";

type ImageInfo = {
    uri: string,
    ratio: number
}

type Props = {
    uris: string[],
    style?: ViewStyle,
    onImagesLoaded?: () => void,
}

type State = {
    showGalleryIcon: boolean,
    images: ImageInfo[],
    galleryHeight: number,
}

export default class ImageSlider extends CustomComponent<Props, State> {

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
            galleryHeight: styleValues.winHeight / 4
        }
        this.loadCount = 0
    }
    componentDidMount() {
        if (this.props.uris.length === 0 && this.props.onImagesLoaded) {
            this.props.onImagesLoaded()
        }
    }
    // Format the gallery height to match the aspect ratio of the first gallery image (run callback on completion)
    setGalleryHeight() {
        // Get ratio of first image
        let ratio = this.state.images.length > 0 ? this.state.images[0].ratio : 2
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
                <View style={{
                    ...defaults.smallShadow,
                    marginVertical: styleValues.mediumPadding
                    }}>
                    <Image
                        source={{uri: item.uri}}
                        resizeMethod={"scale"}
                        resizeMode={"cover"}
                        style={{
                            width: item.ratio * this.state.galleryHeight,
                            height: this.state.galleryHeight,
                            borderRadius: styleValues.mediumPadding,
                        }}
                        onLoadEnd={() => {
                            if (this.props.onImagesLoaded) {
                                this.loadCount += 1
                                if (this.loadCount === this.state.images.length) {
                                    this.props.onImagesLoaded()
                                    this.loadCount = 0
                                }
                            }
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderGallery() {
        const imagesToRender = this.state.images
        if (imagesToRender.length > 0) {
            return (
                <FlatList
                    style={[styles.gallery]}
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
                    <Text style={{...textStyles.small, ...{
                        color: colors.darkColor
                    }}}>
                        There are no images to show.
                    </Text>
                </View>
                </View>
            )
        }
    }

    render() {
        if (this.props.uris.length > 0) {
            return (
                <View 
                    style={{...{
                        width: styleValues.winWidth,
                    }, ...this.props.style}}
                >
                    {this.renderGallery()}
                    <GradientView horizontal/>
                    {this.props.children}
                </View>
            );
        } else {
            return null
        }
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