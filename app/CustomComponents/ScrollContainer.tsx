import React, { Component } from "react"
import { TouchableWithoutFeedback, Keyboard, View, ScrollViewProps, KeyboardAvoidingView, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import GradientView from "../CustomComponents/GradientView"
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet"

type Props = ScrollViewProps & {
    containerStyle?: ViewStyle,
    avoidKeyboard?: boolean,
    fade?: boolean,
    fadeStartColor?: string,
    fadeEndColor?: string,
}

type State = {}

export default class ScrollContainer extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
    }

    renderChildren() {
        if (this.props.avoidKeyboard === true) {
            return (
                <KeyboardAvoidingView
                    behavior={"position"}
                >
                    {this.props.children}
                </KeyboardAvoidingView>
            )
        } else {
            return this.props.children
        }
    }

    render() {
        return (
            <View style={this.props.containerStyle}>
                <ScrollView
                    style={{width: "100%", height: "100%"}}
                    contentContainerStyle={{
                        padding: styleValues.mediumPadding,
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    {...this.props}
                >
                    <View
                        onStartShouldSetResponder={() => (true)}
                        style={{alignItems: "center"}}
                    >
                        {this.renderChildren()}
                    </View>
                </ScrollView>
                {this.props.fade === false ? undefined : 
                    <GradientView
                        horizontal={this.props.horizontal === true}
                        fadeStartColor={this.props.fadeStartColor}
                        fadeEndColor={this.props.fadeEndColor}
                    />
                }
            </View>
        )
    }
}