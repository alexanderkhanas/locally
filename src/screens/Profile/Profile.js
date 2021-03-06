import React from "react";
import s from "./Profile.s";
import { View, Text, Image } from "react-native";
import { withFormik } from "formik";
import { connect } from "react-redux";
import MainWrapper from "../../wrappers/MainWrapper/MainWrapper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Input from "../../misc/Input/Input";
import Button from "../../misc/Button/Button";
import { ScrollView } from "react-native-gesture-handler";
import { showModalAction } from "../../store/actions/baseActions";
import {
  editUserAction,
  logoutAction,
} from "../../store/actions/profileActions";
import AdaptiveWrapper from "../../wrappers/AdaptiveWrapper/AdaptiveWrapper";
import * as yup from "yup";

const Profile = ({
  values,
  handleChange,
  handleSubmit,
  logout,
  navigation,
  showModal,
}) => {
  const logoutHandler = () => {
    showModal(
      "Czy na pewno chcesz się wylogować?",
      "Po wylogowaniu będziesz musiał zalogować się ponownie, aby korzystać z aplikacji.",
      () => {},
      () => {
        logout();
        navigation.navigate("Login");
      },
      () => {}
    );
  };
  return (
    <ScrollView>
      <MainWrapper style={s.container} onBackPress={navigation.goBack}>
        <Button
          style={s.logoutButton}
          title="Wyloguj"
          onPress={logoutHandler}
          textStyle={s.logoutButtonText}
        />
        <Text style={s.title}>Moje dane</Text>
        <AdaptiveWrapper minHeightToShow={500}>
          <Image
            source={require("../../../assets/icons/profile-image.png")}
            style={s.image}
          />
        </AdaptiveWrapper>
        <View style={s.infoContainer}>
          <View style={s.row}>
            <Input
              placeholder="Jimmy"
              containerStyle={{ ...s.smallInput, marginRight: 10 }}
              label="Imię"
              onChangeText={handleChange("fName")}
              value={values.fName}
            />
            <Input
              placeholder="Jimmy Carr"
              containerStyle={s.smallInput}
              label="Nazwisko"
              onChangeText={handleChange("lName")}
              value={values.lName}
            />
          </View>
          <Input
            placeholder="jimmycarr@carr.com"
            containerStyle={s.inputContainer}
            label="Adres e-mail"
            withoutCapitalize
            onChangeText={handleChange("email")}
            value={values.email}
          />
          <Input
            placeholder="+48-567-867-316"
            mask="+48-999-999-999"
            containerStyle={s.inputContainer}
            label="Telefon"
            onChangeText={handleChange("phone")}
            value={values.phone}
            keyboardType="numeric"
          />

          <Button
            title="Zapisz zmiany"
            style={s.buttonContainer}
            onPress={handleSubmit}
          />
        </View>
      </MainWrapper>
    </ScrollView>
  );
};

const formikHOC = withFormik({
  mapPropsToValues: (props) => {
    const { fName, lName, email, phone } = props.user;
    console.log("profile ===", props.user);
    return {
      fName,
      lName,
      email,
      phone: `${phone}`,
    };
  },
  validationSchema: yup.object().shape({
    fName: yup.string(),
    lName: yup.string(),
    email: yup.string().required(),
    phone: yup.string(),
  }),
  handleSubmit: async (values, { props: { editUser, user, showModal } }) => {
    console.log("values ===", values);
    const isSuccess = await editUser(
      {
        ...values,
        phone: values.phone.replace(/-/gi, "").replace("+", ""),
      },
      user.token
    );
    console.log("isSuccess ===", isSuccess);
    if (isSuccess) {
      showModal(
        "Profil zaktualizowany pomyślnie",
        "Po wylogowaniu będziesz musiał zalogować się ponownie, aby korzystać z aplikacji."
      );
    }
  },
})(Profile);

const mapStateToProps = (state) => ({
  isModalVisible: state.base.modal.isVisible,
  user: state.profile,
});
const mapDispatchToProps = (dispatch) => ({
  showModal: (title, desc, onClose, onResolve, onReject) =>
    dispatch(showModalAction(title, desc, onClose, onResolve, onReject)),
  editUser: (user, token) => dispatch(editUserAction(user, token)),
  logout: () => dispatch(logoutAction()),
});
export default connect(mapStateToProps, mapDispatchToProps)(formikHOC);
