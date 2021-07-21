import React, { Component } from "react";
import { View, Image, StyleSheet, FlatList, Text, ImageStyle } from "react-native";
import { icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import IconButton from "../CustomComponents/IconButton";
import { accessPhotos } from "../HelperFiles/ClientFunctions"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";

type Props = {
    uri?: string,
    loadResponse?: () => void,
}

type State = {
    uri?: string,
    saved: boolean
}

export default class ImageProfileSelector extends Component<Props, State> {

    initialURI?: string

    constructor(props: Props) {
        super(props)
        this.state = {
            uri: props.uri,
            saved: true
        }
        this.initialURI = this.props.uri
    }

    replaceImage(uri: string) {
        this.setState({uri: uri, saved: false})
    }

    renderImage() {
        if (this.state.uri) {
            return (
                <Image
                    source={{uri: this.state.uri!}}
                    style={styles.profileImage}
                    resizeMethod={"scale"}
                    resizeMode={"cover"}
                />
            )
        } else {
            return (
                <View style={styles.noProfileView}>
                    <Text style={styles.noProfileText}>Add a profile image</Text>
                </View>
            )
        }
    }

    renderSaveButton() {
        if (this.state.saved) {
            return
        } else {
            return (
                <IconButton
                    buttonStyle={styles.saveIcon}
                    iconSource={icons.checkBox}
                    iconStyle={{tintColor: colors.whiteColor}}
                    buttonFunc={async () => {
                        const result = await accessPhotos()
                        if (result) {
                            this.replaceImage(result)
                        }
                    }}
                />
            )
        }
    }

    render() {
        return (
            <View
                style={styles.container}
            >
                {this.renderImage()}
                <IconButton
                    buttonStyle={styles.editIcon}
                    iconSource={icons.edit}
                    iconStyle={{tintColor: colors.whiteColor}}
                    buttonFunc={async () => {
                        const result = await accessPhotos()
                        if (result) {
                            this.replaceImage(result)
                        }
                    }}
                />
                {this.renderSaveButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: styleValues.winWidth / 2,
        width: styleValues.winWidth / 2,
        marginBottom: styleValues.mediumPadding,
        borderRadius: styleValues.bordRadius,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: styleValues.bordRadius
    },
    noProfileView: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.lightColor,
        borderRadius: styleValues.bordRadius,
        borderColor: colors.darkColor,
        borderWidth: styleValues.minorBorderWidth,
    },
    noProfileText: {
        textAlignVertical: "center",
        textAlign: "center",
        color: colors.darkColor,
        fontSize: styleValues.smallTextSize,
        marginBottom: styleValues.mediumPadding
    },
    editIcon: {
        position: "absolute",
        width: styleValues.iconMediumSize,
        height: styleValues.iconMediumSize,
        bottom: styleValues.mediumPadding,
        left: styleValues.mediumPadding,
    },
    saveIcon: {
        position: "absolute",
        width: styleValues.iconMediumSize,
        height: styleValues.iconMediumSize,
        bottom: styleValues.minorPadding,
        right: styleValues.mediumPadding,
    }
})