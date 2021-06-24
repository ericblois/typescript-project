import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import { MenuBar } from "../HelperFiles/CompIndex";
import PropTypes from 'prop-types';

export default class FavouritesPage extends Component {

  static propTypes = {
    navigation: PropTypes.object,
      route: PropTypes.object,
    
  }

  render() {
    return (
      <View style={defaults.pageContainer}>
        <Text>favourites</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

})