import React from "react";

const Grade = ({ letter }) => {
  if (typeof letter !== "string") return <p className="text-center">-</p>;
  let label = "";

  switch (letter.toUpperCase()) {
    default:
      return null;
    case "A":
      label = "Très bon";
      break;
    case "B":
      label = "Bon";
      break;
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
    <div className="grade-bar">
      <span className={`grade-cursor grade-cursor-${letter.toLowerCase()}`}>
        <span className="letter">{letter.toUpperCase()}</span>
        <span className="label">{label}</span>
      </span>
    </div>
  );
};

export default Grade;
