import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';

export default class NotificationsPage extends Component {

  static propTypes = {
    navigation: PropTypes.object,
      route: PropTypes.object,
    
  }

  render() {
    return (
      <View style={defaults.pageContainer}>
        <Text>notifications</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

})