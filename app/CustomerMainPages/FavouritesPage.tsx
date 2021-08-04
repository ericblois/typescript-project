import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet } from "react-native";

import { styleValues, colors, defaults, textStyles, buttonStyles, } from "../HelperFiles/StyleSheet";
import { MenuBar, PageContainer } from "../HelperFiles/CompIndex";
import PropTypes from 'prop-types';

export default class FavouritesPage extends CustomComponent {

  static propTypes = {
    navigation: PropTypes.object,
      route: PropTypes.object,
    
  }

  render() {
    return (
      <PageContainer>
        <Text>favourites</Text>
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({

})