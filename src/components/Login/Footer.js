import React from "react";
import { t } from "../common/Translate";
import { termsOfUseLink, contactUsLink, getCurrentLanguage } from "../../language-context";

const Footer = ({ didomi }) => {
  const currentLanguage = getCurrentLanguage();

  const openPreferences = () => {
    if (didomi.preferences) didomi.preferences.show();
  };
  return (
    <div className="hp-section footer">
      <div className="legalMentions">
        <a href={contactUsLink[currentLanguage]} target="_blank">
          {t("contactUsHp")}
        </a>
        <a>{t("confidentialityHp")}</a>
        <a onClick={() => openPreferences()}>{t("Consent choices")}</a>
        <a href={termsOfUseLink[currentLanguage]} target="_blank">
          {t("termsOfUseHp")}
        </a>
        <a>{t("accessibiltyHp")}</a>
      </div>
      <div className="copyright">© autobiz, SAS 2021</div>
    </div>
  );
};

export default Footer;
