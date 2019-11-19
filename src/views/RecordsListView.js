import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import RecordsListContainer from "../components/RecordsList/RecordsListContainer";

const RecordsListView = props => {
  return (
    <div className="page page-car-list">
      <Header {...props} />
      <RecordsListContainer />
      <Footer />
    </div>
  );
};

export default RecordsListView;
