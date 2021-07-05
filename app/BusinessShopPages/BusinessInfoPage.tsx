import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import PropTypes from 'prop-types';
import { styleValues } from "../HelperFiles/StyleSheet";
import { PhotoSlider, RatingVisual } from "../HelperFiles/CompIndex";
import { businessPropType, formatText, prefetchImages } from "../HelperFiles/Constants";
import { PrivateBusinessData } from "../HelperFiles/DataTypes"
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopTabParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';

type BusinessInfoNavigationProp = BottomTabNavigationProp<BusinessShopTabParamList, "info">;

type BusinessInfoRouteProp = RouteProp<BusinessShopTabParamList, "info">;

type Props = {
    navigation: BusinessInfoNavigationProp,
    route: BusinessInfoRouteProp,
    businessData: PrivateBusinessData
}

type State = {
    imagesFetched: boolean,
    galleryReady: boolean
}

export default class BusinessInfoPage extends Component<Props, State> {

    galleryResponse = () => {
        this.setState({galleryReady: true});
    }

    state: Readonly<State> = {
        imagesFetched: false,
        galleryReady: false,
    }

    static propTypes = {
        navigation: PropTypes.object,
        route: PropTypes.object,
        businessData: businessPropType.isRequired
    }

    constructor(props: Props) {
        super(props)
        BusinessDataHandler.getBusinessInfo(this.props.businessData).catch((e) => console.error(e));
    }

    componentDidMount() {
        prefetchImages(this.props.businessData.info!.galleryImages).then(() => {
            this.setState({imagesFetched: true});
        })
    }

    displayLoadingScreen() {
        if (this.props.businessData.info!.galleryImages.length != 0 && !(this.state.imagesFetched && this.state.galleryReady)) {
            return (
                <ActivityIndicator style={styles.loadingScreen} size={"large"}/>
            );
        }
        return <></>
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <PhotoSlider imgURLs={this.props.businessData.info!.galleryImages} loadResponse={this.galleryResponse}/>
                <View style={styles.descriptionHeader}>
                    <Text style={styles.businessTitle} numberOfLines={2}>{this.props.businessData.info!.name}</Text>
                    <Text style={styles.businessType}>{this.props.businessData.info!.businessType}</Text>
                    <View style={styles.subHeader}>
                        <Text style={styles.businessLocation}>{this.props.businessData.info!.city + ", " + this.props.businessData.info!.region}</Text>
                        <RatingVisual rating={this.props.businessData.info!.totalRating}/>
                    </View>
                </View>
                <View style={styles.descriptionBody}>
                    <Text style={styles.description}>{formatText(this.props.businessData.info!.description)}</Text>
                </View>
                {this.displayLoadingScreen()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: styleValues.winWidth/4,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    loadingScreen: {
        position: "absolute",
        top: 0,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
    descriptionHeader: {
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        alignItems: "flex-start",
        padding: styleValues.minorPadding,
        paddingBottom: styleValues.mediumPadding,
        marginBottom: styleValues.mediumPadding,
        borderBottomWidth: styleValues.minorBorderWidth,
        borderColor: styleValues.bordColor
    },
    subHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    descriptionBody: {
        width: styleValues.winWidth - styleValues.mediumPadding*2,
        alignItems: "flex-start",
        padding: styleValues.minorPadding
    },
    businessTitle: {
        fontSize: styleValues.largerTextSize,
        color: styleValues.majorTextColor,
    },
    businessType: {
        fontSize: styleValues.mediumTextSize,
        color: styleValues.minorTextColor,
        marginBottom: styleValues.minorPadding,
    },
    businessLocation: {
        fontSize: styleValues.smallTextSize,
        color: styleValues.minorTextColor,
    },
    description: {
        fontSize: styleValues.smallTextSize,
    }
});
