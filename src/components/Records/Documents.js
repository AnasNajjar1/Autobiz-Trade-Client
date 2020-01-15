import React from "react";
import pdfIcon from "../../assets/img/ico-pdf.png";
import { t } from "../common/Translate";
import Cookies from "js-cookie";
import { lang as pdfLang } from ".././../config";
import _ from "lodash";

const Documents = ({ items }) => {
  const lang = Cookies.get("appLanguage");
  return (
    <div className="list-document">
      {items.map((item, index) => (
        <div className="cell" key={index}>
          <div className="item">
            <a href={`${item.link}?language=${_.get(pdfLang, lang, pdfLang["default"])}`} target="_blank" rel="noopener noreferrer">
              <img src={pdfIcon} alt="pdf" />
              {t(item.title)}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documents;
