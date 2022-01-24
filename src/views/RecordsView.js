import React from "react";
import Header from "../components/Header/Header";
import Records from "../components/Records/Records";
import { Container } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { t } from "../components/common/Translate";

const RecordsView = (props) => {

  const history = useHistory();
  const goBackEvent = (e) => {
    e.preventDefault();
    history.goBack();
  };

  return (
    <div className="page page-car-list">
      <Header {...props} />
      <Container>
        <Link onClick={(e) => goBackEvent(e)} className="small text-secondary">
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" size="1x" />{" "}
          {t("backToList")}
        </Link>
        <hr />
      </Container>
      <main>
        <div className="page page-car-detail">
          <Records refId={props.match.params.refId} />
        </div>
      </main>
    </div>
  );
};

export default RecordsView;
