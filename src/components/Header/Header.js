import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { ZendeskDisplayer } from "../common/ZendeskDisplayer";
import { AutobizNavBar } from "autobiz-strap";
import { Auth } from "../../providers/Auth";
import clearAuthData from "../../providers/Auth/clearAuthData";
import { getCurrentLanguage } from "../../language-context";
import { contactEmail, staticImagesUrl } from "../../config";
import { t } from "autobiz-translate";
import LanguageSwitcher from "../common/LanguageSwitcher";

const Header = () => {
  const history = useHistory();
  const [logout, setLogout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const appUrl = `http://${window.location.host}${window.location.pathname}`;

  const signOut = async function () {
    const loggedOut = await Auth.logout();
    if (loggedOut) {
      await clearAuthData();
      setLogout(true);
    }
  };

  const goBackEvent = (e) => {
    e.preventDefault();
    history.goBack();
  };

  if (logout) return <Redirect to="/" />;

  const { firstname, lastname, country, email } = Auth.currentUser();
  const currentLanguage = getCurrentLanguage();
  const apps = Auth.currentUserOtherApps(currentLanguage);

  return (
    <div className="autobiz-nav-bar">
      <ZendeskDisplayer language={country} />
      <AutobizNavBar
        brand="autobizTrade"
        brandLink={appUrl}
        lang={currentLanguage}
        maxWidth={1120}
        menu={{
          apps,
          help: [
            {
              name: <div className="title">{t("contact_us")}</div>,
              onClick: () => (window.location.href = "mailto:" + contactEmail),
            },
            {
              name: <div className="title">{t("terms_of_use")}</div>,
              onClick: () =>
                window.open(
                  `${staticImagesUrl}/cgu/cgu-${currentLanguage.toLowerCase()}.pdf`,
                  "_blank"
                ),
            },
          ],
          languages: [
            {
              name: <LanguageSwitcher isOpen={isOpen} setIsOpen={setIsOpen} />,
              onClick: () => setIsOpen(!isOpen),
            },
          ],
          user: {
            firstName: firstname,
            lastName: lastname,
            country: country,
            email: email,
            logout: () => signOut(),
          },
        }}
      />

      {/* <header>
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

        <p className="tagline">Nicer People. Better cars!</p>

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
      </header> */}
    </div>
  );
};

export default Header;
