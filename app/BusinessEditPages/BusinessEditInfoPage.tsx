import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth, iconButtonTemplates } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { ConfirmationPopup, ImageSliderSelector, LoadingCover, MapPopup, MenuBar, PageContainer, TextHeader, TextInfoPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { extractKeywords, getCompressedImage, prefetchImages } from "../HelperFiles/ClientFunctions";
import * as pluralize from "pluralize"

type BusinessEditInfoNavigationProp = StackNavigationProp<BusinessEditStackParamList, "editInfo">;

type BusinessEditInfoRouteProp = RouteProp<BusinessEditStackParamList, "editInfo">;

type BusinessEditInfoProps = {
    navigation: BusinessEditInfoNavigationProp,
    route: BusinessEditInfoRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    publicData?: PublicBusinessData,
    imagesLoaded: boolean,
    infoPopupText?: string,
    showSavePopup: boolean,
    saved: boolean
}

export default class BusinessEditInfoPage extends CustomComponent<BusinessEditInfoProps, State> {

    constructor(props: BusinessEditInfoProps) {
        super(props)
        this.state = {
          publicData: undefined,
          imagesLoaded: false,
          infoPopupText: undefined,
          showSavePopup: false,
          saved: true
        }
        props.navigation.addListener("focus", () => this.refreshData())
    }

    componentDidMount() {
      this.refreshData()
    }

    async refreshData() {
      const publicData = await this.props.businessFuncs.getPublicData()
      this.setState({publicData: publicData})
    }

    updatePublicData(publicData: Partial<PublicBusinessData>, stateUpdates?: Partial<State>, callback?: () => void) {
      let newPublicData = {...this.state.publicData} as PublicBusinessData | undefined
      if (newPublicData) {
        newPublicData = {
          ...newPublicData,
          ...publicData
        }
        let stateUpdate: Partial<State> = {
          ...stateUpdates,
          publicData: newPublicData,
          saved: false
        }
        this.setState(stateUpdate, callback)
      }
    }

    renderInfoPopup() {
      if (this.state.infoPopupText) {
        return (
          <TextInfoPopup
          headerText={"Edit Public Info"}
            onExit={() => this.setState({infoPopupText: undefined})}
          >{this.state.infoPopupText}</TextInfoPopup>
        )
      }
    }

    renderSavePopup() {
      if (this.state.showSavePopup) {
        return (
          <ConfirmationPopup
            type={"save"}
            onExit={() => this.setState({showSavePopup: false})}
            onDeny={() => {
              this.setState({saved: true, showSavePopup: false}, () => {
                this.props.navigation.goBack()
              })
            }}
            onConfirm={async () => {
              if (this.state.publicData) {
                await this.props.businessFuncs.updatePublicData(this.state.publicData)
              }
              this.setState({showSavePopup: false, saved: true}, () => {
                this.props.navigation.goBack()
              })
            }}
          />
        )
      }
    }

    renderUI() {
      if (this.state.publicData) {
        return (
          <View style={{
            alignItems: "center",
            paddingTop: defaults.textHeaderBox.height+ styleValues.mediumPadding,
            width: styleValues.winWidth,
            paddingHorizontal: styleValues.mediumPadding
            }}
          >
            <ImageSliderSelector
              uris={this.state.publicData ? this.state.publicData.galleryImages: []}
              onChange={(uris) => {
                this.updatePublicData({galleryImages: uris.all})
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
                onChangeText: (text) => this.updatePublicData({name: text})
              }}
              validateFunc={(text) => (text.length > 2)}
              avoidKeyboard={true}
            ></TextInputBox>
            {/* Business Type */}
            <TextInputBox
              textProps={{
                  defaultValue: this.state.publicData?.businessType,
                  placeholder: "Business Type (ex. 'Cafe')",
                  onChangeText: (text) => this.updatePublicData({businessType: text})
              }}
              validateFunc={(text) => (text.length > 2)}
              avoidKeyboard={true}
            ></TextInputBox>
            {/* Description */}
            <TextInputBox
              boxStyle={styles.descriptionBox}
              textStyle={{fontSize: styleValues.smallerTextSize}}
              textProps={{
                  defaultValue: this.state.publicData?.description,
                  placeholder: "Description",
                  multiline: true,
                  onChangeText: (text) => this.updatePublicData({description: text})
              }}
              validateFunc={(text) => (text.length > 2)}
              avoidKeyboard={true}
            ></TextInputBox>
            <TextHeader
              infoButtonFunc={() => {
                this.setState({infoPopupText: "Your business' info is the first thing a customer will see when they view your page."})
              }}
            >Business Info</TextHeader>
          </View>
        )
      }
    }

    renderLoading() {
      if (!this.state.publicData || !this.state.imagesLoaded) {
        return (
          <LoadingCover size={"large"}/>
        )
      }
    }

  render() {
    return (
      <PageContainer>
        {this.renderUI()}
        {this.renderLoading()}
        <MenuBar
          buttonProps={[
            {
              ...iconButtonTemplates.back,
              buttonFunc: () => this.props.navigation.goBack()
            },{
              ...iconButtonTemplates.save,
              iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor},
              buttonFunc: async () => {
                if (this.state.publicData) {
                  const newPublicData = this.state.publicData
                  // Extract keywords from title and description
                  const keywordsSource = `${newPublicData.name} ${newPublicData.description}`
                  let keywords = extractKeywords(keywordsSource)
                  keywords = keywords.map((keyword) => {
                    return pluralize.singular(keyword)
                  })
                  newPublicData.keywords = keywords
                  await this.props.businessFuncs.updatePublicData(newPublicData)
                  this.setState({saved: true})
                }
              }
            }
          ]}
        ></MenuBar>
        {this.renderInfoPopup()}
        {this.renderSavePopup()}
      </PageContainer>
    )
  }
}

const styles = StyleSheet.create({
    descriptionBox: {
        height: styleValues.winWidth * 0.5
    },
})