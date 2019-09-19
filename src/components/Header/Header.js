import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Spinner } from "reactstrap";
import { t } from "../common/Translate"

import logo from "../../assets/img/autobiz-trade.svg";
const Header = () => {
  const [username, setUsername] = useState("");

  useEffect(()=>{
    Auth.currentAuthenticatedUser({bypassCache:false}).then(user => {
      setUsername(user.username);
    });
  }, [])
  
  const signOut = async function() {
    await Auth.signOut()
    return;
  };

  return (
    <header>
      <Link to="/">
        <img alt="autobizTrade" className="logo" src={logo} />
      </Link>
      <div className=" float-right mt-1 mr-2">
        {(username && (
          <span className="header-username mr-1">{`${t("hello")} ${username}`}</span>
        )) || <Spinner className="mr-2" color="primary" size="sm" />}

        <button
          class="btn btn-outline-success"
          type="submit"
          onClick={() => signOut()}
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
};

export default Header;
