import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/img/autobiz-trade.svg";
import Cookies from "js-cookie";
import _ from "lodash";

import { dictionnary, flags, LanguageContext } from "../../language-context";

const Header = () => {
  const [username, setUsername] = useState("");
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: false }).then(user => {
      setUsername(`${user.firstname} ${user.lastname}`);
    });
  }, []);

  const signOut = async function() {
    await Auth.signOut();
    setLogout(true);
    return;
  };

  if (logout) return <Redirect to="/" />;

  const handleChangeLang = async language => {
    Cookies.set("appLanguage", language, { expires: 365 });
    window.dispatchEvent(
      new CustomEvent("changeLanguage", { detail: { language } })
    );
  };

  const languagePicker = () => {
    const languages = Object.keys(dictionnary);
    const appLanguage = Cookies.get("appLanguage");

    return (
      <ul className="languagepicker">
        <li key={appLanguage}>
          <img src={flags[appLanguage]} alt={appLanguage} />
        </li>
        {_.without(languages, appLanguage).map(lang => {
          return (
            <li
              key={lang}
              className="pointer"
              onClick={() => handleChangeLang(lang)}
            >
              <img src={flags[lang]} alt={lang} />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <header>
      <Link to="/records">
        <img alt="autobizTrade" className="logo" src={logo} />
      </Link>

      <div className="right-col">
        {(username && (
          <>
            <FontAwesomeIcon
              icon={faUser}
              size="sm"
              className="d-none d-sm-inline"
            />
            <span className=" d-none d-sm-inline mx-2">{username}</span>

            <FontAwesomeIcon icon={faPowerOff} onClick={() => signOut()} />
          </>
        )) || <Spinner color="primary" size="sm" />}
        {languagePicker()}
      </div>
    </header>
  );
};

export default Header;
