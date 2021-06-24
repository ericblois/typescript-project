import React, { Component } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";

import PropTypes from 'prop-types';
import { styleValues, defaults, icons } from "./HelperFiles/StyleSheet";
import { PhotoSlider, RatingVisual, MenuBar, IconButton } from "./HelperFiles/CompIndex";
import { productPropType, formatText, prefetchImages, currency } from "./HelperFiles/Constants";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "./HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';

type ProductShopNavigationProp = StackNavigationProp<RootStackParamList, "productShop">;

type ProductShopRouteProp = RouteProp<RootStackParamList, "productShop">;

type Props = {
    navigation: ProductShopNavigationProp,
    route: ProductShopRouteProp
}

type State = {
    imagesFetched: boolean,
    galleryReady: boolean,
    options: { [key: string]: string }
}

export default class ProductShopScreen extends Component<Props, State> {

    galleryResponse = () => {
        this.setState({galleryReady: true});
    }
    productData = this.props.route.params.productData;
    productType = this.props.route.params.productType;
    dropdownItems: {[key: string]: {label: string, value: string}[]} = {};

    state: Readonly<State> = {
        imagesFetched: false,
        galleryReady: false,
        options: {},
    }

    static propTypes = {
        navigation: PropTypes.object,
        route: PropTypes.object,
    }

    componentDidMount() {
        prefetchImages(this.productData.images).then(() => {
            this.setState({imagesFetched: true});
        })
        // Create elements for each of this product's options
        this.dropdownItems = this.createOptionDropdowns();
    }

    displayLoadingScreen() {
        if (this.productData.images.length != 0 && !(this.state.imagesFetched && this.state.galleryReady)) {
            return (
                <ActivityIndicator style={styles.loadingScreen} size={"large"}/>
            );
        }
        return <></>
    }
    // Create dropdown elements for each type of option for this product
    createOptionDropdowns() {
        let dropdownItems: { [key: string]: {label: string, value: string}[] } = {};
        // Create a dropdown for each option type of product
        this.productData.optionTypes.forEach((optionType, index) => {
            // Create item list for dropdown
            const items = optionType.options.map((option) => {
                return {label: option.name, value: option.name}
            });
            dropdownItems[optionType.name] = items;
        })
        return dropdownItems;
    }

    renderDropdowns() {
        const dropdowns = [];
        for (const name in this.dropdownItems) {
            const dropdown = <DropDownPicker
                key={name}
                containerStyle={[styles.optionPickerContainer, {borderColor: this.state.options[name] ? styleValues.validColor : styleValues.invalidColor}]}
                style={styles.optionPicker}
                items={this.dropdownItems[name]}
                placeholder={name}
                onChangeItem={(item) => {
                    const options = this.state.options;
                    options[name] = item.value;
                    this.setState({options: options});
                }}
            />
            dropdowns.push(dropdown);
        }
        return dropdowns;
    }

    render() {
        return (
        <View style={defaults.screenContainer}>
            <View style={defaults.pageContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <PhotoSlider imgURLs={this.productData.images} loadResponse={this.galleryResponse}/>
                <View style={styles.descriptionHeader}>
                    <Text style={styles.productTitle} numberOfLines={2}>{this.productData.name}</Text>
                    <View style={styles.subHeader}>
                        <Text style={styles.productType}>{this.productType}</Text>
                        <RatingVisual rating={4}/>
                    </View>
                </View>
                <View style={styles.descriptionBody}>
                    <Text style={styles.description}>{formatText(this.productData.description)}</Text>
                </View>
                <View style={styles.descriptionBody}>
                    {this.renderDropdowns()}
                </View>
                <Text>{this.productData.extraInfo}</Text>
                {this.displayLoadingScreen()}
            </ScrollView>
            <MenuBar 
            menuBarStyle={{justifyContent: "space-between"}}
            buttons={[
                {iconSource: icons.backArrow, buttonFunc: () => this.props.navigation.goBack()},
                {iconSource: icons.shoppingCart, buttonFunc: () => {}},
            ]}/>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: styleValues.winWidth/4,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: styleValues.mediumPadding,
    },
    loadingScreen: {
        position: "absolute",
        top: 0,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
    descriptionHeader: {
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        alignItems: "flex-start",
        padding: styleValues.minorPadding,
        paddingBottom: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: styleValues.bordColor
    },
    subHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    descriptionBody: {
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        alignItems: "flex-start",
        padding: styleValues.minorPadding,
        paddingBottom: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: styleValues.bordColor
    },
    productTitle: {
        fontSize: styleValues.largestTextSize,
        color: styleValues.majorTextColor,
    },
    productType: {
        fontSize: styleValues.smallTextSize,
        color: styleValues.minorTextColor,
    },
    description: {
        fontSize: styleValues.smallTextSize,
    },
    optionPickerContainer: {
        width: styleValues.winWidth-2*styleValues.mediumPadding,
        height: styleValues.winWidth/8,
        fontSize: styleValues.smallestTextSize,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
    },
    optionPicker: {
        // Must use individual border radii, as borderRadius does not work
        borderTopLeftRadius: styleValues.mediumPadding,
        borderTopRightRadius: styleValues.mediumPadding,
        borderBottomLeftRadius: styleValues.mediumPadding,
        borderBottomRightRadius: styleValues.mediumPadding,
        borderWidth: 0,
        height: "100%",
        width: "100%",
    }
});
