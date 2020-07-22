import React, { useEffect } from "react";
import Reports from "../components/Reports/Reports";
import Header from "../components/Header/Header";
import { handleChangeLang } from "../components/common/LanguagePicker";

const ReportsView = (props) => {
  useEffect(() => {
    handleChangeLang(props.match.params.lang);
  }, []);

  return (
    <div className="page page-report">
      <Header {...props} />
      <Reports refId={props.match.params.refId} />
    </div>
  );
};

export default ReportsView;
