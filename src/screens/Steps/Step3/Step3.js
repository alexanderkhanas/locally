import React from "react";
import s from "./Step3.s";
import { connect } from "react-redux";
import { Text, View } from "react-native";
import ScrollPicker from "../../../misc/ScrollPicker/ScrollPicker";
import StepWrapper from "../../../wrappers/StepWrapper/StepWrapper";
import SvgUri from "react-native-svg-uri";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Button from "../../../misc/Button/Button";
import { withFormik } from "formik";
import AdaptiveWrapper from "../../../wrappers/AdaptiveWrapper/AdaptiveWrapper";

const Step3 = ({ values, setValues, onSubmit, stepNumber }) => {
  const onHoursChange = (hours) => {
    setValues({ ...values, hours });
  };
  const onMinutesChange = (minutes) => {
    setValues({ ...values, minutes });
  };
  return (
    <View>
      <View style={s.inner}>
        <AdaptiveWrapper minWidthToShow={350}>
          <View style={s.imageContainer}>
            <SvgUri
              width={wp(45)}
              height={wp(45)}
              source={require("../../../../assets/login-image.svg")}
            />
          </View>
        </AdaptiveWrapper>
        <Text style={s.text}>
          <Text style={s.textBold}>Wpisz godzine</Text> na którą przesyłka ma
          być dostarczona
        </Text>
        <View style={s.pickersContainer}>
          <ScrollPicker
            activeItem={values.hours}
            setActiveItem={onHoursChange}
            numberOfItems={24}
            title="godz."
          />
          <SvgUri source={require("../../../../assets/icons/dots.svg")} />
          <ScrollPicker
            activeItem={values.minutes}
            setActiveItem={onMinutesChange}
            numberOfItems={60}
            title="min."
          />
        </View>
      </View>
      <Button
        onPress={onSubmit}
        style={s.button}
        textStyle={s.buttonText}
        title={`Następny krok > 0${stepNumber + 1}`}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Step3);