import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { t as autobizTranslate } from "autobiz-translate";
import humanizeDuration from "humanize-duration";
import Cookies from "js-cookie";
export default class Translate extends React.Component {
  render() {
    const { code } = this.props;
    if (!code || typeof code !== "string") return <>{code}</>;
    const message = autobizTranslate(code, this.props);
    if (message) return <>{message}</>;
    return <>{code}</>;
  }
}

export function durationTranslate(
  duration,
  units = ["y", "mo"],
  round = true,
  separator = ","
) {
  let result = humanizeDuration(duration, {
    language: Cookies.get("appLanguage"),
    units,
    round,
    fallbacks: ["en"],
  });
  if (separator !== ",") {
    result = result.replace(",", " " + t(separator));
  }
  return result;
}

export function t(code, variables = null) {
  if (!code || typeof code !== "string") return code;
  const message = autobizTranslate(code, variables);
  if (message) return message;
  return code;
}

export function translateDate(date, format) {
  date = moment(date);
  if (!date.isValid()) return "";
  return date.format(t(format));
}

Translate.propTypes = {
  code: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.string.isRequired,
};
Translate.defaultProps = {
  errors: "",
};
// translate int
export function tNum(int) {
  if (typeof int === "number") return int.toLocaleString();
  try {
    int = parseInt(int, 10);
    return int.toLocaleString();
  } catch (e) {
    //
  }
  return int;
}

// separateur millier
export function numStr(a, b) {
  if (typeof a !== "number") {
    a = parseInt(a, 10);
  }
  a = `${a}`;
  b = b || " ";
  let c = "";
  let d = 0;
  while (a.match(/^0[0-9]/)) {
    a = a.substr(1);
  }
  for (let i = a.length - 1; i >= 0; i -= 1) {
    c = d !== 0 && d % 3 === 0 ? a[i] + b + c : a[i] + c;
    d += 1;
  }
  return c;
}
