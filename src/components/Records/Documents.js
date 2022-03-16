import React, { useState } from "react";
import pdfIcon from "../../assets/img/ico-pdf.png";
import { t } from "../common/Translate";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { pdfLang } from ".././../config";
import _ from "lodash";
import { getCurrentLanguage } from "../../language-context";

const Documents = ({ items, uuid }) => {
  const lang = getCurrentLanguage();
  const [popup, setPopup] = useState(false);
  const [link, setLink] = useState("");
  let angle = 0;

  const customRotate = () => {
    let img = document.getElementsByClassName("ril__image");
    angle = (angle + 90) % 360;
    img[0].setAttribute("style", `transform: rotate(${angle}deg)`);
  };

  return (
    <div className="list-document">
      {items.map((item, index) => {
        const itemLink =
          // item.title === "pdfReport"
          // ? `/reports/${item.link}`
          // :
          ["certificate_of_non-pledge", "histovec", "pdfReport"].includes(
            item.title
          )
            ? `${item.link}?language=${_.get(
                pdfLang,
                lang,
                pdfLang["default"]
              )}`
            : "default";
        return (
          <div className="cell" key={index}>
            <div className="item">
              {itemLink !== "default" ? (
                <a href={itemLink} target="_blank" rel="noopener noreferrer">
                  <img src={pdfIcon} alt="pdf" />
                  {t(item.title)}
                </a>
              ) : (
                <a
                  rel="noopener noreferrer"
                  onClick={() => {
                    setPopup(true);
                    setLink(item.link);
                  }}
                >
                  <img src={pdfIcon} alt="pdf" />
                  {t(item.title)}
                </a>
              )}
            </div>
          </div>
        );
      })}
      {popup && link && (
        <Lightbox
          mainSrc={link}
          toolbarButtons={[
            <FontAwesomeIcon
              className="ril__toolbarItemChild ril__builtinButton"
              icon={faSync}
              onClick={() => customRotate()}
            />,
          ]}
          onCloseRequest={() => setPopup(false)}
        />
      )}
    </div>
  );
};

export default Documents;
