import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/img/autobiz-trade.svg";

import LanguagePicker from "../common/LanguagePicker";

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
        {LanguagePicker()}
      </div>
    </header>
  );
};

export default Header;
