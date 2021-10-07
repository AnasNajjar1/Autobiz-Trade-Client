import React from "react";
import Cookies from "js-cookie";

import translationsFr from "./translations/fr";
import translationsDe from "./translations/de";
import translationsEs from "./translations/es";

import flagFr from "./assets/img/flags/fr.svg";
import flagDe from "./assets/img/flags/de.svg";
import flagEs from "./assets/img/flags/es.svg";
import flagIt from "./assets/img/flags/it.svg";
import flagPt from "./assets/img/flags/pt.svg";
import flagEn from "./assets/img/flags/en.svg";
import flagNl from "./assets/img/flags/nl.svg";
import { didomiConfig, linkPrivacy } from "./config";

export const dictionnary = {
  fr: translationsFr,
  de: translationsDe,
  es: translationsEs,
  it: false,
  pt: false,
  en: false,
  nl: false,
};

export const languageList = ["fr", "de", "es", "it", "pt", "en", "nl"];

export const flags = {
  fr: flagFr,
  de: flagDe,
  es: flagEs,
  it: flagIt,
  pt: flagPt,
  en: flagEn,
  nl: flagNl,
};

export const languages = {
  fr: "frenchHp",
  de: "germanHP",
  es: "spainHp",
  it: "italianHp",
  pt: "portugueseHp",
  en: "englishHP",
  //nl: "dutchHp",
};

export const corporateSiteLink = {
  fr: "https://office.autobiz.com/contact/",
  en: "https://corporate.autobiz.com/en/contact-us",
  es: "https://office.autobiz.com/es/contacto/",
  pt: "https://corporate.autobiz.com/pt/contactos",
  it: "https://office.autobiz.com/it/contatti/",
  de: "https://corporate.autobiz.com/de/kontakt",
  nl: "https://corporate.autobiz.com/nl/contact",
};

export const termsOfUseLink = {
  fr: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/cgu/cgu-fr.pdf",
  it: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/cgu/cgu-fr.pdf",
  pt: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/cgu/cgu-fr.pdf",
  de: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/cgu/cgu-fr.pdf",
  nl: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/cgu/cgu-fr.pdf",
  en: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/cgu/cgu-fr.pdf",
  es: "https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/cgu/cgu-es.pdf",
};

export const contactUsLink = {
  fr: "https://corporate.autobiz.com/contact",
  en: "https://corporate.autobiz.com/en/contact-us",
  de: "https://corporate.autobiz.com/de/kontakt",
  es: "https://corporate.autobiz.com/es/contactos",
  pt: "https://corporate.autobiz.com/pt/contactos",
  it: "https://corporate.autobiz.com/it",
};

export const LanguageContext = React.createContext(
  dictionnary.fr // default value
);

const selectRightLanguageToApply = (languageUrl) => {
  let language = languageUrl;
  if (isLanguageValid(language)) return language;
  language = Cookies.get("applanguage");
  if (isLanguageValid(language)) return language;
  language = window.navigator.language?.slice(0, 2);
  if (isLanguageValid(language)) return language;
  return "en";
};

const isLanguageValid = (language) => languageList.includes(language);

export const defineCorrectLanguage = (languageUrl) => {
  const language = selectRightLanguageToApply(languageUrl);
  return language;
};

export const getCurrentLanguage = () => window.location.pathname.split("/")[1];

export const getCurrentPath = () =>
  `/${window.location.pathname.split("/").slice(2).join("/")}`;

export const getCurentSearch = () => window.location.search;

export const getFullPath = () => window.location.pathname;

export const handleChangeLang = async (language) => {
  const path = !languageList.includes(getCurrentLanguage())
    ? getFullPath()
    : getCurrentPath();
  window.location.replace(`/${language}${path}${getCurentSearch()}`);
  Cookies.set("applanguage", language);
};

export const defineEntryPath = () => {
  if (!getFullPath().split("/").includes("login"))
    return languageList.includes(getCurrentLanguage())
      ? getCurrentPath()
      : getFullPath();
  return "/records";
};

export const didomiSetConfig = (language) => {
  didomiConfig.config.app.privacyPolicyURL = `${window.location.host}/${language}/${linkPrivacy[language]}`;
  didomiConfig.config.languages = {
    enabled: [language],
    default: language,
  };
  return didomiConfig;
};
