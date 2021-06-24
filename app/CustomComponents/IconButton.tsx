import React, { Component } from "react";
import { TouchableOpacity, Image, StyleSheet, ViewStyle, GestureResponderEvent, ImageStyle } from "react-native";
import { defaults, styleValues } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { Icon } from "react-native-elements";

type IconButtonProps = {
  iconSource: number,
  iconStyle?: ImageStyle,
  buttonStyle?: ViewStyle,
  buttonFunc?: (event?: GestureResponderEvent) => void
  buttonProps?: TouchableOpacity['props']
  iconProps?: Partial<Image['props']>
}

type State = {}

export default class IconButton extends Component<IconButtonProps, State> {

  static createButtons(buttonData: IconButtonProps[]) {
    const buttons = buttonData.map((button, index) => {
      return <IconButton iconSource={button.iconSource} buttonFunc={button.buttonFunc} key={index}/>;
    })
    return buttons;
  }

  render() {
    return (
        <TouchableOpacity
        style={[defaults.iconButton, this.props.buttonStyle]}
        onPress={this.props.buttonFunc}
        {...this.props.buttonProps}
      >
        <Image
          style={[defaults.iconImage, this.props.iconStyle]}
          resizeMethod={"scale"}
          resizeMode={"contain"}
          source={this.props.iconSource}
          {...this.props.iconProps}
        />
      </TouchableOpacity>
    )
  }
}
