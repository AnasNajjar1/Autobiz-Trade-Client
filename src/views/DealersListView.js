import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import DealersListContainer from "../components/DealersList/DealersListContainer";

const DealersListView = props => {
  return (
    <div className="page page-dealer-list">
      <Header {...props} />
      <DealersListContainer />
      <Footer />
    </div>
  );
};

export default DealersListView;
