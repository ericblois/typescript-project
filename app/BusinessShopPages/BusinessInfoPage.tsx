import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import PropTypes from 'prop-types';
import { defaults, icons, styleValues } from "../HelperFiles/StyleSheet";
import { ImageSlider, MenuBar, PageContainer, RatingVisual, ScrollContainer } from "../HelperFiles/CompIndex";
import { businessPropType, formatText } from "../HelperFiles/Constants";
import { PublicBusinessData } from "../HelperFiles/DataTypes"
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BusinessShopStackParamList } from "../HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';

type BusinessInfoNavigationProp = BottomTabNavigationProp<BusinessShopStackParamList, "info">;

type BusinessInfoRouteProp = RouteProp<BusinessShopStackParamList, "info">;

type Props = {
    navigation: BusinessInfoNavigationProp,
    route: BusinessInfoRouteProp,
    businessData: PublicBusinessData
}

type State = {
    loaded: boolean
}

export default class BusinessInfoPage extends Component<Props, State> {

    businessData = this.props.businessData

    constructor(props: Props) {
        super(props)
        this.state = {
            loaded: false
        }
    }

    displayLoadingScreen() {
        if (!this.state.loaded) {
            return (
                <View 
                    style={{...defaults.pageContainer, ...{
                        justifyContent: "center",
                        position: "absolute",
                        top: 0,
                        left: 0
                     }}}
                >
                    <ActivityIndicator size={"large"}/>
                </View>
            );
        }
        return <></>
    }

    render() {
        return (
        <PageContainer>
            <ScrollContainer>
                <ImageSlider
                    uris={this.props.businessData.galleryImages}
                    onImagesLoaded={() => {
                        this.setState({loaded: true})
                    }}
                />
                <View style={styles.descriptionHeader}>
                    <Text style={styles.businessTitle} numberOfLines={2}>{this.props.businessData.name}</Text>
                    <Text style={styles.businessType}>{this.props.businessData.businessType}</Text>
                    <View style={styles.subHeader}>
                        <Text style={styles.businessLocation}>{this.props.businessData.city + ", " + this.props.businessData.region}</Text>
                        <RatingVisual rating={this.props.businessData.totalRating}/>
                    </View>
                </View>
                <View style={styles.descriptionBody}>
                    <Text style={styles.description}>{formatText(this.props.businessData.description)}</Text>
                </View>
                {this.displayLoadingScreen()}
            </ScrollContainer>
            <MenuBar
                //buttonProps={this.state.inEditMode ? this.getEditButtons(props) : this.getMainButtons(props)}
                buttonProps={[
                    {iconSource: icons.chevron, buttonFunc: () => {this.props.navigation.goBack()}},
                    {iconSource: icons.shoppingCart, buttonFunc: () => {this.props.navigation.navigate("products")}}
                ]}
            />
        </PageContainer>
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
