import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { initialWindowMetrics } from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Font from 'expo-font';

//const winWidth = Dimensions.get("window").width;
//const winHeight = Dimensions.get("window").height;
const displayWidth = initialWindowMetrics
  ? initialWindowMetrics.frame.width
  : Dimensions.get("window").width;
const displayHeight = initialWindowMetrics
  ? initialWindowMetrics.frame.height
  : Dimensions.get("window").height;

const winWidth = initialWindowMetrics
  ? displayWidth - initialWindowMetrics.insets.left - initialWindowMetrics.insets.right
  : displayWidth;
const winHeight = initialWindowMetrics
  ? displayHeight - initialWindowMetrics.insets.bottom - initialWindowMetrics.insets.top
  : displayHeight;

const roundCornerDevices = [
  "iPhone",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12 mini",
  "iPhone 12",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
];

function hasRoundCorners() {
  const deviceName = Device.modelName;
  for (const name of roundCornerDevices) {
    if (deviceName == name) {
      return true;
    }
  }
  return false;
};

/*SafeArea.getSafeAreaInsetsForRootView().then((results) => {
  console.log(results);
})*/

export const styleValues = {
  winHeight: winHeight,
  winWidth: winWidth,
  majorPadding: winWidth/20,
  mediumPadding: winWidth/40,
  minorPadding: winWidth/100,
  lightColor: "#9ff5cb",
  mainColor: "#23de83",
  darkColor: "#0bb05f",
  whiteColor: "#fff",
  lightGreyColor: "#bbb",
  greyColor: "#777",
  darkGreyColor: "#333",
  blackColor: "#000",
  bordColor: "#ccc",
  minorBorderWidth: winWidth * 0.005,
  majorBorderWidth: winWidth * 0.008,
  bordRadius: winWidth * 0.025,
  iconSmallestSize: winWidth * 0.025,
  iconSmallerSize: winWidth * 0.05,
  iconSmallSize: winWidth * 0.075,
  iconMediumSize: winWidth * 0.1,
  iconLargeSize: winWidth * 0.125,
  iconLargerSize: winWidth * 0.15,
  iconLargestSize: winWidth * 0.2,
  statusBarHeight: StatusBar.currentHeight != null ? StatusBar.currentHeight : 20,
  roundedPadding: hasRoundCorners() ? winWidth * 0.05 : 0,
  largerTextSize: winWidth/12,
  largeTextSize: winWidth/16,
  mediumTextSize: winWidth/18,
  smallTextSize: winWidth/20,
  smallerTextSize: winWidth/24,
  smallestTextSize: winWidth/32,
  majorTextColor: "#000",
  minorTextColor: "#777",
  validColor: "#5ed692",
  invalidColor: "#e34f4f",
};

