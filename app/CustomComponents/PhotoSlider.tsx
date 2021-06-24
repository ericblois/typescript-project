import React, { Component } from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import { styleValues } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";

type Props = {
    images: string[],
    loadResponse?: () => void,
}

type State = {
    galleryWidth: number,
    galleryHeight: number,
    showGalleryIcon: boolean,
    imagesLoaded: boolean,
    imagesToLoad: number,
    images: JSX.Element[]  
}

export default class PhotoSlider extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            galleryWidth: styleValues.winWidth - styleValues.mediumPadding*2,
            galleryHeight: 0,
            showGalleryIcon: true,
            imagesLoaded: false,
            imagesToLoad: this.props.imgURLs.length,
            images: new Array(this.props.imgURLs.length)
        }
    }

    componentDidMount() {
        this.loadImages();
    }

    componentWillUnmount() {

    }
    // Create all of the Image components for this photo gallery
    async loadImages() {
        // Find the formatted gallery height
        this.getGalleryHeight(() => {
            // After gallery height is found, load each image
            this.props.imgURLs.forEach((value, index) => {
                // Get the formatted image width
                this.getFormattedWidth(value, (imgWidth: number) => {
                    // If this is the first image, set its width to that of the gallery
                    const width = index == 0 ? this.state.galleryWidth : imgWidth;
                    const currentImages = this.state.images;
                    currentImages[index] = (
                    <Image
                        source={{uri: value}}
                        resizeMethod={"auto"}
                        resizeMode={"cover"}
                        style={{height: this.state.galleryHeight, width: width, borderRadius: styleValues.mediumPadding,}}
                        onLoadEnd={() => {
                            this.setState({imagesToLoad: this.state.imagesToLoad - 1})
                            if (this.state.imagesToLoad <= 0) {
                                this.setState({imagesLoaded: true});
                                if (this.props.loadResponse) {
                                    this.props.loadResponse!();
                                }
                            }
                        }}
                    />);
                    this.setState({images: currentImages});
                })
            })
        })
    }

    // Format the gallery height to match the aspect ratio of the first gallery image (run callback on completion)
    getGalleryHeight(callback: () => void) {
        Image.getSize(
            this.props.imgURLs[0],
            (width, height) => {
                const ratio = width / height;
                let galHeight = this.state.galleryWidth / ratio;
                //Check if this gallery will be taller than the maximum allowed gallery height
                if (galHeight > styleValues.winHeight*0.35) {
                    galHeight = styleValues.winHeight*0.35;
                }
                this.setState({galleryHeight: galHeight}, callback);
            },
            (e) => {
                console.error(e);
            }
        )
    }
    // Get the formatted widths of each image to fit the screen size and gallery height
    getFormattedWidth(url: string, callback: (imgWidth: number) => void) {
        Image.getSize(
            url,
            (width, height) => {
                const imgWidth = this.state.galleryHeight * width / height;
                callback(imgWidth);
            }, (e) => {
                console.error(e);
            }
        )
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

    render() {
        return (
            <View style={{width: styleValues.winWidth, height: this.state.galleryHeight}}>
                <FlatList
                style={styles.gallery}
                data={this.state.images}
                keyExtractor={(item, index) => index.toString()}
                onScroll={(event) => {
                    this.setState({showGalleryIcon: event.nativeEvent.contentOffset.x == 0});
                }}
                ListHeaderComponent={<View style={{width: styleValues.mediumPadding}}/>}
                ListFooterComponent={<View style={{width: styleValues.mediumPadding}}/>}
                ItemSeparatorComponent={() => <View style={{width: styleValues.mediumPadding}}/>}
                renderItem={({ item }) => item}
                horizontal={true}
                extraData={this.state}
                />
                {this.renderGalleryIcon()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    gallery: {
    },
    headerIcon: {
        position: "absolute",
        right: 0,
        bottom: 0,
        marginRight: styleValues.mediumPadding*2,
        marginBottom: styleValues.mediumPadding,
        width: styleValues.winWidth * 0.075,
        height: styleValues.winWidth * 0.075,
        opacity: 0.9
    },
    photo: {
        
    }
});