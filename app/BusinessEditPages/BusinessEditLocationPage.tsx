import React, { Component } from "react";
import CustomComponent from "../CustomComponents/CustomComponent"
import { View, Text, StyleSheet, KeyboardAvoidingView, } from "react-native";
import { styleValues, colors, defaults, textStyles, buttonStyles, icons } from "../HelperFiles/StyleSheet";
import PropTypes from 'prop-types';
import { auth, geofire, iconButtonTemplates } from "../HelperFiles/Constants";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BusinessEditStackParamList, BusinessMainStackParamList } from "../HelperFiles/Navigation"
import { PrivateBusinessData, PublicBusinessData } from "../HelperFiles/DataTypes";
import { LatLng } from "react-native-maps";
import { BusinessFunctions } from "../HelperFiles/BusinessFunctions";
import { ConfirmationPopup, LoadingCover, MapPopup, MenuBar, PageContainer, ScrollContainer, TextButton, TextDropdown, TextHeader, TextInfoPopup, TextInputBox, ToggleSwitch } from "../HelperFiles/CompIndex"

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
    userLocation?: {latitude: number, longitude: number},
    infoPopupText?: string,
    showCurrentLocationPopup: boolean,
    showChooseLocationPopup: boolean,
    showSavePopup: boolean,
    saved: boolean
}

export default class BusinessEditLocationPage extends CustomComponent<BusinessEditLocationProps, State> {

    constructor(props: BusinessEditLocationProps) {
        super(props)
        this.state = {
            privateData: undefined,
            publicData: undefined,
            userLocation: undefined,
            infoPopupText: undefined,
            showCurrentLocationPopup: false,
            showChooseLocationPopup: false,
            showSavePopup: false,
            saved: true
        }
        props.navigation.addListener("focus", (event) => {
            this.refreshData()
        })
        this.refreshData()
    }

    async refreshData() {
        const privateData = await this.props.businessFuncs.getPrivateData()
        const publicData = await this.props.businessFuncs.getPublicData()
        this.setState({privateData: privateData, publicData: publicData})
    }
    // Update the location and hash in private and public data
    updateLocation(coords: {latitude: number, longitude: number} | null) {
        let newPrivateData = this.state.privateData
        let newPublicData = this.state.publicData
        if (!newPrivateData || !newPublicData) {
            throw new Error("Business' data has not loaded")
        }
        newPrivateData.coords = coords
        const hash = coords ? geofire.geohashForLocation([coords.latitude, coords.longitude]) : null
        newPublicData.geohash = hash
        newPublicData.coords = coords
        this.setState({
            showChooseLocationPopup: false,
            privateData: newPrivateData,
            publicData: newPublicData,
            saved: false
        })
    }

    updatePublicData(publicData: Partial<PublicBusinessData>, stateUpdates?: Partial<State>, callback?: () => void) {
        let newPublicData = {...this.state.publicData} as PublicBusinessData | undefined
        if (newPublicData) {
        newPublicData = {
            ...newPublicData,
            ...publicData
        }
        let stateUpdate: Partial<State> = {
            ...stateUpdates,
            publicData: newPublicData,
            saved: false
        }
        this.setState(stateUpdate, callback)
        }
    }

    updatePrivateData(privateData: Partial<PrivateBusinessData>, stateUpdates?: Partial<State>, callback?: () => void) {
        let newPrivateData = {...this.state.privateData} as PrivateBusinessData | undefined
        if (newPrivateData) {
        newPrivateData = {
            ...newPrivateData,
            ...privateData
        }
        let stateUpdate: Partial<State> = {
            ...stateUpdates,
            privateData: newPrivateData,
            saved: false
        }
        this.setState(stateUpdate, callback)
        }
    }

    renderInfoPopup() {
        if (this.state.infoPopupText) {
          return (
            <TextInfoPopup
            headerText={"Edit Location"}
              onExit={() => this.setState({infoPopupText: undefined})}
            >{this.state.infoPopupText}</TextInfoPopup>
          )
        }
      }
  
    renderSavePopup() {
    if (this.state.showSavePopup) {
        return (
        <ConfirmationPopup
            type={"save"}
            onExit={() => this.setState({showSavePopup: false})}
            onDeny={() => {
            this.setState({saved: true, showSavePopup: false}, () => {
                this.props.navigation.goBack()
            })
            }}
            onConfirm={async () => {
            if (this.state.privateData && this.state.publicData) {
                await this.props.businessFuncs.updatePublicData(this.state.publicData)
                await this.props.businessFuncs.updatePrivateData(this.state.privateData)
            }
            this.setState({showSavePopup: false, saved: true}, () => {
                this.props.navigation.goBack()
            })
            }}
        />
        )
    }
    }

