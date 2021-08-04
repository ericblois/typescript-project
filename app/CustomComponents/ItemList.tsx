
import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, FlatList, ActivityIndicator } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { productPropType, currency } from "../HelperFiles/Constants";
import RatingVisual from "./RatingVisual";
import { useNavigation } from "@react-navigation/native";
import { CartItem, ProductCategory, ProductData, PublicBusinessData } from "../HelperFiles/DataTypes";
import ProductCard from "./ProductCard";
import GradientView from "./GradientView"
import DraggableFlatList, { DraggableFlatListProps } from "react-native-draggable-flatlist";

const defaultAnimationConfig = {
    damping: 20,
    mass: 0.2,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.2,
    restDisplacementThreshold: 0.2,
  }

type Props<T> = Omit<DraggableFlatListProps<T>, "animationConfig"> & {
    animationConfig?: typeof defaultAnimationConfig,
    fadeTop?: boolean,
    fadeBottom?: boolean
}

type State = {
}

export default class ItemList<T> extends CustomComponent<Props<T>, State> {

    constructor(props: Props<T>) {
        super(props);
    }

    render() {
        return (
            <View
                style={StyleSheet.compose({flex: 1}, this.props.style)}
                pointerEvents={"box-none"}
            >
                <DraggableFlatList
                    animationConfig={defaultAnimationConfig}
                    {...this.props}
                    contentContainerStyle={{
                        width: "100%",
                        flex: 1,
                        padding: styleValues.mediumPadding
                    }}
                />
                <GradientView
                    horizontal={this.props.horizontal === true}
                    fadeTop={this.props.fadeTop}
                    fadeBottom={this.props.fadeBottom}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
})