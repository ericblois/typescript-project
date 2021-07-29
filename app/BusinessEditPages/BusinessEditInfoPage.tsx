import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { ImageSliderSelector, MapPopup, MenuBar, PageContainer } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { extractKeywords, getCompressedImage, prefetchImages } from "../HelperFiles/ClientFunctions";
import * as pluralize from "pluralize"

type BusinessEditInfoNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editInfo">;

type BusinessEditInfoRouteProp = RouteProp<BusinessMainStackParamList, "editInfo">;

type BusinessEditInfoProps = {
    navigation: BusinessEditInfoNavigationProp,
    route: BusinessEditInfoRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    publicData?: PublicBusinessData,
    newImages: string[],
    deletedImages: string[],
    imagesLoaded: boolean,
    saved: boolean
}

export default class BusinessEditInfoPage extends Component<BusinessEditInfoProps, State> {

    constructor(props: BusinessEditInfoProps) {
        super(props)
        this.state = {
          publicData: undefined,
          newImages: [],
          deletedImages: [],
          imagesLoaded: false,
          saved: true
        }
    }

    componentDidMount() {
      this.refreshData()
    }

    refreshData() {
      this.props.businessFuncs.getPublicData().then((publicData) => {
        this.setState({publicData: publicData})
      })
    }

    renderLoadScreen() {
      if (this.state.publicData === undefined || !this.state.imagesLoaded) {
        return (
          <View 
            style={{...defaults.pageContainer, ...{
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 0
            }}}
          >
            <ActivityIndicator
              size={"large"}
            />
            <MenuBar
              buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
              ]}
              />
          </View>
        )
      }
    }

    renderUI() {
      if (this.state.publicData) {
        return (
          <PageContainer>
          <ImageSliderSelector
            uris={this.state.publicData ? this.state.publicData.galleryImages: []}
            onChange={(uris) => {
              this.setState({newImages: uris.new, deletedImages: uris.deleted, saved: false})
            }}
            onImagesLoaded={() => {
              this.setState({imagesLoaded: true})
            }}
          ></ImageSliderSelector>
          {/* Title */}
          <TextInputBox
            textProps={{
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
            avoidKeyboard={true}
          ></TextInputBox>
          {/* Business Type */}
          <TextInputBox
            textProps={{
                defaultValue: this.state.publicData?.businessType,
                placeholder: "Business Type (ex. 'Cafe')",
                onChangeText: (text) => {
                  let newPublicData = this.state.publicData
                  if (newPublicData) {
                    newPublicData.businessType = text
                  }
                  this.setState({publicData: newPublicData, saved: false})
                }
            }}
            avoidKeyboard={true}
          ></TextInputBox>
          {/* Description */}
          <TextInputBox
                  style={styles.descriptionBox}
                  textStyle={{fontSize: styleValues.smallerTextSize}}
                  textProps={{
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
                  avoidKeyboard={true}
                ></TextInputBox>
          <MenuBar
            buttonProps={[
              {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
              {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: async () => {
                if (this.state.publicData) {
                  // Add new images
                  let downloadURLs: string[] = await this.props.businessFuncs.uploadImages(this.state.newImages)
                  // Delete images
                  await this.props.businessFuncs.deleteImages(this.state.deletedImages)
                  // Update public data
                  const newPublicData = this.state.publicData
                  // Delete URLs
                  let prevURLs: string[] = []
                  newPublicData.galleryImages.forEach((url) => {
                    if (!this.state.deletedImages.includes(url)) {
                      prevURLs.push(url)
                    }
                  })
                  // Add new URLs
                  newPublicData.galleryImages = prevURLs.concat(downloadURLs)
                  const keywordsSource = newPublicData.name.concat(" ").concat(newPublicData.description)
                  let keywords = extractKeywords(keywordsSource)
                  keywords = keywords.map((keyword) => {
                    return pluralize.singular(keyword)
                  })
                  newPublicData.keywords = keywords
                  this.props.businessFuncs.updatePublicData(newPublicData).then(() => {
                      this.setState({saved: true})
                  }, (e) => {
                      throw e;
                  })
                }
              }}
            ]}
          ></MenuBar>
      </PageContainer>
        )
      }
    }

  render() {
    return (
      <View>
        {this.renderUI()}
        {this.renderLoadScreen()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
    descriptionBox: {
        height: styleValues.winWidth * 0.5
    },
})