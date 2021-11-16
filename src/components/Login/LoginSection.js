import React, { useState } from "react";
import Logo from "../../assets/img/logo_autobiztrade.svg";
import { linkNewPassword, tradeHelpMail } from "../../config";
import {
  getFlag,
} from "../common/LanguagePicker";
import { languages, getCurrentLanguage, handleChangeLang } from "../../language-context";
import { t } from "../common/Translate";
import _ from "lodash";
import "../../assets/scss/login.scss";
import { Auth } from "../../providers/Auth";
import { useHistory } from "react-router";

const LoginSection = ({ entryPath }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function updateLanguage(e) {
    const selectedLang = e.target.value;
    handleChangeLang(selectedLang);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError(true);
    } else {
      setLoading(true);
      Auth.login(username, password)
        .then(() => history.push(entryPath))
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
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
        <button disabled={loading} className="cta" onClick={handleSubmit}>
          {t("connect")}
        </button>
        <a
          className="passwordForgotten"
          href={linkNewPassword[currentLanguage]}
        >
          {t("forgot_password")}
        </a>
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
