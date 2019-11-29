import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import _ from "lodash";
import { dictionnary, flags, LanguageContext } from "../../language-context";

const handleChangeLang = async language => {
  Cookies.set("appLanguage", language, { expires: 365 });
  window.dispatchEvent(
    new CustomEvent("changeLanguage", { detail: { language } })
  );
};

const LanguagePicker = () => {
  const languages = Object.keys(dictionnary);
  const appLanguage = Cookies.get("appLanguage");

  return (
    <ul className="languagepicker">
      <li key={appLanguage}>
        <img src={flags[appLanguage]} alt={appLanguage} />
      </li>
      {_.without(languages, appLanguage).map(lang => {
        return (
          <li
            key={lang}
            className="pointer"
            onClick={() => handleChangeLang(lang)}
          >
            <img src={flags[lang]} alt={lang} />
          </li>
        );
      })}
    </ul>
  );
};

export default LanguagePicker;