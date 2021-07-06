import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPowerOff,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/img/autobiz-trade.svg";
import LanguagePicker from "../common/LanguagePicker";
import { useUser } from "../../hooks/useUser";
import ExportFile from "../common/ExportFile";
import ExportOffers from "../Offers/ExportOffers";
import { exportOffersMapper } from "../../helper/Offer";
import { isBrowser } from "react-device-detect";
import { ZendeskAPI } from "react-zendesk";

const Header = (props) => {
  const history = useHistory();
  const { username, autobizUserId, usercountry } = useUser();
  const [logout, setLogout] = useState(false);
  const { path } = props.match;
  const [allowExport, setAllowExport] = useState(false);
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    usercountry !== "es"
      ? ZendeskAPI("webWidget", "hide")
      : ZendeskAPI("webWidget", "show");
  });

  const signOut = async function () {
    await Auth.signOut();
    setLogout(true);
    sessionStorage.removeItem("scrollPos");
    return;
  };

  const goBackEvent = (e) => {
    e.preventDefault();
    history.goBack();
  };

  if (logout) return <Redirect to="/" />;

  return (
    <header>
      {path === "/records/:refId" && (
        <Link onClick={(e) => goBackEvent(e)} className="left-col">
          <FontAwesomeIcon
            size="lg"
            icon={faArrowLeft}
            className="back-arrow"
          />
        </Link>
      )}

      <Link to="/records">
        <img alt="autobizTrade" className="logo" src={logo} />
      </Link>

      <p className="tagline">Nicer people. Better cars.</p>

      <div className="right-col">
        {isBrowser && (
          <div className="d-none d-lg-inline-block mr-5">
            <ExportOffers
              setAllowExport={setAllowExport}
              setOffers={setOffers}
              userId={autobizUserId}
            />
          </div>
        )}
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
      {allowExport && (
        <ExportFile
          fileName="offers"
          datas={offers}
          mappers={exportOffersMapper}
          setAllowExport={setAllowExport}
        />
      )}
    </header>
  );
};

export default Header;
