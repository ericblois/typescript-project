
import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import { styleValues } from "../HelperFiles/StyleSheet";
import {  useNavigation } from "@react-navigation/native";
import { PublicBusinessData, PrivateBusinessData } from "../HelperFiles/Constants";
import BusinessDataHandler from "../HelperFiles/BusinessDataHandler";

type Props = {
  navigation: ReturnType<typeof useNavigation>,
  businessData: PrivateBusinessData,
}

type State = {}

export default class SearchResultItem extends Component<Props, State> {

    businessInfo: PublicBusinessData | undefined;

    getBusinessInfo = async () => {
      await BusinessDataHandler.getBusinessInfo(this.props.businessData).catch((e) => console.error(e));
      this.businessInfo = this.props.businessData.info!;
    }

    componentDidMount() {
      this.getBusinessInfo();
    }

    displayLoadingScreen() {
      if (this.businessInfo) {
          return (
              <ActivityIndicator style={styles.loadingScreen} size={"large"}/>
          );
      }
      return <></>
  }

    render() {
        return !this.businessInfo ? this.displayLoadingScreen() : (
          <TouchableOpacity style={styles.resultItemContainer} onPress={() => this.props.navigation.navigate("business", {businessData: this.props.businessData})}>
            <View>
            <Image
                style={styles.resultImage}
                resizeMethod={"scale"}
                resizeMode={"cover"}
                source={{uri: this.businessInfo?.profileImage}}
            />
            </View>
            <View style={styles.resultInfoContainer}>
            <View style={styles.resultUpperInfo}>
                <Text style={styles.resultName}>{this.businessInfo?.name}</Text>
                <Text style={styles.resultType}>{this.businessInfo?.businessType}</Text>
            </View>
            <View style={styles.resultLowerInfo}>
                <Text>{this.businessInfo?.totalRating}</Text>
                <TouchableOpacity onPress={() => useNavigation().navigate("business", {businessData: this.props.businessData})}>
                <Image
                    style={styles.favButton}
                    resizeMethod={"scale"}
                    resizeMode={"contain"}
                    source={require("../../assets/hollowStarIcon.png")}
                />
                </TouchableOpacity>
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
        borderColor: styleValues.bordColor,
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
        aspectRatio: 1,
        tintColor: "black",
      },
})