import React, { Component } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";

import PropTypes from 'prop-types';
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import { ImageSlider, RatingVisual, MenuBar, IconButton, PageContainer, ScrollContainer } from "../HelperFiles/CompIndex";
import { productPropType, formatText, currency } from "../HelperFiles/Constants";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { BusinessShopStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';
import { ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type ProductShopNavigationProp = StackNavigationProp<BusinessShopStackParamList, "productInfo">;

type ProductShopRouteProp = RouteProp<BusinessShopStackParamList, "productInfo">;

type Props = {
    navigation: ProductShopNavigationProp,
    route: ProductShopRouteProp,
    businessData: PublicBusinessData
}

type State = {
    productData?: ProductData,
    imagesLoaded: boolean
}

export default class ProductShopPage extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            productData: undefined,
            imagesLoaded: false
        }
    }

    componentDidMount() {
        CustomerFunctions.getProduct(
            this.props.businessData.businessID,
            this.props.route.params.productID).then((productData) => {
                this.setState({productData: productData})
        })
    }

    renderUI() {
        if (this.state.productData) {
            return (
                <ScrollContainer>
                    <ImageSlider
                        uris={this.state.productData.images}
                        onImagesLoaded={() => {
                            this.setState({imagesLoaded: true})
                        }}
                    ></ImageSlider>
                    <View style={styles.descriptionHeader}>
                        <Text style={styles.productTitle} numberOfLines={2}>{this.state.productData.name}</Text>
                        <View style={styles.subHeader}>
                            <Text style={styles.productType}>{this.state.productData.category}</Text>
                            <RatingVisual rating={4}/>
                        </View>
                    </View>
                    <View style={styles.descriptionBody}>
                        <Text style={styles.description}>{formatText(this.state.productData.description)}</Text>
                    </View>
                </ScrollContainer>
            )
        }
    }

    renderLoadScreen() {
        if (this.state.productData === undefined || !this.state.imagesLoaded) {
          return (
            <View 
              style={{...defaults.pageContainer, ...{
                justifyContent: "center",
                position: "absolute",
                top: 0,
                left: 0
              }}}
            >
              <ActivityIndicator
                size={"large"}
              />
              <MenuBar
                buttonProps={[
                  {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                ]}
                />
            </View>
          )
        }
    }

    render() {
        return (
        <PageContainer>
            {this.renderUI()}
            {this.renderLoadScreen()}
            <MenuBar
                buttonProps={[
                    {iconSource: icons.backArrow, buttonFunc: () => this.props.navigation.goBack()},
                    {iconSource: icons.shoppingCart, buttonFunc: () => {}},
                ]}
            />
        </PageContainer>
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
        fontSize: styleValues.largeTextSize,
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
