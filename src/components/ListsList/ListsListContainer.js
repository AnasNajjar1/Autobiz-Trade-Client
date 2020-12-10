import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Translate, { t } from "../common/Translate";
import { API } from "aws-amplify";
import { useQueryParams, ArrayParam } from "use-query-params";
import ListsElement from "./ListsElement";
import MenuSwitcher from "../common/MenuSwitcher";

const ListsListContainer = () => {
  const ItemsPerPage = 6;

  const initialFormState = {
    range: [0, ItemsPerPage - 1],
  };

  const [query, setQuery] = useQueryParams({
    range: ArrayParam,
  });

  const [form, setValues] = useState({
    range: query.range || initialFormState.range,
  });
  const [lists, setLists] = useState([]);
  const [ListsCount, setListsCount] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      setIsFetching(true);
      const result = await API.get("b2bPlateform", `/list`, {
        queryStringParameters: {
          range: JSON.stringify(form.range),
        },
        response: true,
      });

      const contentRange = result.headers["content-range"];

      if (result.data && result.data.length > 0) {
        const contentRangeArray = contentRange.split("/");
        setListsCount(contentRangeArray[1]);
        setLists(result.data);
      } else {
        setListsCount(0);
        setLists([]);
      }
      setIsFetching(false);
    };

    fetchLists();
  }, [query]);

  // infinte scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;

    const currentRange = parseInt(form.range[1]);

    if (currentRange <= ListsCount) {
      form.range[1] = currentRange + ItemsPerPage;
      setQuery(form);
      setIsFetching(true);
    }
  };

  return (
    <Container>
      <MenuSwitcher />
      <hr />
      <Row>
        <Col>
          {ListsCount === 0 && (
            <Alert color="secondary" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <Translate code="no_result" />
            </Alert>
          )}

          {ListsCount > 0 && (
            <>
              <Row className="dealer-list">
                <Col xs="12">
                  <div className="h5 mb-3">
                    <b>{ListsCount}</b> {t("lists")}
                  </div>
                </Col>

                {lists &&
                  lists.map((record, index) => (
                    <ListsElement key={index} list={record} />
                  ))}
              </Row>
            </>
          )}
          {isFetching && (
            <Row>
              <Col className="text-center">
                <FontAwesomeIcon icon={faSpinner} size="3x" spin />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ListsListContainer;
