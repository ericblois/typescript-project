import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { styleValues, colors, defaults } from "../HelperFiles/StyleSheet";
import { MenuBar, PageContainer } from "../HelperFiles/CompIndex";
import PropTypes from 'prop-types';

export default class FavouritesPage extends Component {

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