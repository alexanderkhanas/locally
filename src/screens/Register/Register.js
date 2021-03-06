import React, { useEffect } from "react";
import s from "./Register.s";
import MainWrapper from "../../wrappers/MainWrapper/MainWrapper";
import { withFormik } from "formik";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import SvgUri from "react-native-svg-uri";
import Input from "../../misc/Input/Input";
import Button from "../../misc/Button/Button";
import { connect } from "react-redux";
import { registerAction } from "../../store/actions/profileActions";
import CustomImage from "../../misc/CustomImage/CustomImage";
import { showModalAction } from "../../store/actions/baseActions";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
} from "react-native-fbsdk";
import FacebookLogin from "../../misc/FacebookLogin/FacebookLogin";

const Register = ({
  values,
  handleChange,
  navigation,
  handleSubmit,
  errors,
  validateForm,
  facebookLogin,
  showModal,
  touched,
  handleBlur,
}) => {
  const redirectToLogin = () => navigation.navigate("Login");

  const responseInfoCallback = async (error, result) => {
    if (!error) {
      const { name, id } = result;
      const [fName, lName] = name.split(" ");
      const isSuccess = await facebookLogin({ fName, lName, id });
      if (isSuccess) {
        navigation.navigate("Home");
      } else {
        showModal("Bląd logowania", "Coś poszło nie tak. Spróbuj ponownie.");
      }
    }
  };

  useEffect(() => {
    validateForm();
  }, []);

  return (
    <MainWrapper style={s.container} onBackPress={navigation.goBack}>
      <Text style={s.title}>Rejestracja</Text>
      <View>
        <ScrollView>
          <View style={s.infoContainer}>
            <View style={s.inputsRow}>
              <Input
                placeholder="Jan"
                onChangeText={handleChange("fName")}
                value={values.fName}
                onBlur={handleBlur("fName")}
                isError={errors.fName && touched.fName}
                containerStyle={s.inputRowContainer}
                label="Imie"
              />
              <Input
                placeholder="Kowalski"
                onChangeText={handleChange("lName")}
                value={values.lName}
                onBlur={handleBlur("lName")}
                isError={errors.lName && touched.lName}
                containerStyle={{ ...s.inputRowContainer, marginRight: 0 }}
                label="Nazwisko"
              />
            </View>
            <Input
              placeholder="567 867 316"
              onChangeText={handleChange("phone")}
              value={values.phone}
              onBlur={handleBlur("phone")}
              keyboardType="numeric"
              isError={errors.phone && touched.phone}
              mask="+48-999-999-999"
              containerStyle={s.inputContainer}
              label="Telefon"
            />
            <Input
              placeholder="jan-kowalski@gmail.com"
              onChangeText={handleChange("email")}
              value={values.email}
              autoCapitalize="none"
              onBlur={handleBlur("email")}
              isError={errors.email && touched.email}
              containerStyle={s.inputContainer}
              label="e-mail"
            />
            <Input
              placeholder="********"
              secureTextEntry
              value={values.password}
              onBlur={handleBlur("password")}
              isError={errors.password && touched.password}
              onChangeText={handleChange("password")}
              containerStyle={s.inputContainer}
              label="hasło"
            />
            <Button
              title="Rejestracja"
              onPress={handleSubmit}
              disabled={!!Object.keys(errors).length}
              style={s.buttonContainer}
            />
            <Text style={s.secondaryText}>albo</Text>
            <FacebookLogin {...{ navigation }} />
            <View style={s.registerContainer}>
              <Text>Juz masz konto?</Text>
              <TouchableOpacity onPress={redirectToLogin}>
                <View style={s.linkContainer}>
                  <Text style={s.linkText}>Zaloguj się</Text>
                  <View style={s.border} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </MainWrapper>
  );
};

const formikHoc = withFormik({
  mapPropsToValues: () => ({
    email: "",
    password: "",
    fName: "",
    lName: "",
    phone: "",
  }),
  validateOnMount: true,
  validate: (values) => {
    const errors = {};
    const { email, password } = values;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    Object.entries(values).forEach(([key, value]) => {
      if (!value?.length) {
        errors[key] = "required";
      }
    });
    if (!emailRegex.test(email)) {
      errors.email = "invalid email";
    }
    if (password.length < 5) {
      errors.password = "password length less that 6";
    }
    return errors;
  },
  handleSubmit: async (
    values,
    { props: { register, navigation, showModal }, resetForm }
  ) => {
    let correctPhone = +values.phone.replace(/-/gi, "").replace("+", "") || 0;
    console.log("values register ===", { ...values, phone: correctPhone });
    const isSuccess = await register({ ...values, phone: correctPhone });
    console.log("isSuccess ===", isSuccess);
    if (isSuccess) {
      navigation.navigate("EmailVerification");
    } else {
      showModal("Bląd logowania", "Takie konto już istnieje");
    }
    resetForm({
      email: "",
      password: "",
      fName: "",
      lName: "",
      phone: "",
    });
  },
})(Register);

const mapDispatchToProps = (dispatch) => ({
  register: (user) => dispatch(registerAction(user)),
  showModal: (title, desc) => dispatch(showModalAction(title, desc)),
});

export default connect(null, mapDispatchToProps)(formikHoc);
