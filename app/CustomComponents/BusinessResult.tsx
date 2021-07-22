
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import { icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import {  useNavigation } from "@react-navigation/native";
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import { IconButton } from "../HelperFiles/CompIndex";
import { CustomerFunctions } from "../HelperFiles/CustomerFunctions";

type Props = {
  businessData: PublicBusinessData,
  favorited?: boolean,
  onPress?: () => void
}

type State = {
  favorited: boolean
}

export default class BusinessResult extends Component<Props, State> {

    constructor(props: Props) {
      super(props)
      this.state = {
        favorited: props.favorited ? props.favorited : false
      }
    }

    render() {
        return (
          <TouchableOpacity style={styles.resultItemContainer} onPress={this.props.onPress}>
            <View>
            <Image
                style={styles.resultImage}
                resizeMethod={"scale"}
                resizeMode={"cover"}
                source={this.props.businessData.profileImage !== "" ? {uri: this.props.businessData.profileImage} : icons.profile}
            />
            </View>
            <View style={styles.resultInfoContainer}>
            <View style={styles.resultUpperInfo}>
                <Text style={styles.resultName}>{this.props.businessData.name}</Text>
                <Text style={styles.resultType}>{this.props.businessData.businessType}</Text>
            </View>
            <View style={styles.resultLowerInfo}>
                <Text>{this.props.businessData.totalRating}</Text>
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

          </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    loadingScreen: {
      position: "absolute",
      top: 0,
      backgroundColor: "#fff",
      width: "100%",
      height: "100%",
    },
    resultItemContainer: {
        backgroundColor: "#fff",
        borderColor: colors.grayColor,
        borderRadius: styleValues.bordRadius,
        borderWidth: styleValues.minorBorderWidth,
        height: styleValues.winWidth * 0.25,
        width: styleValues.winWidth * 0.95,
        marginTop: styleValues.mediumPadding,
        padding: styleValues.minorPadding,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      resultInfoContainer: {
        flex: 1,
        marginLeft: "1%",
      },
      resultName: {
        fontSize: styleValues.mediumTextSize,
        color: styleValues.majorTextColor,
      },
      resultUpperInfo: {
        flex: 2,
      },
      resultLowerInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
      },
      resultType: {
        fontSize: styleValues.smallestTextSize,
        color: styleValues.minorTextColor,
      },
      resultImage: {
        aspectRatio: 1,
        flex: 1,
        borderRadius: styleValues.bordRadius / 1.5,
      },
      favButton: {
        height: "100%",
      },
})