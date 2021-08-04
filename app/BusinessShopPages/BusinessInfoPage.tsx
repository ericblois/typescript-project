import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import PropTypes from 'prop-types';
import { defaults, textStyles, buttonStyles, icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import { IconButton, ImageSlider, MenuBar, PageContainer, RatingVisual, ScrollContainer } from "../HelperFiles/CompIndex";
import { businessPropType, formatText } from "../HelperFiles/Constants";
import { PublicBusinessData } from "../HelperFiles/DataTypes"
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopStackParamList, CustomerMainStackParamList, CustomerTabParamList } from "../HelperFiles/Navigation";
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type BusinessInfoNavigationProp = CompositeNavigationProp<
    StackNavigationProp<BusinessShopStackParamList, "info">,
    BottomTabNavigationProp<CustomerTabParamList>
>

type BusinessInfoRouteProp = RouteProp<BusinessShopStackParamList, "info">;

type Props = {
    navigation: BusinessInfoNavigationProp,
    route: BusinessInfoRouteProp,
    businessData: PublicBusinessData
}

type State = {
    loaded: boolean,
    favorited: boolean
}

export default class BusinessInfoPage extends CustomComponent<Props, State> {

    businessData = this.props.businessData

    constructor(props: Props) {
        super(props)
        this.state = {
            loaded: false,
            favorited: false
        }
    }



    displayLoadingScreen() {
        if (!this.state.loaded) {
            return (
                <View 
                    style={{...defaults.pageContainer, ...{
                        justifyContent: "center",
                        position: "absolute",
                        top: 0,
                        left: 0
                     }}}
                >
                    <ActivityIndicator size={"large"}/>
                </View>
            );
        }
        return <></>
    }

    render() {
        return (
        <PageContainer>
            <ScrollContainer>
                <ImageSlider
                    uris={this.props.businessData.galleryImages}
                    onImagesLoaded={() => {
                        this.setState({loaded: true})
                    }}
                />
                <View style={styles.descriptionHeader}>
                    <Text style={styles.businessTitle} numberOfLines={2}>{this.props.businessData.name}</Text>
                    <Text style={styles.businessType}>{this.props.businessData.businessType}</Text>
                    <View style={styles.subHeader}>
                        <Text style={styles.businessLocation}>{this.props.businessData.city + ", " + this.props.businessData.region}</Text>
                        <RatingVisual rating={this.props.businessData.totalRating}/>
                        <IconButton
                            iconSource={this.state.favorited ? icons.star : icons.hollowStar}
                            buttonStyle={styles.favButton}
                            iconStyle={{tintColor: this.state.favorited ? colors.mainColor : colors.grayColor}}
                            buttonFunc={async () => {
                            if (!this.state.favorited) {
                                await CustomerFunctions.addToFavorites(this.props.businessData.businessID)
                                this.setState({favorited: true})
                            } else {
                                await CustomerFunctions.deleteFavorite(this.props.businessData.businessID)
                                this.setState({favorited: false})
                            }
                            }}
                        />
                    </View>
                </View>
                <View style={styles.descriptionBody}>
                    <Text style={styles.description}>{formatText(this.props.businessData.description)}</Text>
                </View>
                {this.displayLoadingScreen()}
            </ScrollContainer>
            <MenuBar
                buttonProps={[
                    {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.navigate("browse")}},
                    {
                        iconSource: icons.document,
                        buttonFunc: () => {this.props.navigation.navigate("info")},
                        iconStyle: {tintColor: colors.mainColor}
                    },
                    {iconSource: icons.shoppingCart, buttonFunc: () => {this.props.navigation.navigate("products")}},
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
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        alignItems: "flex-start",
        padding: styleValues.minorPadding,
        paddingBottom: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: colors.grayColor
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
        padding: styleValues.minorPadding
    },
    businessTitle: {
        ...textStyles.larger
    },
    businessType: {
        ...textStyles.medium,
        color: styleValues.minorTextColor,
        marginBottom: styleValues.minorPadding,
    },
    businessLocation: {
        ...textStyles.medium,
        color: styleValues.minorTextColor,
    },
    favButton: {
        width: "15%",
        aspectRatio: 1,
    },
    description: {
        ...textStyles.small,
        textAlign: "left"
    }
});
