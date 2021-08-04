import React, { Component } from "react";
import CustomComponent from "./CustomComponent"
import { View, Image, StyleSheet, FlatList, Text, ImageStyle } from "react-native";
import { icons, styleValues, colors } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import IconButton from "../CustomComponents/IconButton";
import { accessPhotos } from "../HelperFiles/ClientFunctions"
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import MapView, { LatLng, Marker, Overlay, Region } from "react-native-maps"

type Props = {
    initialLocation?: LatLng,
    movableMarker: boolean,
    mapMoveCallback?: (region: Region) => void,
    mapProps?: Partial<MapView["props"]>,
    markerProps?: Partial<Marker["props"]>,
    onTapAway?: () => void,
    onSaveLocation?: (region: Region) => void
}

type State = {
}

export default class MapPopup extends CustomComponent<Props, State> {

    currentRegion?: Region

    constructor(props: Props) {
        super(props)
        this.currentRegion = props.initialLocation ? {...props.initialLocation, ...{latitudeDelta: 0.01, longitudeDelta: 0.01}} : undefined
        this.state = {
        }
    }

    renderInitialMarker() {
        if (this.props.initialLocation && !this.props.movableMarker) {
            return (
                <Marker
                    coordinate={this.props.initialLocation}
                    {...this.props.markerProps}
                />
            )
        } else {
            return undefined
        }
    }

    renderMovableMarker() {
        if (this.props.initialLocation && this.props.movableMarker) {
            return (
                <Marker
                    coordinate={this.props.initialLocation}
                    draggable={true}
                    {...this.props.markerProps}
                />
            )
        } else {
            return undefined
        }
    }

    renderCrosshair() {
        if (this.props.movableMarker) {
            return (
                <Image
                    style={styles.mapCrosshair}
                    source={icons.crosshair}
                />
            )
        } else {
            return undefined
        }
    }

    renderSaveButton() {
        if (this.currentRegion && this.props.movableMarker) {
            return (
                <IconButton
                    iconSource={icons.checkBox}
                    buttonStyle={styles.mapButton}
                    iconStyle={{tintColor: colors.whiteColor}}
                    buttonFunc={() => {
                        if (this.props.onSaveLocation) {
                            this.props.onSaveLocation(this.currentRegion!)
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
                <TouchableOpacity
                    style={styles.outsideTouchable}
                    onPress={this.props.onTapAway}
                >
                    <>
                        <MapView
                            style={styles.map}
                            followsUserLocation={true}
                            mapType={"standard"}
                            showsMyLocationButton={true}
                            region={this.props.initialLocation ? {...this.props.initialLocation, ...{latitudeDelta: 0.01, longitudeDelta: 0.01}} as Region : undefined}
                            onRegionChange={(region) => {
                                this.currentRegion = region
                                if (this.props.mapMoveCallback) {
                                    this.props.mapMoveCallback(region)
                                }
                            }}
                            {...this.props.mapProps}
                        >
                            {this.renderInitialMarker()}
                            {this.renderMovableMarker()}
                        </MapView>
                        {this.renderCrosshair()}
                    </>
                </TouchableOpacity>
                {this.renderSaveButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: styleValues.winWidth,
        height: styleValues.winHeight,
        top: 0,
        left:  0,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    outsideTouchable: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        width: "90%",
        height: "50%",
        borderRadius: styleValues.bordRadius
    },
    mapCrosshair: {
        position: "absolute",
        height: styleValues.iconLargeSize,
        width: styleValues.iconLargeSize,
        tintColor: colors.darkGrayColor
    },
    mapButton: {
        position: "absolute",
        top: "76%",
        right: "5%"
    }
})