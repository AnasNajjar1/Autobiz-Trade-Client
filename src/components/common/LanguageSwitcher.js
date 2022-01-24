import React, { useRef, useEffect } from "react";
import { getCurrentLanguage, handleChangeLang } from "../../language-context";
import { t } from "autobiz-translate";
import { getFlag, getOtherFlags } from "../common/LanguagePicker";
import { Col, Row } from "reactstrap";

const LanguageSwitcher = ({ isOpen, setIsOpen }) => {
  const currentLanguage = getCurrentLanguage();
  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the language menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen]);

  return (
    <div ref={ref}>
      <Row className="w-100 m-0 p-0 ">
        <Col className="title col-8 m-0 p-0">{t("languages")}</Col>
        <Col className="col-4 m-0 p-0 text-right">
          <img
            src={getFlag(currentLanguage)}
            alt={currentLanguage}
            className="icon-flag mr-2"
          />
          {currentLanguage.toUpperCase()}
        </Col>
        <div className={`menu-container ${isOpen ? "open" : ""}`}>
          <ul>
            {getOtherFlags(currentLanguage).map((lang) => (
              <li
                key={lang}
                className="pointer changeLang"
                id={`change_lang_${lang}`}
                data-lang={lang}
                onClick={() => handleChangeLang(lang)}
              >
                <img
                  src={getFlag(lang)}
                  alt={lang}
                  className="icon-flag mr-2"
                />
                {lang.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </Row>
    </div>
  );
};

export default LanguageSwitcher;
