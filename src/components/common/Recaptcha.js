import React, { createRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaAccess } from "../../config";

const Recaptcha = ({ setCaptchaToken, reference }) => {

  const onChange = (value) => {
    console.log(value);
    setCaptchaToken(value);
  };

  return (
    <div className="text-center">
      <ReCAPTCHA
        className="g-recaptcha"
        ref={reference ? reference : createRef()}
        sitekey={recaptchaAccess.siteKeyVisible}
        onChange={onChange}
      />
    </div>
  );
};

export default Recaptcha;
