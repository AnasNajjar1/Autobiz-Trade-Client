import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import RecordsListContainer from "../components/RecordsList/RecordsListContainer";

const RecordsListView = () => {
  return (
    <div className="page page-car-list">
      <Header />
      <RecordsListContainer />
      <Footer />
    </div>
  );
};

export default RecordsListView;