export const defaults = StyleSheet.create({
  screenContainer: {
    width: displayWidth,
    height: displayHeight,
    paddingTop: initialWindowMetrics?.insets.top ? initialWindowMetrics!.insets.top : 0,
    paddingBottom: initialWindowMetrics?.insets.bottom ? initialWindowMetrics!.insets.bottom : 0,
    backgroundColor: "#777",
    position: "absolute",
    left: 0,
    bottom: 0
  },
  pageContainer: {
      alignItems: "center",
      justifyContent: "flex-start",
      width: winWidth,
      height: winHeight,
      backgroundColor: "#fff",
      padding: styleValues.mediumPadding,
      paddingBottom: styleValues.winWidth * 0.15 + styleValues.mediumPadding*2
  },
  smallTextHeader: {
    fontSize: styleValues.smallTextSize,
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: styleValues.mediumPadding
  },
  mediumTextHeader: {
    fontSize: styleValues.mediumTextSize,
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: styleValues.mediumPadding
  },
  largeTextHeader: {
    fontSize: styleValues.largeTextSize,
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: styleValues.mediumPadding
  },
  dividerBox: {
    alignItems: "center",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.greyColor,
    padding: styleValues.mediumPadding,
    paddingBottom: 0,
    marginBottom: styleValues.mediumPadding
  },
  tabBar: {
    position: "absolute",
    height: styleValues.winWidth * 0.15,
    width: styleValues.winWidth - 2*styleValues.mediumPadding,
    borderColor: styleValues.bordColor,
    borderRadius: styleValues.bordRadius,
    borderWidth: styleValues.minorBorderWidth,
    margin: styleValues.mediumPadding,
    marginBottom: styleValues.mediumPadding + (initialWindowMetrics?.insets.bottom ? initialWindowMetrics!.insets.bottom : 0),
    paddingTop: styleValues.mediumPadding,
    paddingBottom: styleValues.mediumPadding,
  },
  menuBarNoColor: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: styleValues.darkColor,
    borderRadius: styleValues.bordRadius,
    borderWidth: styleValues.minorBorderWidth,
    flexDirection: "row",
    height: styleValues.winWidth * 0.15,
    justifyContent: "space-between",
    position: "absolute",
    bottom: styleValues.mediumPadding,
    alignSelf: "center",
    width: styleValues.winWidth - styleValues.mediumPadding*2,
    paddingHorizontal: styleValues.majorPadding,
    
  },
  textButtonMainColor: {
    width: "100%",
    height: winWidth* 0.125,
    padding: styleValues.mediumPadding,
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.darkColor,
    backgroundColor: styleValues.mainColor,
    flexDirection: "row",
    marginBottom: styleValues.mediumPadding,
    alignItems: "center",
    justifyContent: "center"
  },
  textButtonLightColor: {
    width: "100%",
    height: winWidth* 0.125,
    padding: styleValues.mediumPadding,
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.darkColor,
    backgroundColor: "white",
    flexDirection: "row",
    marginBottom: styleValues.mediumPadding,
    alignItems: "center",
    justifyContent: "center"
  },
  textButtonNoColor: {
    width: "100%",
    height: winWidth* 0.125,
    padding: styleValues.mediumPadding,
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.greyColor,
    backgroundColor: "white",
    flexDirection: "row",
    marginBottom: styleValues.mediumPadding,
    alignItems: "center",
    justifyContent: "center"
  },
  iconButton: {
    alignContent: "center",
    justifyContent: "center",
    height: styleValues.iconMediumSize,
    width: styleValues.iconMediumSize,
  },
  iconImage: {
    height: "100%",
    width: "100%",
    tintColor: styleValues.darkGreyColor,
  },
  inputBox: {
    width: "100%",
    height: styleValues.winWidth/10,
    backgroundColor: "#fff",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.darkColor,
    marginBottom: styleValues.mediumPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    width: "95%",
    height: "95%",
    backgroundColor: "#fff",
    borderRadius: styleValues.bordRadius,
    fontSize: styleValues.smallTextSize,
    color: styleValues.majorTextColor,
    textAlign: "center",
    textAlignVertical: "center",
  },
  dateScrollPicker: {
    width: "100%",
    height: styleValues.winWidth/4,
    fontSize: styleValues.smallTextSize,
    backgroundColor: "#fff",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.darkColor,
    marginBottom: styleValues.mediumPadding,
    alignItems: "center"
  },
  dropdownContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: styleValues.darkColor,
    marginBottom: styleValues.mediumPadding,
    alignItems: "center",
    justifyContent: "center",
    padding: styleValues.minorPadding
  },
  dropdownText: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: styleValues.bordRadius,
    fontSize: styleValues.smallTextSize,
    color: styleValues.majorTextColor,
    textAlign: "center",
    textAlignVertical: "bottom"
  }
});

export const icons = {
  backArrow: require("../../assets/backArrowIcon.png"),
  star: require("../../assets/starIcon.png"),
  search: require("../../assets/searchIcon.png"),
  lines: require("../../assets/linesIcon.png"),
  profile: require("../../assets/profileIcon.png"),
  shoppingCart: require("../../assets/shoppingCartIcon.png"),
  document: require("../../assets/documentIcon.png"),
  message: require("../../assets/messageIcon.png"),
  enter: require("../../assets/enterIcon.png"),
  chevron: require("../../assets/leftChevron.png"),
  store: require("../../assets/storeIcon.png"),
  checkBox: require("../../assets/checkBoxIcon.png"),
  plus: require("../../assets/plusIcon.png"),
  minus: require("../../assets/minusIcon.png"),
  edit: require("../../assets/editIcon.png"),
  location: require("../../assets/locationIcon.png"),
  crosshair: require("../../assets/crosshairIcon.png"),
  image: require("../../assets/imageIcon.png")
}
