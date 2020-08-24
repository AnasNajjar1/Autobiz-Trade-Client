import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ListsListContainer from "../components/ListsList/ListsListContainer";

const ListsListView = (props) => {
  return (
    <div className="page page-dealer-list">
      <Header {...props} />
      <ListsListContainer />
      <Footer />
    </div>
  );
};

export default ListsListView;
