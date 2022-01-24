import React from "react";
import Header from "../components/Header/Header";
import RecordsListContainer from "../components/RecordsList/RecordsListContainer";
import { useUser } from "../hooks/useUser";

const RecordsListView = (props) => {
  const { usercountry } = useUser();
  return (
    <div className="page page-car-list">
      <Header {...props} />
      {usercountry && <RecordsListContainer usercountry={usercountry} />}
    </div>
  );
};

export default RecordsListView;
