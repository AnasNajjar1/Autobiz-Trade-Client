import React from "react";

const RecordsElementGrade = props => {
  const classes = `grade grade-${props.grade.toLowerCase()}`;

  let label = "";
  switch (props.grade.toUpperCase()) {
    case "A":
      label = "Très bon";
      break;
    case "B":
      label = "Bon";
      break;
    default:
    case "C":
      label = "Moyen";
      break;
    case "D":
      label = "Mauvais";
      break;
    case "E":
      label = "Très mauvais";
      break;
  }

  return (
    <div className="car-condition">
      État :<span className={classes}>{props.grade.toUpperCase()}</span>
      <span className="grade-label">{label}</span>
    </div>
  );
};

export default RecordsElementGrade;
