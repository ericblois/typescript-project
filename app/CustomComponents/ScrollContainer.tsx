import React, { Component } from "react"
import { TouchableWithoutFeedback, Keyboard, View, ScrollViewProps, KeyboardAvoidingView } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import GradientView from "../CustomComponents/GradientView"
import { defaults, styleValues } from "../HelperFiles/StyleSheet"

type Props = {
    scrollProps?: ScrollViewProps,
    avoidKeyboard?: boolean
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        flex: 1,
                        width: styleValues.winWidth - styleValues.mediumPadding*2
                    }}
                >
                    <ScrollView
                        style={{width: "100%", height: "100%"}}
                        contentContainerStyle={{paddingTop: styleValues.mediumPadding, width: "100%"}}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        {...this.props.scrollProps}
                    >
                        <View
                            onStartShouldSetResponder={() => (true)}
                            style={{alignItems: "center"}}
                        >
                            {this.renderChildren()}
                        </View>
                    </ScrollView>
                    <GradientView/>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}