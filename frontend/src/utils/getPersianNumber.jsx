import i18next from "i18next";

export const getPersianNumber = (num) => {
  if (num === undefined || num === null) return "";
  return new Intl.NumberFormat(i18next.language).format(num);
};
