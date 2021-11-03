
import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, FlatList, ActivityIndicator, ViewStyle } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { CartItem, ProductCategory, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import ProductCard from "./ProductCard";
import BusinessCard from "./BusinessCard";
import ScrollContainer from "./ScrollContainer";
import LoadingCover from "./LoadingCover";

type Props = {
    businessIDs: string[],
    style?: ViewStyle,
    showLoading?: boolean,
    onCardPress?: (publicData: PublicBusinessData) => void,
    onLoadEnd?: () => void,
}

type State = {
    businessesData: (PublicBusinessData | undefined)[],
    cardsLoaded: boolean
}

export default class BusinessCardBrowseList extends CustomComponent<Props, State> {

    loadCount = 0

    constructor(props: Props) {
        super(props);
        this.state = {
            businessesData: props.businessIDs.map(() => (undefined)),
            cardsLoaded: false
        }
    }

    renderBusinessCard(businessID: string) {
        return (
            <BusinessCard
                businessID={businessID}
                key={businessID}
                onLoadEnd={(publicData) => {
                    // Add this business' data to list
                    const businessIndex = this.props.businessIDs.findIndex((id) => {
                        return id === businessID
                    })
                    if (businessIndex > -1) {
                        let newBusinessesData = this.state.businessesData
                        newBusinessesData[businessIndex] = publicData
                        this.setState({businessesData: newBusinessesData})
                    }
                    // Check if this is the last card to load and call onLoadEnd function
                    this.loadCount += 1
                    if (this.loadCount === this.props.businessIDs.length) {
                        this.setState({cardsLoaded: true}, () => {
                            if (this.props.onLoadEnd) {
                                this.props.onLoadEnd!()
                            }
                            this.loadCount = 0
                        })
                    }
                }}
                onPress={() => {
                    // Find corresponding index of business data and call onCardPress function
                    if (this.props.onCardPress) {
                        const businessIndex = this.props.businessIDs.findIndex((id) => {
                            return id === businessID
                        })
                        if (businessIndex > -1) {
                            const publicData = this.state.businessesData[businessIndex]
                            if (publicData) {
                                this.props.onCardPress(publicData)
                            }
                        }
                    }
                }}
            />
        )
    }

    renderUI() {
        return (
            <ScrollContainer
                horizontal={true}
            >
                {this.props.businessIDs.map((id) => {
                    return this.renderBusinessCard(id)
                })}
                {this.renderBusinessCard("XOtV6IlwDiw5EEobwBg0")}
            </ScrollContainer>
        )
    }

    renderLoading() {
        if (this.props.showLoading === true && !this.state.cardsLoaded) {
            return (
                <LoadingCover size={"large"}/>
            )
        }
    }

    render() {
        return (
            <View style={{
                width: styleValues.winWidth,
                height: styleValues.winWidth*0.6
            }}>
                {this.renderUI()}
                {this.renderLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardList: {
        width: "100%",
    },
})