import React from "react";
import { t } from "../common/Translate";
import { corporateSiteLink } from "../../language-context";

const CarDealerSection = ({ appLanguage }) => {
  return (
    <div className="hp-section car-dealer">
      <div className="explanations">
        <h2>{t("hpTitle6")}</h2>
        <h3>{t("hpParagraph5")}</h3>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: t("hpParagraph6") }}
        ></div>
        <a className="cta" href={corporateSiteLink[appLanguage]}>
          {t("carDealerCta")}
        </a>
      </div>
      <div className="img" alt="homme prenant une voiture en photo" />
    </div>
  );
};

export default CarDealerSection;
