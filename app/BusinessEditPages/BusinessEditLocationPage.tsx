import React, { Component } from "react";
import { View, Text, StyleSheet, } from "react-native";
import { styleValues, defaults, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import TextButton from "../CustomComponents/TextButton";
import { auth } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessMainStackParamList } from "../HelperFiles/Navigation"
import ImageProfileSelector from "../CustomComponents/ImageProfileSelector";
import { PrivateBusinessData, PublicBusinessData } from "../HelperFiles/DataTypes";
import MapPopup from "../CustomComponents/MapPopup";
import { LatLng } from "react-native-maps";
import MenuBar from "../CustomComponents/MenuBar";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";

type BusinessEditLocationNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editLocation">;

type BusinessEditLocationRouteProp = RouteProp<BusinessMainStackParamList, "editLocation">;

type BusinessEditLocationProps = {
    navigation: BusinessEditLocationNavigationProp,
    route: BusinessEditLocationRouteProp,
    privateBusinessData?: PrivateBusinessData,
    businessFuncs: BusinessFunctions
}

type State = {
    businessCoords?: {latitude: number, longitude: number},
    currentLocation?: {latitude: number, longitude: number},
    showCurrentLocation: boolean,
    showChooseLocation: boolean,
    saved: boolean
}

export default class BusinessEditLocationPage extends Component<BusinessEditLocationProps, State> {

    constructor(props: BusinessEditLocationProps) {
        super(props)
        this.state = {
            businessCoords: props.privateBusinessData?.coords,
            showCurrentLocation: false,
            showChooseLocation: false,
            saved: true
        }
    }

    renderViewLocationButton() {
        if (this.state.businessCoords) {
            return (
                <TextButton
                    text={"View current location"}
                    buttonStyle={defaults.textButtonNoColor}
                    textStyle={{}}
                    rightIconSource={icons.chevron}
                    rightIconStyle={{transform: [{scaleX: -1}]}}
                    buttonFunc={() => {
                        this.setState({showCurrentLocation: true})
                    }}
                />
            )
        } else {
            return undefined
        }
    }

    renderCurrentLocationMap() {
        if (this.state.showCurrentLocation) {
            return (
                <MapPopup
                    initialLocation={this.state.businessCoords as LatLng}
                    movableMarker={false}
                    onTapAway={() => {
                        this.setState({showCurrentLocation: false})
                    }}
                />
            )
        } else {
            return undefined
        }
    }

    renderChooseLocationMap() {
        if (this.state.showChooseLocation && this.state.currentLocation) {
            return (
                <MapPopup
                    initialLocation={{latitude: this.state.currentLocation.latitude, longitude: this.state.currentLocation.longitude}}
                    movableMarker={true}
                    onSaveLocation={(region) => {
                        this.setState({
                            showChooseLocation: false, 
                            businessCoords: {latitude: region.latitude, longitude: region.longitude}, saved: false})
                    }}
                    onTapAway={() => {
                        this.setState({showChooseLocation: false})
                    }}
                />
            )
        }
        return undefined
    }

  render() {
    return (
      <View style={defaults.pageContainer}>
        <Text style={styles.header}>Location & Delivery</Text>
        {this.renderViewLocationButton()}
        <View style={styles.divider}>
            <Text style={{...defaults.smallTextHeader, ...styles.dividerHeader}}>Edit your location</Text>
            <TextButton
                text={"Current location"}
                buttonStyle={{...defaults.textButtonNoColor, ...styles.dividerButton}}
                textStyle={{}}
                rightIconSource={icons.location}
                rightIconStyle={{transform: [{scaleX: -1}]}}
                buttonFunc={() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.setState({businessCoords: {latitude: position.coords.latitude, longitude: position.coords.longitude}, saved: false})
                    }, (e) => {
                        throw e;
                    })
                }}
            />
            <TextButton
                text={"Choose a location"}
                buttonStyle={{...defaults.textButtonNoColor, ...styles.dividerButton}}
                textStyle={{}}
                rightIconSource={icons.chevron}
                rightIconStyle={{transform: [{scaleX: -1}]}}
                buttonFunc={() => {
                    if (this.state.currentLocation) {
                        this.setState({showChooseLocation: true})
                    } else {
                        navigator.geolocation.getCurrentPosition((position) => {
                            this.setState({
                                showChooseLocation: true,
                                currentLocation: {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                }
                            })
                        })
                    }
                }}
            />
        </View>
        {this.renderCurrentLocationMap()}
        {this.renderChooseLocationMap()}
        <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? styleValues.validColor : styleValues.invalidColor}, buttonFunc: () => {
                    if (this.state.businessCoords) {
                        this.props.businessFuncs.updatePrivateData({
                            coords: this.state.businessCoords
                        }).then(() => {
                            this.setState({saved: true})
                        }, (e) => {
                            throw e;
                        })
                    }
                }}
              ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    header: {
        fontSize: styleValues.largeTextSize,
        marginBottom: styleValues.majorPadding
    },
    divider: {
        width: "100%",
        borderWidth: styleValues.minorBorderWidth,
        borderRadius: styleValues.bordRadius,
        padding: styleValues.minorPadding,
    },
    dividerButton: {
        marginVertical: 0,
        borderWidth: 0,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: styleValues.greyColor,
    },
    dividerHeader: {
        
    }
})