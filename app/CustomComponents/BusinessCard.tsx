
import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import { icons, styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import {  useNavigation } from "@react-navigation/native";
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";
import LoadingCover from "./LoadingCover";

type Props = {
  businessID: string,
  onPress?: () => void,
  onLoadEnd?: (publicData: PublicBusinessData) => void
}

type State = {
  businessData?: PublicBusinessData,
  imageLoaded: boolean,
}

export default class BusinessCard extends CustomComponent<Props, State> {

    constructor(props: Props) {
      super(props)
      this.state = {
        businessData: undefined,
        imageLoaded: false,
      }
      this.refreshData()
    }

    async refreshData() {
      const publicData = await CustomerFunctions.getPublicBusinessData(this.props.businessID)
      this.setState({businessData: publicData})
    }

    renderUI() {
      if (this.state.businessData) {
        return (
          <TouchableOpacity style={{height: "100%"}} onPress={this.props.onPress}>
            <Image
                style={styles.galleryImage}
                resizeMethod={"scale"}
                resizeMode={"cover"}
                source={this.state.businessData.galleryImages.length > 0 ? {uri: this.state.businessData.galleryImages[0]} : icons.profile}
                onLoadEnd={() => {
                  this.setState({imageLoaded: true})
                  if (this.props.onLoadEnd) {
                    this.props.onLoadEnd(this.state.businessData!)
                  }
                }}
            />
            <Text style={styles.nameText}>{this.state.businessData.name}</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.typeText}>{this.state.businessData.businessType}</Text>
            </View>

          </TouchableOpacity>
        );
      }
    }

    renderLoading() {
      if (!this.state.businessData || !this.state.imageLoaded) {
        return (
          <LoadingCover style={{backgroundColor: colors.whiteColor}}/>
        )
      }
    }

    render() {
      return (
        <View style={{
          ...styles.cardContainer,
          ...defaults.smallShadow,
        }}>
          {this.renderUI()}
          {this.renderLoading()}
        </View>
      )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
      height: "100%",
      backgroundColor: colors.whiteColor,
      borderRadius: styleValues.bordRadius,
      padding: styleValues.mediumPadding,
      marginRight: styleValues.mediumPadding,
      justifyContent: "space-between",
    },
    galleryImage: {
      flex: 1,
      width: "100%",
      aspectRatio: 4/3,
      borderRadius: styleValues.bordRadius / 1.5,
    },
    infoContainer: {
      width: "100%"
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    },
    nameText: {
      ...textStyles.large,
      textAlign: "left",
    },
    typeText: {
      ...textStyles.medium,
      textAlign: "left",
      color: styleValues.minorTextColor,
    },
})