    renderCurrentLocationMap() {
        if (this.state.showCurrentLocationPopup) {
            return (
                <MapPopup
                    initialLocation={this.state.privateData?.coords as LatLng}
                    movableMarker={false}
                    onTapAway={() => {
                        this.setState({showCurrentLocationPopup: false})
                    }}
                />
            )
        } else {
            return undefined
        }
    }

    renderChooseLocationMap() {
        if (this.state.showChooseLocationPopup && this.state.privateData && this.state.publicData) {
            let initialLocation = this.state.userLocation
            if (this.state.privateData.coords) {
                initialLocation = this.state.privateData.coords
            }
            return (
                <MapPopup
                    initialLocation={{latitude: initialLocation!.latitude, longitude: initialLocation!.longitude}}
                    movableMarker={true}
                    onSaveLocation={(region) => {
                        this.updateLocation({
                            latitude: region.latitude,
                            longitude: region.longitude
                        })
                    }}
                    onTapAway={() => {
                        this.setState({showChooseLocationPopup: false})
                    }}
                />
            )
        }
        return undefined
    }

    renderDeleteLocationButton() {
        return (
            <TextButton
                text={"Delete location"}
                rightIconSource={icons.minus}
                textStyle={{color: "red"}}
                buttonFunc={() => {
                    this.updateLocation(null)
                }}
            />
        )
    }

