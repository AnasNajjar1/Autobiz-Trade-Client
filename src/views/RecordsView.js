import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Records from "../components/Records/Records";

const RecordsView = props => {
  return (
    <div className="page page-car-list">
      <Header />
      <main>
        <div className="page page-car-detail">
          {/* <Records refId={props.match.params.refId} /> */}
          <Records refId="2a0da720-c8e3-11e9-9e46-732d3fce76de" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecordsView;
