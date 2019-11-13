import React from "react";
import pdfIcon from "../../assets/img/ico-pdf.png";
import { t } from "../common/Translate";

const Documents = ({ items }) => {
  return (
    <div className="list-document">
      {items.map((item, index) => (
        <div className="cell" key={index}>
          <div className="item">
            <a href={item.link} target="_blank" rel="noopener noreferrer">
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
