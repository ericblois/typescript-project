import React, { Component } from "react";
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import { ImageProfileSelector, TextButton, MenuBar } from "../HelperFiles/CompIndex";

type BusinessEditMainNavigationProp = StackNavigationProp<BusinessMainStackParamList, "businessEdit">;

type BusinessEditMainRouteProp = RouteProp<BusinessMainStackParamList, "businessEdit">;

type BusinessEditMainProps = {
    navigation: BusinessEditMainNavigationProp,
    route: BusinessEditMainRouteProp
}

type State = {
}

export default class BusinessEditMainPage extends Component<BusinessEditMainProps, State> {

  render() {
    return (
      <View style={defaults.pageContainer}>
        <Text style={styles.editHeader}>Your Business Page</Text>
        <ImageProfileSelector></ImageProfileSelector>
        <TextButton
            text={"Edit your info page"}
            buttonStyle={defaults.textButtonNoColor}
            textStyle={{}}
            rightIconSource={icons.chevron}
            rightIconStyle={{transform: [{scaleX: -1}]}}
            buttonFunc={() => {
                this.props.navigation.navigate("editInfo")
            }}
        ></TextButton>
        <TextButton
            text={"Edit your products / services"}
            buttonStyle={defaults.textButtonNoColor}
            textStyle={{fontSize: styleValues.smallTextSize}}
            rightIconSource={icons.chevron}
            rightIconStyle={{transform: [{scaleX: -1}]}}
        ></TextButton>
        <TextButton
            text={"Location & delivery options"}
            buttonStyle={defaults.textButtonNoColor}
            textStyle={{fontSize: styleValues.smallTextSize}}
            rightIconSource={icons.chevron}
            rightIconStyle={{transform: [{scaleX: -1}]}}
            buttonFunc={() => {
              this.props.navigation.navigate("editLocation")
            }}
        ></TextButton>
        <MenuBar
          //buttonProps={this.state.inEditMode ? this.getEditButtons(props) : this.getMainButtons(props)}
          buttonProps={[
            {iconSource: icons.store, buttonFunc: () => {this.props.navigation.navigate("businessEdit")},},
            {iconSource: icons.profile, buttonFunc: () => {this.props.navigation.navigate("account")}}
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    editHeader: {
        fontSize: styleValues.largeTextSize,
        marginBottom: styleValues.majorPadding
    }
})