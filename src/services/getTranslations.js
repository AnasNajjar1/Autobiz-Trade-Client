import translations_fr from "../translations/fr";
import translations_de from "../translations/de";

export const languages = { fr: translations_fr, de: translations_de };

export default function(language = process.env.REACT_APP_LANG) {
  return languages[language];
}
