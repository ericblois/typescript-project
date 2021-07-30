import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { initialWindowMetrics } from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Font from 'expo-font';

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

export const menuBarHeight = winWidth * 0.15

// --- Load fonts ---

export const fonts = {
  regular: "MontserratRegular",
  medium: "MontserratMedium",
  italic: "RubikItalic",
  bold: "RubikBold",
}

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

export const colors = {
  lightestColor: "#e3fff1",
  lightColor: "#8ee6a6",
  mainColor: "#61c97d",
  darkColor: "#449e5c",
  whiteColor: "#fff",
  lightestGrayColor: "#ddd",
  lighterGrayColor: "#bbb",
  lightGrayColor: "#999",
  grayColor: "#777",
  darkGrayColor: "#555",
  darkerGrayColor: "#333",
  blackColor: "#000",
  validColor: "#2CB557",
  invalidColor: "#DD404B",
  yellowColor: "#FFCF56",
  backgroundColor: "#eee",
}

export const styleValues = {
  winHeight: winHeight,
  winWidth: winWidth,
  majorPadding: winWidth/20,
  mediumPadding: winWidth/40,
  minorPadding: winWidth/100,
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
  largestTextSize: winWidth/12,
  largerTextSize: winWidth/16,
  largeTextSize: winWidth/18,
  mediumTextSize: winWidth/20,
  smallTextSize: winWidth/24,
  smallerTextSize: winWidth/28,
  smallestTextSize: winWidth/32,
  majorTextColor: "#000",
  minorTextColor: "#777",
};

const defaultTemplates = StyleSheet.create({
  text: {
    fontFamily: fonts.regular,
    textAlign: "center",
    textAlignVertical: "center",
  },
  button: {
    width: "100%",
    height: winWidth* 0.125,
    padding: styleValues.mediumPadding,
    borderRadius: styleValues.bordRadius,
    flexDirection: "row",
    marginBottom: styleValues.mediumPadding,
    alignItems: "center",
    justifyContent: "center"
  },
})

export const textStyles = StyleSheet.create({
  smaller: {
    ...defaultTemplates.text,
    fontSize: styleValues.smallerTextSize,
  },
  small: {
    ...defaultTemplates.text,
    fontSize: styleValues.smallTextSize,
  },
  medium: {
    ...defaultTemplates.text,
    fontSize: styleValues.mediumTextSize,
  },
  large: {
    ...defaultTemplates.text,
    fontSize: styleValues.largeTextSize,
  },
  larger: {
    ...defaultTemplates.text,
    fontSize: styleValues.largerTextSize,
  },
  largest: {
    ...defaultTemplates.text,
    fontSize: styleValues.largestTextSize,
  },
})

export const buttonStyles = StyleSheet.create({
  mainColor: {
    ...defaultTemplates.button,
    borderColor: colors.darkColor,
    backgroundColor: colors.mainColor,
    
  },
  lightColor: {
    ...defaultTemplates.button,
    borderColor: colors.mainColor,
    backgroundColor: colors.whiteColor,
  },
  noColor: {
    ...defaultTemplates.button,
    borderColor: colors.grayColor,
    backgroundColor: colors.whiteColor,
  },
})

export const menuBarStyles = StyleSheet.create({
  lightFade: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: styleValues.winWidth,
    height: menuBarHeight,
    padding: styleValues.mediumPadding,
    backgroundColor: colors.whiteColor,
    position: "absolute",
    bottom: 0,
  },
  lightHover: {
    width: styleValues.winWidth - styleValues.mediumPadding*2,
    height: menuBarHeight,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: styleValues.bordRadius,
    padding: styleValues.mediumPadding,
    backgroundColor: colors.whiteColor,
    bottom: styleValues.mediumPadding,
  }
})

export const tabBarStyles = StyleSheet.create({
  lightFade: {
    width: styleValues.winWidth,
    height: menuBarHeight,
    position: "absolute",
    borderTopWidth: 0,
    paddingTop: styleValues.mediumPadding,
    paddingBottom: styleValues.mediumPadding,
    bottom: 0
  },
  lightHover: {
    width: styleValues.winWidth - styleValues.mediumPadding*2,
    height: menuBarHeight,
    position: "absolute",
    marginHorizontal: styleValues.mediumPadding,
    borderRadius: styleValues.bordRadius,
    borderTopWidth: 0,
    paddingTop: styleValues.mediumPadding,
    paddingBottom: styleValues.mediumPadding,
    bottom: styleValues.mediumPadding,
  }
})

export const defaults = StyleSheet.create({
  screenContainer: {
    paddingTop: initialWindowMetrics?.insets.top ? initialWindowMetrics!.insets.top : 0,
    paddingBottom: initialWindowMetrics?.insets.bottom ? initialWindowMetrics!.insets.bottom : 0,
    backgroundColor: "#777",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  pageContainer: {
      alignItems: "center",
      justifyContent: "flex-start",
      width: winWidth,
      height: winHeight,
      backgroundColor: colors.backgroundColor,
  },
  smallShadow: {
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: styleValues.minorPadding,
    elevation: 5,
  },
  mediumShadow: {
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: styleValues.mediumPadding*0.75,
    elevation: 10,
  },
  largeShadow: {
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: styleValues.mediumPadding,
    elevation: 15,
  },
  dividerBox: {
    alignItems: "center",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: colors.grayColor,
    padding: styleValues.mediumPadding,
    paddingBottom: 0,
    marginBottom: styleValues.mediumPadding
  },
  tabBarLightColor: {
    position: "absolute",
    height: menuBarHeight,
    width: styleValues.winWidth,
    borderTopWidth: 0,
    paddingTop: styleValues.mediumPadding,
    paddingBottom: styleValues.mediumPadding,
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
    tintColor: colors.darkGrayColor,
  },
  inputBox: {
    width: styleValues.winWidth - styleValues.mediumPadding*2,
    height: styleValues.winWidth*0.1,
    backgroundColor: "#fff",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: colors.mainColor,
    marginVertical: styleValues.mediumPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    ...defaultTemplates.text,
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: styleValues.bordRadius,
    fontSize: styleValues.smallTextSize,
    color: styleValues.majorTextColor,
  },
  dateScrollPicker: {
    width: "100%",
    height: styleValues.winWidth/4,
    fontSize: styleValues.smallTextSize,
    backgroundColor: "#fff",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: colors.darkColor,
    marginBottom: styleValues.mediumPadding,
    alignItems: "center"
  },
  dropdownContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: styleValues.minorBorderWidth,
    borderRadius: styleValues.bordRadius,
    borderColor: colors.darkColor,
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
  hollowStar: require("../../assets/starHollowIcon.png"),
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
  image: require("../../assets/imageIcon.png"),
  trash: require("../../assets/trashIcon.png")
}
