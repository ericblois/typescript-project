import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Image, StyleSheet, ViewStyle, GestureResponderEvent, ImageStyle } from "react-native";
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { Icon } from "react-native-elements";
import LoadingCover from "./LoadingCover";

type IconButtonProps = {
  iconSource: number,
  iconStyle?: ImageStyle,
  buttonStyle?: ViewStyle,
  buttonFunc?: (event?: GestureResponderEvent) => void | Promise<void>
  buttonProps?: TouchableOpacity['props']
  iconProps?: Partial<Image['props']>,
  showLoading?: boolean,
}

type State = {
  loading: boolean
}

export default class IconButton extends CustomComponent<IconButtonProps, State> {

  constructor(props: IconButtonProps) {
    super(props)
    this.state = {
      loading: false
    }
  }

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
        onPress={async () => {
          if (this.props.buttonFunc) {
            if (this.props.showLoading === true) {
              this.setState({loading: true})
            }
            await this.props.buttonFunc()
            if (this.props.showLoading === true) {
              this.setState({loading: false})
            }
          }
        }}
        {...this.props.buttonProps}
      >
        {!this.state.loading ? 
          <Image
            style={{
              ...defaults.iconImage,
              ...this.props.iconStyle
            }}
            resizeMethod={"scale"}
            resizeMode={"contain"}
            source={this.props.iconSource}
            {...this.props.iconProps}
          /> :
          <LoadingCover
            size={"small"}
            style={{
              backgroundColor: "transparent"
            }}
          />
        }
      </TouchableOpacity>
    )
  }
}
