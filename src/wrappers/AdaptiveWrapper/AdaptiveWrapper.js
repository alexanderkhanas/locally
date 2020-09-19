import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Dimensions } from "react-native";

const AdaptiveWrapper = ({ children, minWidthToShow }) => {
  console.log("wp 100 ===", wp(100));
  console.log("width ===", Dimensions.get("window").width);
  return wp(100) > minWidthToShow && children;
};

export default AdaptiveWrapper;