
import React, { Component } from "react";
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
    animationConfig?: typeof defaultAnimationConfig
}

type State = {
}

export default class ItemList<T> extends Component<Props<T>, State> {

    constructor(props: Props<T>) {
        super(props);
    }

    renderList() {
        return (
            <DraggableFlatList
                animationConfig={defaultAnimationConfig}
                {...this.props}
                style={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
                // Ensure spacing from edges so fade doesn't appear before scrolling
                ListHeaderComponent={() => {
                    return (
                        <View>
                            <View style={{
                                width: this.props.horizontal === true ? styleValues.mediumPadding : "100%",
                                height: this.props.horizontal === true ? "100%" : styleValues.mediumPadding,
                            }}/>
                            {this.props.ListHeaderComponent}
                        </View>
                    )
                }}
            />
        )
    }

    renderGradient() {
        return (
            <GradientView
                horizontal={this.props.horizontal === true}
            />
        )
    }

    render() {
        return (
            <View style={StyleSheet.compose({flex: 1}, this.props.style)}>
                {this.renderList()}
                {this.renderGradient()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
})