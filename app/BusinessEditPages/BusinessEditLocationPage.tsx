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
import ToggleSwitch from "../CustomComponents/ToggleSwitch";
import TextInputBox from "../CustomComponents/TextInputBox";
import DropDownPicker from "react-native-dropdown-picker";
import TextDropdown from "../CustomComponents/TextDropdown";

type BusinessEditLocationNavigationProp = StackNavigationProp<BusinessMainStackParamList, "editLocation">;

type BusinessEditLocationRouteProp = RouteProp<BusinessMainStackParamList, "editLocation">;

type BusinessEditLocationProps = {
    navigation: BusinessEditLocationNavigationProp,
    route: BusinessEditLocationRouteProp,
    businessFuncs: BusinessFunctions
}

type State = {
    privateData?: PrivateBusinessData,
    publicData?: PublicBusinessData,
    currentLocation?: {latitude: number, longitude: number},
    showCurrentLocation: boolean,
    showChooseLocation: boolean,
    saved: boolean
}

export default class BusinessEditLocationPage extends Component<BusinessEditLocationProps, State> {

    constructor(props: BusinessEditLocationProps) {
        super(props)
        this.state = {
            privateData: undefined,
            publicData: undefined,
            showCurrentLocation: false,
            showChooseLocation: false,
            saved: true
        }
        props.navigation.addListener("focus", (event) => {
            this.refreshData()
        })
        this.refreshData()
    }

    refreshData() {
        this.props.businessFuncs.getPrivateData().then((privateData) => {
            this.props.businessFuncs.getPublicData().then((publicData) => {
                this.setState({privateData: privateData, publicData: publicData})
            })
        })
    }

    renderViewLocationButton() {
        if (this.state.privateData?.coords) {
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
                    initialLocation={this.state.privateData?.coords as LatLng}
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
                        let newPrivateData = this.state.privateData
                        if (newPrivateData) {
                            newPrivateData.coords = {latitude: region.latitude, longitude: region.longitude}
                        }
                        this.setState({
                            showChooseLocation: false, 
                            privateData: newPrivateData, saved: false})
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
                        let newPrivateData = this.state.privateData
                        if (newPrivateData) {
                            newPrivateData.coords = {latitude: position.coords.latitude, longitude: position.coords.longitude}
                        }
                        this.setState({privateData: newPrivateData, saved: false})
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
        <ToggleSwitch
            text={"Offer local delivery"}
        />
        <ToggleSwitch
            text={"Offer shipping (within country)"}
        />
        <ToggleSwitch
            text={"Offer international shipping"}
        />
        <TextInputBox
            textProps={{
                placeholder: "Street address",
                onChangeText: (text) => {
                    let publicData = this.state.publicData
                    if (publicData) {
                        publicData.address = text
                        this.setState({publicData: publicData, saved: false})
                    }
                }
            }}
        />
        <TextInputBox
            textProps={{
                placeholder: "Postal code / ZIP",
                onChangeText: (text) => {
                    let publicData = this.state.publicData
                    if (publicData) {
                        publicData.postalCode = text
                        this.setState({publicData: publicData, saved: false})
                    }
                }
            }}
        />
        <TextInputBox
            textProps={{
                placeholder: "City",
                onChangeText: (text) => {
                    let publicData = this.state.publicData
                    if (publicData) {
                        publicData.city = text
                        this.setState({publicData: publicData, saved: false})
                    }
                }
            }}
        />
        <TextInputBox
            textProps={{
                placeholder: "Province / State",
                onChangeText: (text) => {
                    let publicData = this.state.publicData
                    if (publicData) {
                        publicData.region = text
                        this.setState({publicData: publicData, saved: false})
                    }
                }
            }}
        />
        <TextDropdown
            items={[
                {
                    label: "Canada",
                    value: "canada"
                },
                {
                    label: "United States",
                    value: "united_states"
                }
            ]}
            extraProps={{
                placeholder: "Country",
                defaultValue: this.state.publicData?.country,
                onChangeItem: (item) => {
                    let publicData = this.state.publicData
                    if (publicData) {
                        publicData.country = item.value
                        this.setState({publicData: publicData, saved: false})
                    }
                }
            }}
        />
        <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? styleValues.validColor : styleValues.invalidColor}, buttonFunc: () => {
                    if (this.state.privateData && this.state.publicData) {
                        this.props.businessFuncs.updatePrivateData(this.state.privateData).then(() => {
                            this.props.businessFuncs.updatePublicData(this.state.publicData!).then(() => {
                                this.setState({saved: true})
                            }, (e) => {throw e})
                        }, (e) => {throw e})
                    }
                }}
              ]}
        />
        {this.renderCurrentLocationMap()}
        {this.renderChooseLocationMap()}
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