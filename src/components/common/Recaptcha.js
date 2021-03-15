import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaAccess } from "../../config";

const Recaptcha = () => {
  let captcha;

  const onChange = (value) => {
    console.log(value);
  };

  const setCaptchaRef = (ref) => {
    if (ref) {
      return (captcha = ref);
    }
  };

  const resetCaptcha = () => {
    // maybe set it till after is submitted
    captcha.reset();
  };
  return (
    <div className="text-center">
      <ReCAPTCHA
        sitekey={recaptchaAccess.siteKey}
        className="g-recaptcha"
        ref={(r) => setCaptchaRef(r)}
        onChange={(onChange, () => resetCaptcha())}
      />
    </div>
  );
};

export default Recaptcha;
