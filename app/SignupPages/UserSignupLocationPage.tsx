import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";

import { styleValues, defaults } from "../HelperFiles/StyleSheet";
import { IconButton, MenuBar } from "../HelperFiles/CompIndex";
import PropTypes from 'prop-types';
import { auth, businessPropType, googleAPIKey, regionCodes } from "../HelperFiles/Constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation } from "@react-navigation/native";

export default class UserSignupLocationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validLocation: false,
            lastInvalid: "",
            hideMenuBar: false,
            currentPosition: null,
        }
        styleValues.validColor = "#5ed692";
        styleValues.invalidColor = "#e34f4f";
        this.businessData = {
            city: "",
            region: "",
            country: ""
        }
    }

  static propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
  }

  componentDidMount() {
        // Get current location
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({currentPosition: {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }});
        });
  }

  saveLocationTerms(terms) {
      switch (terms.length) {
            case 2:
                this.businessData.info.city = terms[0]["value"];
                this.businessData.info.country = terms[1]["value"];
                break;
            case 3:
                this.businessData.info.city = terms[0]["value"];
                this.businessData.info.region = regionCodes.hasOwnProperty(terms[1]["value"]) ? regionCodes[terms[1]["value"]] : terms[1]["value"];
                this.businessData.info.country = terms[2]["value"];
                break;
            case 4:
                this.businessData.info.city = terms[0]["value"];
                this.businessData.info.region = regionCodes.hasOwnProperty(terms[1]["value"]) ? regionCodes[terms[1]["value"]] : terms[1]["value"];
                this.businessData.info.country = terms[3]["value"];
                break;
            default:
                this.businessData.info.city = terms[0]["value"];
                this.businessData.info.region = regionCodes.hasOwnProperty(terms[1]["value"]) ? regionCodes[terms[1]["value"]] : terms[1]["value"];
                this.businessData.info.country = terms[2]["value"];
                break;
      }
  }

  render() {
    if (this.state.currentPosition != null) {
        return (
        <SafeAreaView style={defaults.screenContainer}>
            <View style={defaults.pageContainer}>
            <Text style={styles.signupHeader}>
                Sign Up
            </Text>
            <GooglePlacesAutocomplete
                styles={{
                    textInputContainer: styles.inputContainer,
                    textInput: [styles.inputElement, {borderColor: this.state.validLocation ? styleValues.validColor : styleValues.invalidColor}]
                }}
                placeholder="Location"
                query={{
                    key: googleAPIKey,
                    language: "en",
                    types: "(cities)",
                    location: this.state.currentPosition.lat.toString() + ", " + this.state.currentPosition.long.toString()
                }}
                onPress={(data, detail) => {
                    this.saveLocationTerms(data.terms);
                    this.setState({validLocation: true})
                    if (this.state.lastInvalid == "location") {
                        this.setState({responseText: ""});
                    }
                }}
                textInputProps={{
                    onChangeText: () => {
                        this.setState({validLocation: false})
                        if (this.state.lastInvalid == "location") {
                            this.setState({responseText: "Please select a location from the dropdown."});
                        }
                    }
                }}
                currentLocation={false}
                enableHighAccuracyLocation={false}
                enablePoweredByContainer={false}
            />
            </View>
        </SafeAreaView>
        );
    } else {
        return <ActivityIndicator style={styles.loadingScreen} size={"large"}/>
    }
  }
}

const styles = StyleSheet.create({
    loadingScreen: {
        position: "absolute",
        top: 0,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
    signupHeader: {
        fontSize: styleValues.largestTextSize,
        margin: styleValues.mediumPadding,
    },
    inputContainer: {
        width: styleValues.winWidth-2*styleValues.mediumPadding,
        height: styleValues.winWidth/10,
    },
    inputElement: {
        width: styleValues.winWidth-2*styleValues.mediumPadding,
        height: styleValues.winWidth/10,
        fontSize: styleValues.smallestTextSize,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding
    },
    inputDescription: {
        width: styleValues.winWidth-2*styleValues.mediumPadding,
        textAlign: "left",
        fontSize: styleValues.smallestTextSize,
        padding: styleValues.mediumPadding,
    },
})