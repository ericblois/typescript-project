import React, { Component } from "react"
import { TouchableWithoutFeedback, Keyboard, View, ScrollViewProps, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { defaults, textStyles, buttonStyles, styleValues, colors } from "../HelperFiles/StyleSheet"

type Props = {
    style?: ViewStyle
}

type State = {}

export default class PageContainer extends Component<Props, State> {

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{...defaults.pageContainer, ...this.props.style}}
                    onStartShouldSetResponder={() => (true)}
                >
                    {this.props.children}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}