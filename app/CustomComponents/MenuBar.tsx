import React, { Component } from "react";
import { View, StyleSheet, ViewStyle, GestureResponderEvent } from "react-native";
import { styleValues, colors, icons, defaults } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import IconButton from "./IconButton";
import { useNavigation  } from "@react-navigation/native";

type Props = {
  buttonProps: IconButton['props'][],
  menuBarStyle?: ViewStyle,
  buttonStyle?: ViewStyle
}

type State = {}

export default class MenuBar extends Component<Props, State> {

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
      <View style={[defaults.menuBarNoColor, this.styles.menuBarStyle]}>
        {
          this.props.buttonProps.map((props, index) => {
            return <IconButton {...props} key={index}/>;
          })
        }
      </View>
    )
  }
}
