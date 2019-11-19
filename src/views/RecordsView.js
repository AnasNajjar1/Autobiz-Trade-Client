import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Records from "../components/Records/Records";

const RecordsView = props => {
  return (
    <div className="page page-car-list">
      <Header {...props}/>
      <main>
        <div className="page page-car-detail">
          <Records refId={props.match.params.refId} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecordsView;
