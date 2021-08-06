import React from "react";
import Reports from "../components/Reports/Reports";
import Header from "../components/Header/Header";

const ReportsView = (props) => {
  return (
    <div className="page page-report">
      <Header {...props} />
      <Reports refId={props.match.params.refId} />
    </div>
  );
};

export default ReportsView;
