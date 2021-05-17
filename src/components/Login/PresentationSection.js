import React from "react";
import FirstIcon from "../../assets/img/magnifier.svg";
import SecondIcon from "../../assets/img/graphic.svg";
import ThirdIcon from "../../assets/img/bet.svg";
import { t } from "../common/Translate";

const PresentationSection = () => {
  return (
    <div className="hp-section presentation">
      <h2>{t("hpTitle1")}</h2>
      <div className="blocks">
        <div className="block">
          <img src={FirstIcon} alt="Magnifier icon" />
          <h3>{t("hpTitle2")}</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: t("hpParagraph2") }}
          ></div>
        </div>
        <div className="block">
          <img src={SecondIcon} alt="Graphic icon" />
          <h3>{t("hpTitle3")}</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: t("hpParagraph3") }}
          ></div>
        </div>
        <div className="block">
          <img src={ThirdIcon} alt="Bet icon" />
          <h3>{t("hpTitle4")}</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: t("hpParagraph4") }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PresentationSection;
