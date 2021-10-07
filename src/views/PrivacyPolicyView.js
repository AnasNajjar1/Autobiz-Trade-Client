import React from "react";
import { ZendeskDisplayer } from "../components/common/ZendeskDisplayer";
import { getCurrentLanguage } from "../language-context";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";

const PrivacyPolicyView = (props) => {
  const currentLanguage = getCurrentLanguage();
  return (
    <>
      <ZendeskDisplayer language={currentLanguage} />
      <PrivacyPolicy didomi={props.didomi} />
    </>
  );
};

export default PrivacyPolicyView;
