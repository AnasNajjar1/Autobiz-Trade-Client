import React from "react";
import Header from "../components/Header/Header";
import Dealer from "../components/Dealers/Dealers";
import { t } from "../components/common/Translate";
import { Container } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const DealersListView = (props) => {
  const history = useHistory();
  const goBackEvent = (e) => {
    e.preventDefault();
    history.goBack();
  };

  return (
    <div className="page page-dealer">
      <Header {...props} />
      <Container>
        <Link onClick={(e) => goBackEvent(e)} className="small text-secondary">
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" size="1x" />{" "}
          {t("backToList")}
        </Link>
        <hr />
      </Container>
      <Dealer refId={props.match.params.refId} />
    </div>
  );
};

export default DealersListView;
