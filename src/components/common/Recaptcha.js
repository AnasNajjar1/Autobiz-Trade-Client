import React, { createRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaAccess } from "../../config";

const Recaptcha = ({ setCaptchaToken }) => {
  const recaptchaRef = createRef();

  const onChange = (value) => {
    console.log(value);
    setCaptchaToken(value);
  };

  return (
    <div className="text-center mt-5">
      <ReCAPTCHA
        className="g-recaptcha"
        ref={recaptchaRef}
        sitekey={recaptchaAccess.siteKey}
        onChange={onChange}
      />
    </div>
  );
};

export default Recaptcha;
