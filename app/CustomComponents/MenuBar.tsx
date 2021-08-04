import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, StyleSheet, ViewStyle, GestureResponderEvent } from "react-native";
import { styleValues, colors, icons, defaults, textStyles, buttonStyles, menuBarStyles, } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import IconButton from "./IconButton";
import { useNavigation  } from "@react-navigation/native";

type Props = {
  buttonProps: IconButton['props'][],
  menuBarStyle?: ViewStyle,
  buttonStyle?: ViewStyle,
  shadow?: boolean
}

type State = {}

export default class MenuBar extends CustomComponent<Props, State> {

  styles: {
    menuBarStyle: ViewStyle;
    buttonStyle: ViewStyle;
  }

  constructor(props: Props) {
    super(props);
    this.styles = StyleSheet.create({
      menuBarStyle: this.props.menuBarStyle ? this.props.menuBarStyle! : {},
      buttonStyle: this.props.buttonStyle ? this.props.buttonStyle! : {}
    })
  }

  render() {
    return (
      <View style={{
          ...menuBarStyles.lightHover,
          ...defaults.mediumShadow,
          ...this.styles.menuBarStyle
        }}
      >
        {
          this.props.buttonProps.map((props, index) => {
            return <IconButton {...props} key={index}/>;
          })
        }

      </View>
    )
  }
}