    renderUI() {
        if (this.state.privateData && this.state.publicData) {
            return (
            <View>
                <ScrollContainer
                    containerStyle={{
                        width: styleValues.winWidth,
                        marginTop: defaults.textHeaderBox.height
                    }}
                    fadeTop={false}
                    avoidKeyboard
                >
                    <Text style={{...textStyles.mediumHeader, marginBottom: styleValues.mediumPadding*2}}>Edit your location</Text>
                    {/* View current location */}
                    <TextButton
                        text={"View current location"}
                        textStyle={!this.state.privateData?.coords ? {
                            color: colors.lightGrayColor
                        } : undefined}
                        rightIconSource={icons.chevron}
                        rightIconStyle={{transform: [{scaleX: -1}]}}
                        buttonFunc={() => {
                            this.setState({showCurrentLocationPopup: true})
                        }}
                        touchableProps={{
                            disabled: !this.state.privateData?.coords
                        }}
                    ></TextButton>
                    {/* Choose location */}
                    <TextButton
                        text={"Choose a location"}
                        rightIconSource={icons.chevron}
                        rightIconStyle={{transform: [{scaleX: -1}]}}
                        buttonFunc={() => {
                            return new Promise((resolve, reject) => {
                                if (this.state.privateData?.coords || this.state.userLocation) {
                                    this.setState({showChooseLocationPopup: true})
                                    resolve(this.state.userLocation)
                                    return
                                }
                                navigator.geolocation.getCurrentPosition((position) => {
                                    this.setState({userLocation: position.coords, showChooseLocationPopup: true})
                                    resolve(position.coords)
                                    return
                                }, (e) => {
                                    reject(e)
                                })
                            })
                            
                        }}
                        showLoading
                    ></TextButton>
                    {this.renderDeleteLocationButton()}
                    <Text style={textStyles.mediumHeader}>Delivery Methods</Text>
                    {/* In store pickup */}
                    <ToggleSwitch
                        style={{marginVertical: styleValues.mediumPadding}}
                        text={"Offer in-store pickup"}
                        onToggle={(value) => {
                            let newPublicData = this.state.publicData
                            if (newPublicData) {
                                const newDeliveryMethods = newPublicData.deliveryMethods
                                newDeliveryMethods.pickup = value
                                this.updatePublicData({deliveryMethods: newDeliveryMethods})
                            }
                        }}
                        switchProps={{
                            value: this.state.publicData.deliveryMethods.pickup
                        }}
                    ></ToggleSwitch>
                    {/* Local delivery */}
                    <ToggleSwitch
                        style={{marginBottom: styleValues.mediumPadding}}
                        text={"Offer local delivery"}
                        onToggle={(value) => {
                            let newPublicData = this.state.publicData
                            if (newPublicData) {
                                const newDeliveryMethods = newPublicData.deliveryMethods
                                newDeliveryMethods.local = value
                                this.updatePublicData({deliveryMethods: newDeliveryMethods})
                            }
                        }}
                        switchProps={{
                            value: this.state.publicData.deliveryMethods.local
                        }}
                    ></ToggleSwitch>
                    {/* National shipping */}
                    <ToggleSwitch
                        style={{marginBottom: styleValues.mediumPadding}}
                        text={"Offer shipping (within country)"}
                        onToggle={(value) => {
                            let newPublicData = this.state.publicData
                            if (newPublicData) {
                                const newDeliveryMethods = newPublicData.deliveryMethods
                                newDeliveryMethods.country = value
                                this.updatePublicData({deliveryMethods: newDeliveryMethods})
                            }
                        }}
                        switchProps={{
                            value: this.state.publicData.deliveryMethods.country
                        }}
                    ></ToggleSwitch>
                    {/* International shipping */}
                    <ToggleSwitch
                        style={{marginBottom: styleValues.mediumPadding}}
                        text={"Offer international shipping"}
                        onToggle={(value) => {
                            let newPublicData = this.state.publicData
                            if (newPublicData) {
                                const newDeliveryMethods = newPublicData.deliveryMethods
                                newDeliveryMethods.international = value
                                this.updatePublicData({deliveryMethods: newDeliveryMethods})
                            }
                        }}
                        switchProps={{
                            value: this.state.publicData.deliveryMethods.international
                        }}
                    ></ToggleSwitch>
                    <Text style={textStyles.mediumHeader}>Edit Your Public Address</Text>
                    {/* Street Address */}
                    <TextInputBox
                        boxStyle={{marginTop: styleValues.mediumPadding}}
                        textProps={{
                            placeholder: "Street address",
                            defaultValue: this.state.publicData?.address,
                            onChangeText: (text) => this.updatePublicData({address: text})
                        }}
                    ></TextInputBox>
                    {/* Postal code */}
                    <TextInputBox
                        textProps={{
                            placeholder: "Postal code / ZIP",
                            defaultValue: this.state.publicData?.postalCode,
                            onChangeText: (text) => this.updatePublicData({postalCode: text})
                        }}
                    ></TextInputBox>
                    {/* City */}
                    <TextInputBox
                        textProps={{
                            placeholder: "City",
                            defaultValue: this.state.publicData?.city,
                            onChangeText: (text) => this.updatePublicData({city: text})
                        }}
                    ></TextInputBox>
                    {/* Province */}
                    <TextInputBox
                        boxStyle={{
                            borderColor: this.state.publicData.region === "" ? colors.invalidColor : colors.validColor
                        }}
                        textProps={{
                            placeholder: "Province / State",
                            defaultValue: this.state.publicData?.region,
                            onChangeText: (text) => this.updatePublicData({region: text})
                        }}
                    ></TextInputBox>
                </ScrollContainer>
                <TextHeader
                    infoButtonFunc={() => {
                        this.setState({infoPopupText: "Setting your location allows your business to be seen by customers near you."})
                    }}
                >Location & Delivery</TextHeader>
            </View>
            )
        }
    }

    renderLoading() {
        if (!this.state.privateData || !this.state.publicData) {
            return (
                <LoadingCover size={"large"}/>
            )
        }
    }

    render() {
        return (
        <PageContainer>
            {this.renderUI()}
            {this.renderLoading()}
            <MenuBar
                buttonProps={[
                    {
                        ...iconButtonTemplates.back,
                        buttonFunc: () => {
                          if (!this.state.saved) {
                            this.setState({showSavePopup: true})
                          } else {
                            this.props.navigation.goBack()
                          }
                        }
                      }, {
                        ...iconButtonTemplates.save,
                        iconStyle: {tintColor: this.state.saved ? colors.validColor : colors.invalidColor},
                        buttonFunc: async () => {
                          if (this.state.privateData && this.state.publicData && !this.state.saved) {
                            await this.props.businessFuncs.updatePublicData(this.state.publicData)
                            await this.props.businessFuncs.updatePrivateData(this.state.privateData)
                            this.setState({saved: true})
                          }
                        }
                      }
                ]}
            ></MenuBar>
            {this.renderInfoPopup()}
            {this.renderCurrentLocationMap()}
            {this.renderChooseLocationMap()}
            {this.renderSavePopup()}
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