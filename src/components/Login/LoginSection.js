import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/img/logo_autobiztrade.svg";
import { linkNewPassword, tradeHelpMail } from "../../config";
import { Auth, API } from "aws-amplify";
import { handleChangeLang } from "../common/LanguagePicker";
import { languages } from "../../language-context";
import En from "../../assets/img/flags/en.svg";
import { t } from "../common/Translate";
import _ from "lodash";
import "../../assets/scss/login.scss";

const LoginSection = ({ history, entryPath, appLanguage, setAppLanguage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flagValue, setFlagValue] = useState(En);
  const languagePickerRef = useRef(undefined);

  useEffect(() => {
    for (let i = 0; i < languagePickerRef.current.options.length; i++) {
      if (
        appLanguage ===
        languagePickerRef.current.options[i].getAttribute("country")
      ) {
        languagePickerRef.current.value =
          languagePickerRef.current.options[i].value;
        setFlagValue(languagePickerRef.current.options[i].value);
      }
    }
  }, []);

  async function updateLanguage(e) {
    setFlagValue(e.target.value);
    const selectedLang =
      e.target.options[e.target.selectedIndex].getAttribute("country");
    setAppLanguage(selectedLang);
    await handleChangeLang(selectedLang);
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

      signInAutobiz(username, password)
        .then(() => history.push(entryPath))
        .catch((e) => setError(true))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="hp-section login">
      <div className="language">
        <img src={flagValue} alt="Country flag" />
        <select
          onChange={updateLanguage}
          value={flagValue}
          ref={languagePickerRef}
        >
          {_.map(languages, (trad, lang) => (
            <option
              key={lang}
              country={lang}
              value={require(`../../assets/img/flags/${lang}.svg`)}
            >
              {t(trad)}
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
        <a className="passwordForgotten" href={linkNewPassword[appLanguage]}>
          {t("forgot_password")}
        </a>
        <div className="formSeparator">
          <div className="line"></div>
          <div className="name">{t("or")}</div>
        </div>
        <a className="register" href={`/register/${appLanguage}`}>
          {t("freeSubscriptionCTA")}
        </a>
      </div>
    </div>
  );
};

export default LoginSection;

async function signInAutobiz(username, password) {
  const authAutobiz = await API.post("b2bPlateform", "/auth", {
    body: { username, password },
  });

  // To derive necessary data from the provider
  const {
    token, // the token you get from the provider
    domain,
    expiresIn,
    user,
    identity_id,
  } = authAutobiz;
  return Auth.federatedSignIn(
    domain,
    {
      token,
      identity_id, // Optional
      expires_at: expiresIn * 1000 + new Date().getTime(), // the expiration timestamp
    },
    user
  )
    .then((cred) => {
      // If success, you will get the AWS credentials
      return Auth.currentAuthenticatedUser();
    })
    .then((user) => {
      // If success, the user object you passed in Auth.federatedSignIn
      return user;
    })
    .catch((e) => {
      console.log("error", e.message);
    });
}

async function refreshToken() {
  // refresh the token here and get the new token info
  // ......
  const authAutobiz = await API.post("b2bPlateform", "/auth/refresh");
  const {
    token, // the token you get from the provider
    expiresIn,
    identity_id,
  } = authAutobiz;

  return {
    token, // the token from the provider
    expires_at: expiresIn * 1000 + new Date().getTime(), // the expiration timestamp
    identity_id, // optional, the identityId for the credentials
  };
}

Auth.configure({
  refreshHandlers: {
    developer: refreshToken(),
  },
});
