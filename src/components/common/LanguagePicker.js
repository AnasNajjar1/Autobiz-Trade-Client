import React from "react";
import _ from "lodash";
import { dictionnary, flags, handleChangeLang, getCurrentLanguage } from "../../language-context";

export const languages = Object.keys(dictionnary);

export const getFlag = (language) => flags[language];
export const getOtherFlags = (language) => _.without(languages, language);

const LanguagePicker = () => {
  const currentLanguage = getCurrentLanguage();
  return (
    <ul className="languagepicker">
      <li key={currentLanguage}>
        <img src={getFlag(currentLanguage)} alt={currentLanguage} />
      </li>
      {getOtherFlags(currentLanguage).map((lang) => {
        return (
          <li
            key={lang}
            className="pointer changeLang"
            id={`change_lang_${lang}`}
            data-lang={lang}
            onClick={() => handleChangeLang(lang)}
          >
            <img src={getFlag(lang)} alt={lang} />
          </li>
        );
      })}
    </ul>
  );
};

export default LanguagePicker;
