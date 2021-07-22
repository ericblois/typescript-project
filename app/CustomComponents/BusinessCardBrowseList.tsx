
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, FlatList, ActivityIndicator } from "react-native";
import { defaults, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { CartItem, ProductCategory, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import ProductCard from "./ProductCard";
import { BusinessCard, ProductCartCard } from "../HelperFiles/CompIndex";

type Props = {
    businessIDs: string[],
    showLoading?: boolean,
    onCardPress?: (publicData: PublicBusinessData) => void,
    onLoadEnd?: () => void,
}

type State = {
    businessesData: (PublicBusinessData | undefined)[],
    cardsLoaded: boolean
}

export default class ProductCardList extends Component<Props, State> {

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
            <FlatList
            data={this.props.businessIDs}
            keyExtractor={(item) => (item)}
            renderItem={({item}) => {
                return this.renderBusinessCard(item)
            }}
            style={{width: "100%"}}
            contentContainerStyle={styles.cardList}
            />
        )
    }

    renderLoading() {
        if (this.props.showLoading === true && !this.state.cardsLoaded) {
            return (
                <View style={{
                    position: "absolute",
                    width: "100%",
                    height: styleValues.winWidth*0.6,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.whiteColor
                }}>
                    <ActivityIndicator size={"large"}/>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={{width: "100%"}}>
                {this.renderUI()}
                {this.renderLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardList: {
        width: "100%",
        height: styleValues.winWidth*0.6,
    },
})