import React, { useState, useEffect, useRef } from "react";
import Logo from "../../assets/img/logo_autobiztrade.svg";
import { linkNewPassword, tradeHelpMail } from "../../config";
import { getFlag } from "../common/LanguagePicker";
import ForgottenPasswordModal  from "./ForgottenPasswordModal";
import {
  languages,
  getCurrentLanguage,
  handleChangeLang,
} from "../../language-context";
import { t } from "../common/Translate";
import _ from "lodash";
import "../../assets/scss/login.scss";
import { useHistory } from "react-router";
import Recaptcha from "../common/Recaptcha";
import InvisibleRecaptcha from "../common/InvisibleRecaptcha";
import { Auth } from "../../providers/Auth";

const LoginSection = ({ entryPath }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authTries, setAuthTries] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [needValidateCaptcha, setNeedValidateCaptcha] = useState(false);
  const [size, setSize] = useState("invisible");

  const recaptchaRef = useRef();

  async function updateLanguage(e) {
    const selectedLang = e.target.value;
    handleChangeLang(selectedLang);
  }

  const handleToggle = () => {
    setOpen(!open);
  }
  
  const handleChange = () => {
    setError(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    handleChange();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    handleChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError(true);
    } else {
      if (authTries < 3 && recaptchaRef?.current) {
        await recaptchaRef.current.reset();
        const token = await recaptchaRef.current.executeAsync();
        proceedAuthentification(token);
      } else if (authTries >= 3 && captchaToken) {
        proceedAuthentification();
      } else {
        setNeedValidateCaptcha(true);
      }
    }
  };

  useEffect(() => {
    authTries >= 3 ? setSize("normal") : setSize("invisible");
  }, [authTries]);

  const proceedAuthentification = (token = captchaToken) => {
    setLoading(true);
    Auth.login(username, password, token)
      .then(() => {
        setNeedValidateCaptcha(false);
        setAuthTries(0);
        history.push(entryPath);
      })
      .catch((err) => {
        setError(true);
        setAuthTries(authTries + 1);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoToRegister = () => history.push("register");

  const currentLanguage = getCurrentLanguage();
  return (
    <div className="hp-section login">
      <div className="language">
        <img src={getFlag(currentLanguage)} alt="Country flag" />
        <select onChange={updateLanguage} value={currentLanguage}>
          {Object.entries(languages).map(([lang, label]) => (
            <option key={lang} value={lang}>
              {t(label)}
            </option>
          ))}
        </select>
      </div>
      <div className="introduction">
        <img src={Logo} alt="logo autobizTrade" />
        <h1>Nicer People. Better cars!</h1>
        <div className="pitch">{t("hpParagraph1")}</div>
      </div>
      <div className="loginForm">
        <div className="explanation">{t("hpSentenceIdentification")}</div>
        {error && (
          <div className="error">
            <div className="title">{t("user_unauthorized")}</div>
            <div className="text">
              {t("login_error_help_message")} <br className="break" />
              <a href={`mailto:${tradeHelpMail}`}>{tradeHelpMail}</a>
            </div>
          </div>
        )}
        <label htmlFor="user" className="inputTitle">
          {t("user")}
        </label>
        <input name="user" type="text" onChange={handleUsernameChange} />
        <label htmlFor="password" className="inputTitle">
          {t("password")}
        </label>
        <input
          name="password"
          type="password"
          onChange={handlePasswordChange}
        />
        {size === "normal" ? (
          <Recaptcha setCaptchaToken={setCaptchaToken} />
        ) : (
          <InvisibleRecaptcha reference={recaptchaRef} />
        )}
        {needValidateCaptcha && !captchaToken && (
          <p className="text-center text-danger">
            <span>{t("checkRecaptchaForm")}</span>
          </p>
        )}
        <button
          disabled={loading}
          className="cta"
          onClick={handleSubmit}
          style={{ marginTop: 10 }}
        >
          {t("connect")}
        </button>
        <div
          className="passwordForgotten"
          onClick={handleToggle}
        >
          {t("forgot_password")}
        </div>
        <ForgottenPasswordModal
          toggle={open}
          handleToggle={handleToggle}
        />
        <div className="formSeparator">
          <div className="line"></div>
          <div className="name">{t("or")}</div>
        </div>
        <button className="register" onClick={handleGoToRegister}>
          {t("freeSubscriptionCTA")}
        </button>
      </div>
    </div>
  );
};

export default LoginSection;
