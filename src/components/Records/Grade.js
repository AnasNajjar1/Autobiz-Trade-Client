import React from "react";
import Translate, { t } from "../common/Translate";

const Grade = ({ letter }) => {
  if (typeof letter !== "string") return <p className="text-center">-</p>;
  let label = "";

  switch (letter.toUpperCase()) {
    default:
      return null;
    case "A":
      label = t("very_good");
      break;
    case "B":
      label = t("good");
      break;
    case "C":
      label = t("average");
      break;
    case "D":
      label = t("bad");
      break;
    case "E":
      label = t("very_bad");
      break;
  }

  return (
    <div className="grade-bar">
      <span className={`grade-cursor grade-cursor-${letter.toLowerCase()}`}>
        <span className="letter">{letter.toUpperCase()}</span>
        <span className="label">{label}</span>
      </span>
    </div>
  );
};

export default Grade;
