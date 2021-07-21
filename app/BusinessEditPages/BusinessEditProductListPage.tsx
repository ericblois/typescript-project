import React, { Component } from "react";
import { View, Text, StyleSheet, ImageURISource, ScrollView, ActivityIndicator } from "react-native";
import { styleValues, colors, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import TextInputBox from "../CustomComponents/TextInputBox";
import { ProductCategory, PublicBusinessData } from "../HelperFiles/DataTypes";
import * as Permissions from 'expo-permissions';
import { GradientView, ImageSliderSelector, MapPopup, MenuBar, PageContainer, TextInputPopup } from "../HelperFiles/CompIndex";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { FlatList } from "react-native-gesture-handler";
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SortableList from 'react-native-sortable-list';
import Row from 'react-native-sortable-list';
import UserFunctions from "../HelperFiles/UserFunctions";

type BusinessEditProductListNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editProductList">;

type BusinessEditProductListRouteProp = RouteProp<BusinessMainStackParamList, "editProductList">;

type BusinessEditProductListProps = {
    navigation: BusinessEditProductListNavigationProp,
    route: BusinessEditProductListRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    publicData?: PublicBusinessData,
    showPopup: boolean,
    saved: boolean
}

export default class BusinessEditProductListPage extends Component<BusinessEditProductListProps, State> {

    constructor(props: BusinessEditProductListProps) {
        super(props)
        this.state = {
          publicData: undefined,
          showPopup: false,
          saved: true
        }
        props.navigation.addListener("focus", (event) => {
          this.refreshData()
        })
    }

    componentDidMount() {
      this.refreshData()
  }

    refreshData() {
      this.props.businessFuncs.getPublicData().then((publicData) => {
        this.setState({publicData: publicData})
      })
    }

    renderTextPopup() {
      if (this.state.showPopup) {
        return (
          <TextInputPopup
            onTapAway={() => {this.setState({showPopup: false})}}
            onSaveText={(text) => {
              let newPublicData = this.state.publicData
              if (newPublicData) {
                newPublicData.productList.push({
                  name: text,
                  productIDs: []
                })
                this.setState({
                  publicData: newPublicData,
                  showPopup: false,
                  saved: false
                })
              }
            }}
            textInputProps={{
              textProps: {
                placeholder: "Name of new category",
              }
            }}
          />
        )
      }
    }

    renderCategoryCard(params: RenderItemParams<ProductCategory>) {
      return (
        <TextButton
          text={params.item.name}
          buttonStyle={{...defaults.textButtonNoColor, ...{justifyContent: "space-between"}}}
          rightIconSource={icons.chevron}
          rightIconStyle={{transform: [{scaleX: -1}]}}
          buttonFunc={async () => {
            if (!this.state.saved && this.state.publicData) {
              await this.props.businessFuncs.updatePublicData(this.state.publicData)
              this.setState({saved: true})
            }
            this.props.navigation.navigate("editProductCat", {productCategory: params.item.name})
          }}
          touchableProps={{
            onLongPress: params.drag
          }}
        />
      )
    }

    // Render the UI once loading is complete
    renderUI() {
      if (this.state.publicData) {
        return (
          <PageContainer>
            <Text
              style={styles.headerText}
            >
              Categories
            </Text>
            <View style={{flex: 1}}>
              <DraggableFlatList
                containerStyle={styles.list}
                data={this.state.publicData ? this.state.publicData.productList : []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(params) => {return this.renderCategoryCard(params)}}
                onDragEnd={(params) => {
                  let publicData = this.state.publicData
                  if (publicData) {
                    publicData.productList = params.data
                  }
                  this.setState({publicData: publicData, saved: false})
                }}
                ListHeaderComponent={() => (<View style={{height: styleValues.mediumPadding}}/>)}
                ListFooterComponent={() => (<View style={{height: styleValues.mediumPadding}}/>)}
              />
              <GradientView/>
            </View>
            <MenuBar
              buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                {iconSource: icons.plus, buttonFunc: () => {this.setState({showPopup: true})}},
                {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: () => {
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
            {this.renderTextPopup()}
          </PageContainer>
        )
      }
    }
    // Render a loading indicator over the UI while images and data load
    renderLoadScreen() {
      if (this.state.publicData === undefined) {
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
    headerText: {
      fontSize: styleValues.largerTextSize
    },
    list: {
      width: "100%",
    },
})