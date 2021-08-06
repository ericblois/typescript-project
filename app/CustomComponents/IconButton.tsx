import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { TouchableOpacity, Image, StyleSheet, ViewStyle, GestureResponderEvent, ImageStyle, View, Text } from "react-native";
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
  infoProps?: {
    text: string,
    positionHorizontal?: "center" | "left" | "right",
    positionVertical?: "above" | "below" | "beside",
    width?: number
  }
}

type State = {
  showLoading: boolean,
  showInfo: boolean
}

export default class IconButton extends CustomComponent<IconButtonProps, State> {

  constructor(props: IconButtonProps) {
    super(props)
    this.state = {
      showLoading: false,
      showInfo: false
    }
  }

  static createButtons(buttonData: IconButtonProps[]) {
    const buttons = buttonData.map((button, index) => {
      return <IconButton iconSource={button.iconSource} buttonFunc={button.buttonFunc} key={index}/>;
    })
    return buttons;
  }

  renderInfo() {
    if (this.props.infoProps && this.state.showInfo) {
      const posVert = this.props.infoProps.positionVertical ? this.props.infoProps.positionVertical : "above"
      const posHor = this.props.infoProps.positionHorizontal ? this.props.infoProps.positionHorizontal : "center"
      const width = this.props.infoProps.width ? this.props.infoProps.width : this.props.infoProps.text.length*styleValues.mediumTextSize*0.65 + styleValues.mediumPadding*2
      let left = posHor === "right" ? 0 : undefined
      let right = posHor === "left" ? 0 : undefined
      if (posVert === "beside") {
        left = posHor === "left" ? -(width + styleValues.mediumPadding) : undefined
        right = posHor === "right" ? -(width + styleValues.mediumPadding) : undefined
      }
      return (
        <View
          style={{
            ...buttonStyles.noColor,
            ...defaults.smallShadow,
            position: "absolute",
            height: styleValues.winWidth*0.11,
            width: width,
            top: posVert === "above" ? -(styleValues.winWidth*0.1 + styleValues.mediumPadding) : undefined,
            bottom: posVert === "below" ? -(styleValues.winWidth*0.1 + styleValues.mediumPadding) : undefined,
            left: left,
            right: right,
            alignSelf: posHor === "center" ? "center" : undefined,
          }}
        >
          <Text style={{
            ...textStyles.medium,
          }}>{this.props.infoProps.text}</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={[defaults.iconButton, this.props.buttonStyle]}>
        <TouchableOpacity
        onPress={async () => {
          if (this.props.buttonFunc) {
            if (this.props.showLoading === true) {
              this.setState({showLoading: true})
            }
            await this.props.buttonFunc()
            if (this.props.showLoading === true) {
              this.setState({showLoading: false})
            }
          }
        }}
        onLongPress={() => this.setState({showInfo: true})}
        onPressOut={() => this.setState({showInfo: false})}
        {...this.props.buttonProps}
      >
        {!this.state.showLoading ? 
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
      {this.renderInfo()}
      </View>
    )
  }
}
