import React from "react";

import translationsFr from "./translations/fr";
import translationsDe from "./translations/de";
import translationsEs from "./translations/es";

import flagFr from "./assets/img/flags/fr.svg";
import flagDe from "./assets/img/flags/de.svg";
import flagEs from "./assets/img/flags/es.svg";
import flagIt from "./assets/img/flags/it.svg";
import flagPt from "./assets/img/flags/pt.svg";
import flagEn from "./assets/img/flags/en.svg";

export const dictionnary = {
  fr: translationsFr,
  de: translationsDe,
  es: translationsEs,
  it: false,
  pt: false,
  en: false
};
export const flags = {
  fr: flagFr,
  de: flagDe,
  es: flagEs,
  it: flagIt,
  pt: flagPt,
  en: flagEn
};

export const LanguageContext = React.createContext(
  dictionnary.fr // default value
);
