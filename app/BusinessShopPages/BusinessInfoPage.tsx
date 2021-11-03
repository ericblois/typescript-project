import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import PropTypes from 'prop-types';
import { defaults, textStyles, buttonStyles, icons, styleValues, colors, fonts } from "../HelperFiles/StyleSheet";
import { IconButton, ImageSlider, LoadingCover, MenuBar, PageContainer, RatingVisual, ScrollContainer } from "../HelperFiles/CompIndex";
import { businessPropType, formatText } from "../HelperFiles/Constants";
import { PublicBusinessData, UserData } from "../HelperFiles/DataTypes"
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopStackParamList, CustomerMainStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import UserFunctions from "../HelperFiles/UserFunctions";

type BusinessInfoNavigationProp = CompositeNavigationProp<
    StackNavigationProp<BusinessShopStackParamList, "info">,
    CompositeNavigationProp<
        BottomTabNavigationProp<CustomerTabParamList>,
        StackNavigationProp<CustomerMainStackParamList>
    >
>

type BusinessInfoRouteProp = RouteProp<BusinessShopStackParamList, "info">;

type Props = {
    navigation: BusinessInfoNavigationProp,
    route: BusinessInfoRouteProp,
    businessData: PublicBusinessData
}

type State = {
    userData?: UserData,
    loaded: boolean,
    favorited: boolean,
    cartQuantity: number
}

export default class BusinessInfoPage extends CustomComponent<Props, State> {

    businessData = this.props.businessData

    constructor(props: Props) {
        super(props)
        this.state = {
            userData: undefined,
            loaded: false,
            favorited: false,
            cartQuantity: 0
        }
    }

    async refreshData() {
        const data = await UserFunctions.getUserDoc()
        const cart = await CustomerFunctions.getCart()
        let quantity = 0
        for (const item of cart) {
            if (item.businessID === this.props.businessData.businessID) {
                quantity += item.quantity
            }
        }
        this.setState({
            userData: data,
            favorited: data.favorites.includes(this.props.businessData.businessID),
            cartQuantity: quantity
        })
    }

    componentDidMount() {
        this.refreshData()
    }

    renderInfo() {
        let regionString = this.props.businessData.city === ""
            ? this.props.businessData.region
            : this.props.businessData.city + ", " + this.props.businessData.region
        return (
            <View
                style={{
                    backgroundColor: colors.whiteColor,
                    borderRadius: styleValues.bordRadius,
                    padding: styleValues.mediumPadding,
                    width: "100%",
                    ...defaults.smallShadow
                }}
            >
                <View style={styles.descriptionHeader}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        width: "100%",
                    }}>
                        <Text style={styles.businessTitle}>{this.props.businessData.name}</Text>
                        <IconButton
                            iconSource={this.state.favorited ? icons.star : icons.hollowStar}
                            buttonStyle={styles.favButton}
                            iconStyle={{tintColor: this.state.favorited ? colors.mainColor : colors.grayColor}}
                            buttonFunc={async () => {
                                try {
                                    const newUserData = this.state.userData
                                    if (newUserData) {
                                        if (newUserData.favorites.includes(this.props.businessData.businessID)) {
                                            this.setState({favorited: false})
                                            await CustomerFunctions.deleteFavorite(this.props.businessData.businessID)
                                            await this.refreshData()
                                        } else {
                                            this.setState({favorited: true})
                                            await CustomerFunctions.addToFavorites(this.props.businessData.businessID)
                                            await this.refreshData()
                                        }
                                    }
                                } catch (e) {
                                    console.error(e)
                                    this.setState({favorited: !this.state.favorited})
                                }
                            }}
                            iconProps={{
                                resizeMode: "contain"
                            }}
                        />
                    </View>
                    <Text style={styles.businessType}>{this.props.businessData.businessType}</Text>
                    <View style={styles.subHeader}>
                        <View style={{
                            alignItems: "flex-start"
                        }}>
                        <Text style={styles.businessLocation}>{regionString}</Text>
                        {this.props.businessData.address !== ""
                        ? <Text style={styles.businessLocation}>{this.props.businessData.address}</Text>
                        : undefined}
                        </View>
                        <RatingVisual rating={this.props.businessData.totalRating}/>
                    </View>
                </View>
                <View style={styles.descriptionBody}>
                    <Text style={styles.description}>{formatText(this.props.businessData.description)}</Text>
                </View>
            </View>
        )
    }

    renderUI() {
        return (
            <ScrollContainer>
                <ImageSlider
                    uris={this.props.businessData.galleryImages}
                    onImagesLoaded={() => {
                        this.setState({loaded: true})
                    }}
                />
                {this.renderInfo()}
            </ScrollContainer>
        )
    }

    renderLoading() {
        if (!this.state.loaded || !this.state.userData) {
            return (
                <LoadingCover size={"large"}/>
            );
        }
    }

    render() {
        return (
        <PageContainer>
            {this.renderUI()}
            {this.renderLoading()}
            <MenuBar
                buttonProps={[
                    {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.dangerouslyGetParent()?.goBack()}},
                    {
                        iconSource: icons.document,
                        buttonFunc: () => {this.props.navigation.navigate("info")},
                        iconStyle: {tintColor: colors.mainColor}
                    },
                    {iconSource: icons.shoppingBag, buttonFunc: () => {this.props.navigation.navigate("products")}},
                    {
                        iconSource: icons.shoppingCart,
                        showBadge: this.state.cartQuantity > 0,
                        badgeNumber: this.state.cartQuantity,
                        buttonFunc: () => this.props.navigation.navigate("cart")
                    },
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
        backgroundColor: "#fff"
    },
    loadingScreen: {
        position: "absolute",
        top: 0,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
    descriptionHeader: {
        width: "100%",
        alignItems: "flex-start",
        paddingBottom: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: colors.grayColor
    },
    subHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    descriptionBody: {
        width: "100%",
        alignItems: "flex-start",
        padding: styleValues.minorPadding
    },
    businessTitle: {
        ...textStyles.larger,
        textAlign: "left",
        flex: 1,
    },
    businessType: {
        ...textStyles.large,
        color: styleValues.minorTextColor,
        marginBottom: styleValues.minorPadding,
    },
    businessLocation: {
        ...textStyles.small,
        color: styleValues.minorTextColor,
    },
    favButton: {
        width: textStyles.larger.fontSize*4/3,
        aspectRatio: 1,
        marginLeft: styleValues.minorPadding
    },
    description: {
        ...textStyles.small,
        textAlign: "left"
    }
});
