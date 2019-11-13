import React from "react";
import pdfIcon from "../../assets/img/ico-pdf.png";
import Translate from '../common/Translate'
const Documents = ({ items }) => {
  const pdfVariables = ["pdfReport", "Rapport d'inspection", "PDF Inspection", "Rapport d'inspeciton"]
  return (
    <div className="list-document">
      {items.map((item, index) => (
        <div className="cell" key={index}>
          <div className="item">
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <img src={pdfIcon} alt="pdf" />
              <Translate code={pdfVariables.includes(item.title) && 'pdfReport' || item.title} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documents;
