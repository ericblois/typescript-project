import React, { Component } from "react";
import { View, Text, StyleSheet, ImageURISource, ScrollView } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { ImageSliderSelector, MapPopup } from "../HelperFiles/CompIndex";

type BusinessEditInfoNavigationProp = StackNavigationProp<BusinessMainStackParamList, "businessEditInfo">;

type BusinessEditInfoRouteProp = RouteProp<BusinessMainStackParamList, "businessEditInfo">;

type BusinessEditInfoProps = {
    navigation: BusinessEditInfoNavigationProp,
    route: BusinessEditInfoRouteProp,
    businessInfo?: PublicBusinessData
}

type State = {
    galleryImages: string[]
}

export default class BusinessEditInfoPage extends Component<BusinessEditInfoProps, State> {

    state = {
        galleryImages: new Array<string>()
    }

    constructor(props: BusinessEditInfoProps) {
        super(props)

    }

  render() {
    return (
      <ScrollView contentContainerStyle={defaults.pageContainer}>
          <ImageSliderSelector uris={this.state.galleryImages}/>
          {/* Title */}
          <TextInputBox
            extraTextProps={{
                defaultValue: this.props.businessInfo?.name,
                placeholder: "Business Title"
            }}
          ></TextInputBox>
          {/* Description */}
          <TextInputBox
            style={styles.descriptionBox}
            textStyle={{fontSize: styleValues.smallerTextSize}}
            extraTextProps={{
                defaultValue: this.props.businessInfo?.description,
                placeholder: "Description",
                multiline: true
            }}
          ></TextInputBox>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    descriptionBox: {
        height: styleValues.winWidth * 0.5
    },
})