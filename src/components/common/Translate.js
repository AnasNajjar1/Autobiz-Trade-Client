import React from "react";
import PropTypes from "prop-types";
import humanizeDuration from "humanize-duration";
import Cookies from "js-cookie";
import { LanguageContext } from "../../language-context";

class Translate extends React.Component {
  render() {
    if (!this.context[this.props.code]) {
      return <React.Fragment>{this.props.code}</React.Fragment>;
    }

    const translated_string = replaceVarInTranslatedString(
      this.context[this.props.code],
      this.props
    );

    return <React.Fragment>{translated_string}</React.Fragment>;
  }
}

function replaceVarInTranslatedString(translated_string, props) {
  const regex = /{(\S+?)\}/g;
  const matches = translated_string.match(regex);

  if (matches !== null) {
    let propsName = "";
    matches.forEach(element => {
      propsName = element.replace("%{", "").replace("}", "");
      if (props !== null && propsName in props)
        translated_string = translated_string.replace(
          element,
          props[propsName]
        );
    });
  }
  return translated_string;
}

export function t(code, variables = null) {
  const translation = LanguageContext._currentValue[code];
  if (!translation) {
    return code;
  }

  const translated_string = replaceVarInTranslatedString(
    LanguageContext._currentValue[code],
    variables
  );

  return translated_string;
}

export function durationTranslate(duration, units = ["y", "mo"], round = true, separator=","){
  let result = humanizeDuration(duration, {
    language: Cookies.get("appLanguage"),
    units,
    round,
    fallbacks: ['en'] 
  });
  if(separator !==","){
    result = result.replace(",", " " + t(separator))
  }
  return result
};
 

Translate.contextType = LanguageContext;
export default Translate;

Translate.propTypes = {
  code: PropTypes.string.isRequired
};
