import React from "react";

import translations_fr from "./translations/fr";
import translations_de from "./translations/de";

export const languages = { fr: translations_fr, de: translations_de };
export const LanguageContext = React.createContext(
  languages.fr // default value
);
