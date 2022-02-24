import React, { createRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaAccess } from "../../config";

const InvisibleRecaptcha = ({ reference }) => {
  return (
    <ReCAPTCHA
      className="g-recaptcha"
      ref={reference ? reference : createRef()}
      sitekey={recaptchaAccess.siteKeyInvisible}
      size="invisible"
    />
  );
};

export default InvisibleRecaptcha;
