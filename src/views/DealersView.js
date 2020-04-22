import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Dealer from "../components/Dealers/Dealers";
import { t } from "../components/common/Translate";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const DealersListView = (props) => {
  return (
    <div className="page page-dealer">
      <Header {...props} />
      <Container>
        <Link to="/dealers" className="small text-secondary">
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" size="1x" />{" "}
          {t("backToList")}
        </Link>
        <hr />
      </Container>
      <Dealer refId={props.match.params.refId} />
      <Footer />
    </div>
  );
};

export default DealersListView;
