import React from "react";

const Section = (props) => {
  return <div className={`section ` + props.className}>{props.children}</div>;
};

export default Section;
