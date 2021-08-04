import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import DealersListContainer from "../components/DealersList/DealersListContainer";
import { useUser } from "../hooks/useUser";

const DealersListView = (props) => {
  const { usercountry } = useUser();
  return (
    <div className="page page-dealer-list">
      <Header {...props} />
      {usercountry && <DealersListContainer usercountry={usercountry} />}
      <Footer />
    </div>
  );
};

export default DealersListView;
