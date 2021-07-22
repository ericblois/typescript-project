
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, GestureResponderEvent, FlatList, ActivityIndicator } from "react-native";
import { defaults, styleValues, colors } from "../HelperFiles/StyleSheet";
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

type Props = Omit<DraggableFlatListProps<any>, "animationConfig"> & {
    animationConfig?: typeof defaultAnimationConfig
}

type State = {
}

export default class ItemList extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    renderList() {
        return (
            <DraggableFlatList
                animationConfig={defaultAnimationConfig}
                {...this.props}
                style={{}}
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
                ListFooterComponent={() => {
                    return (
                        <View>
                            <View style={{
                                width: this.props.horizontal === true ? styleValues.mediumPadding : "100%",
                                height: this.props.horizontal === true ? "100%" : styleValues.mediumPadding,
                            }}/>
                            {this.props.ListFooterComponent}
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
            <View style={this.props.style}>
                {this.renderList()}
                {this.renderGradient()}
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