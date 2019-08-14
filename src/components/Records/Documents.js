import React from "react";
import pdfIcon from "../../assets/img/ico-pdf.png";

const Documents = ({ items }) => {
  return (
    <div className="list-document">
      {items.map((item, index) => (
        <div className="cell" key={index}>
          <div className="item">
            <a href={item.link}>
              <img src={pdfIcon} alt="pdf" />
              {item.title}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documents;
