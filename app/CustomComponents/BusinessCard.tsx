
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import { icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import {  useNavigation } from "@react-navigation/native";
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import { IconButton } from "../HelperFiles/CompIndex";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type Props = {
  businessID: string,
  onPress?: () => void,
  onLoadEnd?: (publicData: PublicBusinessData) => void
}

type State = {
  businessData?: PublicBusinessData,
  imageLoaded: boolean,
}

export default class BusinessCard extends Component<Props, State> {

    constructor(props: Props) {
      super(props)
      this.state = {
        businessData: undefined,
        imageLoaded: false,
      }
      this.refreshData()
    }

    async refreshData() {
      CustomerFunctions.getPublicBusinessData(this.props.businessID).then((publicData) => {
        this.setState({businessData: publicData})
      })
    }

    renderUI() {
      if (this.state.businessData) {
        return (
          <TouchableOpacity style={styles.cardContainer} onPress={this.props.onPress}>
            <Image
                style={styles.galleryImage}
                resizeMethod={"scale"}
                resizeMode={"cover"}
                source={this.state.businessData.galleryImages[0] ? {uri: this.state.businessData.galleryImages[0]} : icons.profile}
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
          <View
            style={{...styles.cardContainer, ...{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              top: 0, 
              left: 0
            }}}
          >
            <ActivityIndicator
              size={"small"}
            />
          </View>
        )
      }
    }

    render() {
      return (
        <View>
          {this.renderUI()}
          {this.renderLoading()}
        </View>
      )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: "#fff",
      borderColor: colors.grayColor,
      borderRadius: styleValues.bordRadius,
      borderWidth: styleValues.minorBorderWidth,
      height: styleValues.winWidth * 0.6,
      width: styleValues.winWidth * 0.6,
      padding: styleValues.minorPadding,
      justifyContent: "space-between",
    },
    galleryImage: {
      flex: 1,
      height: "75%",
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
      fontSize: styleValues.mediumTextSize,
      color: styleValues.majorTextColor,
    },
    typeText: {
      fontSize: styleValues.smallTextSize,
      color: styleValues.minorTextColor,
    },
})