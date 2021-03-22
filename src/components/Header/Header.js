import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPowerOff, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/img/autobiz-trade.svg";
import LanguagePicker from "../common/LanguagePicker";
import { useUser } from "../../hooks/useUser";

const Header = props => {
  const history = useHistory();
  const { username } = useUser();
  const [logout, setLogout] = useState(false);
  const { path } = props.match

  const signOut = async function() {
    await Auth.signOut();
    setLogout(true);
    return;
  };

  const goBackEvent = (e) => {
    e.preventDefault();
    history.goBack();
  };

  if (logout) return <Redirect to="/" />;

  return (
    <header>
      {path === "/records/:refId" && <Link onClick={(e) => goBackEvent(e)} className='left-col'>
        <FontAwesomeIcon size="lg" icon={faArrowLeft} className='back-arrow'/>
      </Link>}

      <Link to="/records">
        <img alt="autobizTrade" className="logo" src={logo} />
      </Link>

      <p className="tagline">Nicer people. Better cars.</p>

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
