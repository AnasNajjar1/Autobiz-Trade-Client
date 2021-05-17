import React from "react";
import { t } from "../common/Translate";

const StatsSection = () => {
  return (
    <div className="hp-section stats">
      <h2>{t("hpTitle7")}</h2>
      <div className="blocks">
        <div className="block">
          <div className="title">
            <b>{t("hpParagraph7")}</b>
            <br />
            {t("hpParagraph11")}
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: t("hpParagraph14") }}
          ></div>
        </div>
        <div className="block">
          <div className="title">
            <b>{t("hpParagraph8")}</b>
            <br />
            {t("hpParagraph12")}
          </div>
          <div className="content">{t("hpParagraph15")}</div>
        </div>
        <div className="block">
          <div className="title">
            <b>{t("hpParagraph9")}</b>
            <br />
            {t("hpParagraph13")}
          </div>
          <div className="content">{t("hpParagraph16")}</div>
        </div>
        <div className="block">
          <div className="title">
            <b>{t("hpParagraph10")}</b>
          </div>
          <div className="content">{t("hpParagraph17")}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
