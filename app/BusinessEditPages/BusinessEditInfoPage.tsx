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
import { ImageSliderSelector, MapPopup, MenuBar } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";

type BusinessEditInfoNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editInfo">;

type BusinessEditInfoRouteProp = RouteProp<BusinessMainStackParamList, "editInfo">;

type BusinessEditInfoProps = {
    navigation: BusinessEditInfoNavigationProp,
    route: BusinessEditInfoRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    publicData?: PublicBusinessData,
    saved: boolean
}

export default class BusinessEditInfoPage extends Component<BusinessEditInfoProps, State> {

    constructor(props: BusinessEditInfoProps) {
        super(props)
        this.state = {
          publicData: undefined,
          saved: true
        }
    }

    componentDidMount() {
      this.props.businessFuncs.getPublicData().then((publicData) => {
        this.setState({publicData: publicData})
      })
    }

  render() {
    return (
      <ScrollView contentContainerStyle={defaults.pageContainer}>
          <ImageSliderSelector
            uris={this.state.publicData?.galleryImages ? this.state.publicData.galleryImages : []}
            onChange={(images) => {
              let newPublicData = this.state.publicData
              if (newPublicData) {
                newPublicData.galleryImages = images
              }
              this.setState({publicData: newPublicData, saved: false})
            }}
          />
          {/* Title */}
          <TextInputBox
            extraTextProps={{
                defaultValue: this.state.publicData?.name,
                placeholder: "Business Title",
                onChangeText: (text) => {
                  let newPublicData = this.state.publicData
                  if (newPublicData) {
                    newPublicData.name = text
                  }
                  this.setState({publicData: newPublicData, saved: false})
                }
            }}
          ></TextInputBox>
          {/* Description */}
          <TextInputBox
            style={styles.descriptionBox}
            textStyle={{fontSize: styleValues.smallerTextSize}}
            extraTextProps={{
                defaultValue: this.state.publicData?.description,
                placeholder: "Description",
                multiline: true,
                onChangeText: (text) => {
                  let newPublicData = this.state.publicData
                  if (newPublicData) {
                    newPublicData.description = text
                  }
                  this.setState({publicData: newPublicData, saved: false})
                }
            }}
          ></TextInputBox>
          <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? styleValues.validColor : styleValues.invalidColor}, buttonFunc: () => {
                    if (this.state.publicData) {
                        this.props.businessFuncs.updatePublicData(this.state.publicData).then(() => {
                            this.setState({saved: true})
                        }, (e) => {
                            throw e;
                        })
                    }
                }}
              ]}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    descriptionBox: {
        height: styleValues.winWidth * 0.5
    },
})