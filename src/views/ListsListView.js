import React from "react";
import Header from "../components/Header/Header";
import ListsListContainer from "../components/ListsList/ListsListContainer";

const ListsListView = (props) => {
  return (
    <div className="page page-dealer-list">
      <Header {...props} />
      <ListsListContainer />
    </div>
  );
};

export default ListsListView;
