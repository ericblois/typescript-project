import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import PageContainer from "../CustomComponents/PageContainer";

export default class NotificationsPage extends CustomComponent {

  static propTypes = {
    navigation: PropTypes.object,
      route: PropTypes.object,
    
  }

  render() {
    return (
      <PageContainer>
        <Text>notifications</Text>
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({

})