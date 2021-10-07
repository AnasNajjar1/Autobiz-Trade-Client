import React from "react";
import { t } from "../common/Translate";

const PrivacyPolicy = () => {
  const introPrivacyPolicy = { __html: t("introPrivacyPolicy") };
  const paragraphPrivacyPolicy1 = { __html: t("paragraphPrivacyPolicy1") };
  const paragraphPrivacyPolicy2 = { __html: t("paragraphPrivacyPolicy2") };
  const paragraphPrivacyPolicy3 = { __html: t("paragraphPrivacyPolicy3") };
  const paragraphPrivacyPolicy4 = { __html: t("paragraphPrivacyPolicy4") };
  const paragraphPrivacyPolicy5 = { __html: t("paragraphPrivacyPolicy5") };

  return (
    <div className="privacy-block container">
      <h4 className="d-flex justify-content-center mt-5">
        {t("privacyPolicyTitle")}
      </h4>
      <label dangerouslySetInnerHTML={introPrivacyPolicy} />
      <h4>{t("titlePrivacyPolicy1")}</h4>
      <label dangerouslySetInnerHTML={paragraphPrivacyPolicy1} />
      <h4>{t("titlePrivacyPolicy2")}</h4>
      <label dangerouslySetInnerHTML={paragraphPrivacyPolicy2} />
      <h4>{t("titlePrivacyPolicy3")}</h4>
      <label dangerouslySetInnerHTML={paragraphPrivacyPolicy3} />
      <h4>{t("titlePrivacyPolicy4")}</h4>
      <label dangerouslySetInnerHTML={paragraphPrivacyPolicy4} />
      <h4>{t("titlePrivacyPolicy5")}</h4>
      <label dangerouslySetInnerHTML={paragraphPrivacyPolicy5} />
    </div>
  );
};

export default PrivacyPolicy;
