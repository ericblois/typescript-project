import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { Text, Image, StyleSheet, View } from "react-native";
import { styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";

type Props = {
    rating: number,
    height?: number
}
  
type State = {}

export default class RatingVisual extends CustomComponent<Props, State> {

    height = this.props.height ? this.props.height : styleValues.smallTextSize;

    renderIcons() {
        return Array(5).fill(null).map((value, index) => {
            const floorRating = Math.floor(this.props.rating);
            const remainder = this.props.rating - floorRating;
            let iconSource = require("../../assets/starHollowIcon.png");
            // Check if this star should be filled
            if (index + 1 <= floorRating) {
                iconSource = require("../../assets/starIcon.png");
            } else if (index <= floorRating) {
                // Check if this star should be hollow
                if (remainder < 0.25) {
                    iconSource = require("../../assets/starHollowIcon.png");
                } // Check if this star should be half filled
                else if (remainder < 0.75) {
                    iconSource = require("../../assets/starHalfIcon.png");
                } // This star should be filled
                else {
                    iconSource = require("../../assets/starIcon.png");
                }
            }
            return <Image
                source={iconSource}
                resizeMethod={"scale"}
                resizeMode={"center"}
                style={[styles.starIcon, {width: this.height}]}
                key={index}
            />
        })
    }

    render() {
        return (
            <View style={styles.ratingContainer}>
                <Text style={[styles.ratingText, {fontSize: this.height*0.9}]}>{this.props.rating.toFixed(1)}</Text>
                {this.renderIcons()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    ratingText: {
        fontSize: styleValues.smallTextSize*0.9,
        marginRight: styleValues.minorPadding,
        //borderWidth: 1
    },
    starIcon: {
        width: styleValues.smallTextSize,
        aspectRatio: 1,
        tintColor: colors.darkGrayColor,
        marginRight: styleValues.minorPadding/2,
        //borderWidth: 1
    }

});
