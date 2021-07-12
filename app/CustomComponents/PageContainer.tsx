import React, { Component } from "react"
import { TouchableWithoutFeedback, Keyboard, View, ScrollViewProps } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { defaults, styleValues } from "../HelperFiles/StyleSheet"

export default class PageContainer extends Component {

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={defaults.pageContainer}
                    onStartShouldSetResponder={() => (true)}
                >
                    {this.props.children}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}