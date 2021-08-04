import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, KeyboardAvoidingView, } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons, menuBarHeight } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { auth, geofire } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import { PrivateBusinessData, PublicBusinessData } from "../HelperFiles/DataTypes";
import { LatLng } from "react-native-maps";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { MapPopup, MenuBar, PageContainer, ScrollContainer, TextButton, TextDropdown, TextInputBox, ToggleSwitch } from "../HelperFiles/CompIndex"

type BusinessEditLocationNavigationProp = StackNavigationProp<BusinessEditStackParamList, "editLocation">;

type BusinessEditLocationRouteProp = RouteProp<BusinessEditStackParamList, "editLocation">;

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

export default class BusinessEditLocationPage extends CustomComponent<BusinessEditLocationProps, State> {

    constructor(props: BusinessEditLocationProps) {
        super(props)
        this.state = {
            privateData: undefined,
            publicData: undefined,
            currentLocation: undefined,
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

    updateLocation(lat: number, long: number) {
        let newPrivateData = this.state.privateData
        if (newPrivateData) {
            newPrivateData.coords = {latitude: lat, longitude: long}
        }
        let newPublicData = this.state.publicData
        if (newPublicData) {
            const hash = geofire.geohashForLocation([
                lat,
                long
            ])
            newPublicData.geohash = hash
            newPublicData.coords = {latitude: lat, longitude: long}
        }
        this.setState({
            showChooseLocation: false, 
            privateData: newPrivateData,
            publicData: newPublicData,
            saved: false
        })
    }

    renderViewLocationButton() {
        if (this.state.privateData?.coords) {
            return (
                <TextButton
                    text={"View current location"}
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
                        this.updateLocation(region.latitude, region.longitude)
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
    <PageContainer>
        <Text style={textStyles.largerHeader}>Location & Delivery</Text>
        <ScrollContainer
            containerStyle={{
                width: styleValues.winWidth,
            }}
            contentContainerStyle={{
                paddingHorizontal: styleValues.mediumPadding,
                paddingBottom: menuBarHeight + styleValues.mediumPadding
            }}
            avoidKeyboard
        >
            {this.renderViewLocationButton()}
            <View style={styles.divider}>
                <Text style={{...textStyles.small, ...styles.dividerHeader}}>Edit your location</Text>
                {/* Get current location */}
                <TextButton
                    text={"Current location"}
                    buttonStyle={{...buttonStyles.noColor, ...styles.dividerButton}}
                    textStyle={{}}
                    rightIconSource={icons.location}
                    rightIconStyle={{transform: [{scaleX: -1}]}}
                    buttonFunc={() => {
                        navigator.geolocation.getCurrentPosition((position) => {
                            this.updateLocation(position.coords.latitude, position.coords.longitude)
                        }, (e) => {
                            throw e;
                        })
                    }}
                ></TextButton>
                {/* Choose location */}
                <TextButton
                    text={"Choose a location"}
                    buttonStyle={{...buttonStyles.noColor, ...styles.dividerButton}}
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
                ></TextButton>
            </View>
            {/* In store pickup */}
            <ToggleSwitch
                style={{marginBottom: styleValues.mediumPadding}}
                text={"Offer in-store pickup"}
                onToggle={(value) => {
                    let newPublicData = this.state.publicData
                    if (newPublicData) {
                        newPublicData.deliveryMethods.pickup = value
                        this.setState({publicData: newPublicData, saved: false})
                    }
                }}
            ></ToggleSwitch>
            {/* Local delivery */}
            <ToggleSwitch
                style={{marginBottom: styleValues.mediumPadding}}
                text={"Offer local delivery"}
                onToggle={(value) => {
                    let newPublicData = this.state.publicData
                    if (newPublicData) {
                        newPublicData.deliveryMethods.local = value
                        this.setState({publicData: newPublicData, saved: false})
                    }
                }}
            ></ToggleSwitch>
            {/* National shipping */}
            <ToggleSwitch
                style={{marginBottom: styleValues.mediumPadding}}
                text={"Offer shipping (within country)"}
                onToggle={(value) => {
                    let newPublicData = this.state.publicData
                    if (newPublicData) {
                        newPublicData.deliveryMethods.country = value
                        this.setState({publicData: newPublicData, saved: false})
                    }
                }}
            ></ToggleSwitch>
            {/* International shipping */}
            <ToggleSwitch
                style={{marginBottom: styleValues.mediumPadding}}
                text={"Offer international shipping"}
                onToggle={(value) => {
                    let newPublicData = this.state.publicData
                    if (newPublicData) {
                        newPublicData.deliveryMethods.country = value
                        this.setState({publicData: newPublicData, saved: false})
                    }
                }}
            ></ToggleSwitch>
            <View style={{
                borderWidth: styleValues.minorBorderWidth,
                borderRadius: styleValues.bordRadius,
                borderColor: colors.grayColor,
                width: "100%",
                alignItems: "center",
                marginVertical: styleValues.mediumPadding,
                paddingVertical: styleValues.mediumPadding
            }}>
                <Text
                    style={textStyles.small}
                >Edit your public address</Text>
            </View>
            {/* Street Address */}
            <TextInputBox
                textProps={{
                    placeholder: "Street address",
                    defaultValue: this.state.publicData?.address,
                    onChangeText: (text) => {
                        let publicData = this.state.publicData
                        if (publicData) {
                            publicData.address = text
                            this.setState({publicData: publicData, saved: false})
                        }
                    }
                }}
            ></TextInputBox>
            {/* Postal code */}
            <TextInputBox
                textProps={{
                    placeholder: "Postal code / ZIP",
                    defaultValue: this.state.publicData?.postalCode,
                    onChangeText: (text) => {
                        let publicData = this.state.publicData
                        if (publicData) {
                            publicData.postalCode = text
                            this.setState({publicData: publicData, saved: false})
                        }
                    }
                }}
            ></TextInputBox>
            {/* City */}
            <TextInputBox
                textProps={{
                    placeholder: "City",
                    defaultValue: this.state.publicData?.city,
                    onChangeText: (text) => {
                        let publicData = this.state.publicData
                        if (publicData) {
                            publicData.city = text
                            this.setState({publicData: publicData, saved: false})
                        }
                    }
                }}
            ></TextInputBox>
            {/* Province */}
            <TextInputBox
                textProps={{
                    placeholder: "Province / State",
                    defaultValue: this.state.publicData?.region,
                    onChangeText: (text) => {
                        let publicData = this.state.publicData
                        if (publicData) {
                            publicData.region = text
                            this.setState({publicData: publicData, saved: false})
                        }
                    }
                }}
            ></TextInputBox>
            {/* Country */}
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
                dropdownProps={{
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
            ></TextDropdown>
        </ScrollContainer>
        <View style={{
                position: "absolute",
                top: 0,
                width: styleValues.winWidth,
                backgroundColor: colors.backgroundColor
            }}
        >
            <Text style={textStyles.largerHeader}>Location & Delivery</Text>
        </View>
        <MenuBar
            buttonProps={[
                {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                {iconSource: icons.checkBox, iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor}, buttonFunc: () => {
                    if (this.state.privateData && this.state.publicData) {
                        this.props.businessFuncs.updatePrivateData(this.state.privateData).then(() => {
                            this.props.businessFuncs.updatePublicData(this.state.publicData!).then(() => {
                                this.setState({saved: true})
                            }, (e) => {throw e})
                        }, (e) => {throw e})
                    }
                }}
              ]}
        ></MenuBar>
        {this.renderCurrentLocationMap()}
        {this.renderChooseLocationMap()}
    </PageContainer>
    );
  }
}

const styles = StyleSheet.create({
    divider: {
        width: "100%",
        borderWidth: styleValues.minorBorderWidth,
        borderRadius: styleValues.bordRadius,
        padding: styleValues.minorPadding,
        marginBottom: styleValues.mediumPadding
    },
    dividerButton: {
        marginVertical: 0,
        borderWidth: 0,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: colors.grayColor,
    },
    dividerHeader: {
        
    }
})