import React from "react";

import translationsFr from "./translations/fr";
import translationsDe from "./translations/de";

import flagFr from "./assets/img/flags/fr.svg";
import flagDe from "./assets/img/flags/de.svg";

export const dictionnary = {
  fr: translationsFr,
  de: translationsDe
};
export const flags = { fr: flagFr, de: flagDe };

export const LanguageContext = React.createContext(
  dictionnary.fr // default value
);
