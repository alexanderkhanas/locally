import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { store } from "../store/store";

export const stepNames = [
  "Wprowadź adres\nodbioru",
  "Wprowadź adres\ndostawy",
  "Dostawa na określoną\ngodzinę",
  "Zaznacz gabaryty\nprzesyłki",
  "Podsumowanie i\nforma płatnoci",
];

export const immediateStepNames = [
  "Wprowadź adres\nodbioru",
  "Wprowadź adres\ndostawy",
  "Zaznacz gabaryty\nprzesyłki",
  "Podsumowanie",
];

export const checkAppDisabled = (isComplex) => {
  const { timeStart, timeStop, switcher } = store.getState().base.settings;
  console.log("time start ===", timeStart);
  console.log("time stop ===", timeStop);
  const hours = new Date().getHours();
  const isTimeEarly = timeStart > hours;
  const isTimeLate = timeStop < hours;
  if (isComplex) {
    return { isTimeEarly, isTimeLate, isSwitcher: switcher };
  }
  console.log("is time early", isTimeEarly);
  console.log("is time late", isTimeLate);
  return switcher || isTimeEarly || isTimeLate;
};

export const mwp = (widthPercent, maxWidth, minWidth) => {
  if (maxWidth && minWidth) {
    if (wp(widthPercent) >= maxWidth) {
      return maxWidth;
    }
    return wp(widthPercent) <= minWidth ? minWidth : wp(widthPercent);
  }
  if (maxWidth) {
    return wp(widthPercent) >= maxWidth ? maxWidth : wp(widthPercent);
  }
  if (minWidth) {
    return wp(widthPercent) <= minWidth ? minWidth : wp(widthPercent);
  }
  return wp(widthPercent);
};

export const mhp = (widthPercent, maxHeight, minHeight) => {
  if (maxHeight && minHeight) {
    if (hp(widthPercent) >= maxHeight) {
      return maxHeight;
    }
    return hp(widthPercent) <= minHeight ? minHeight : hp(widthPercent);
  }
  if (maxHeight) {
    return hp(widthPercent) >= maxHeight ? maxHeight : hp(widthPercent);
  }
  if (minHeight) {
    return hp(widthPercent) <= minHeight ? minHeight : hp(widthPercent);
  }
  return hp(widthPercent);
};
