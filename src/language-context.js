import React from "react";

import translationsFr from "./translations/fr";
import translationsDe from "./translations/de";
import translationsEs from "./translations/es";

import flagFr from "./assets/img/flags/fr.svg";
import flagDe from "./assets/img/flags/de.svg";
import flagEs from "./assets/img/flags/es.svg";

export const dictionnary = {
  fr: translationsFr,
  de: translationsDe,
  es: translationsEs
};
export const flags = { fr: flagFr, de: flagDe, es: flagEs };

export const LanguageContext = React.createContext(
  dictionnary.fr // default value
);
