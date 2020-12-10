import React from "react";
import Translate, { t } from "../common/Translate";
const RecordsElementGrade = (props) => {
  if (props.grade === null) return null;

  const classes = `grade grade-${props.grade && props.grade.toLowerCase()}`;

  let label = "";
  switch (props.grade && props.grade.toUpperCase()) {
    case "A":
      label = t("very_good");
      break;
    case "B":
      label = t("good");
      break;
    default:
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
    <div className="car-condition-wrapper">
      <div className="car-condition">
        <Translate code="global_condition"></Translate> :
        <span className={classes}>
          {props.grade && props.grade.toUpperCase()}
        </span>
        <span className="grade-label">{label}</span>
      </div>
    </div>
  );
};

export default RecordsElementGrade;
