import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faSpinner,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import Translate, { t } from "../common/Translate";
import { API } from "aws-amplify";
import {
  useQueryParams,
  NumberParam,
  StringParam,
  DelimitedArrayParam,
  ArrayParam
} from "use-query-params";
import DealersElement from "./DealersElement";
import MenuSwitcher from "../common/MenuSwitcher";
import Section from "../RecordsList/Section";
import FormActions from "../RecordsList/FormActions";
import FilterSearch from "../RecordsList/FilterSearch";
import FilterBrands from "../RecordsList/FilterBrands";
import FilterModels from "../RecordsList/FilterModels";
import FilterCheckboxes from "../RecordsList/FilterCheckboxes";

const DealersListContainer = () => {
  const ItemsPerPage = 6;
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [modelLabels, setModelLabels] = useState([]);

  const updateField = e => {
    const { name, value } = e.target;
    const tmpForm = {
      ...form,
      [name]: value
    };
    setValues(tmpForm);
  };

  const updateSearch = () => {
    setQuery(form);
  };

  const showCustomList = listName => {
    form.list = listName;
    setQuery(form);
  };

  const handleReset = () => {
    setValues(initialFormState);
    setQuery(initialFormState);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await API.get("b2bPlateform", `/filter`, {
        response: true
      });
      setFilters(result.data);
    };

    fetchRecords();
  }, []);

  const updateCheckBox = (e, target) => {
    const { value, checked } = e.target;
    let tmpTarget = form[target];

    if (value === "all") {
      if (checked) {
        tmpTarget = ["all"];
      } else {
        tmpTarget = [];
      }
    } else {
      tmpTarget = tmpTarget.filter(function(item) {
        return item !== "all";
      });

      if (tmpTarget.includes(value)) {
        tmpTarget = tmpTarget.filter(function(item) {
          return item !== value;
        });
      } else {
        tmpTarget = [...tmpTarget, value];
      }
    }

    const tmpForm = {
      ...form,
      [target]: tmpTarget
    };

    setValues(tmpForm);
    setQuery(tmpForm);
  };

  const initialFormState = {
    search: "",
    list: "all",
    onlineOffersMinCount: 0,
    brandLabel: "",
    modelLabel: "",
    city: ["all"],
    range: [0, ItemsPerPage - 1]
  };

  const [query, setQuery] = useQueryParams({
    search: StringParam,
    list: StringParam,
    onlineOffersMinCount: NumberParam,
    brandLabel: StringParam,
    modelLabel: StringParam,
    city: DelimitedArrayParam,
    range: ArrayParam
  });

  const [form, setValues] = useState({
    search: query.search || initialFormState.search,
    list: query.list || initialFormState.list,
    onlineOffersMinCount:
      query.onlineOffersMinCount || initialFormState.onlineOffersMinCount,
    brandLabel: query.brandLabel || initialFormState.brandLabel,
    modelLabel: query.modelLabel || initialFormState.modelLabel,
    city: query.city || initialFormState.city,
    range: query.range || initialFormState.range
  });
  const [dealers, setDealers] = useState([]);
  const [DealersCount, setDealersCount] = useState([]);
  const [filters, setFilters] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchDealers = async () => {
      setIsFetching(true);
      const result = await API.get("b2bPlateform", `/pointOfSale`, {
        queryStringParameters: {
          search: form.search,
          list: form.list,
          onlineOffersMinCount: JSON.stringify(form.onlineOffersMinCount),
          brandLabel: form.brandLabel,
          modelLabel: form.modelLabel,
          city: JSON.stringify(form.city),
          range: JSON.stringify(form.range)
        },
        response: true
      });

      const contentRange = result.headers["content-range"];

      if (result.data && result.data.length > 0) {
        const contentRangeArray = contentRange.split("/");
        setDealersCount(contentRangeArray[1]);
        setDealers(result.data);
      } else {
        setDealersCount(0);
        setDealers([]);
      }
      setIsFetching(false);
    };

    fetchDealers();
  }, [query]);

  useEffect(() => {
    form.modelLabel = "";
    setQuery(form);
    if (filters.models) {
      setModelLabels(filters.models[form.brandLabel]);
    } else {
      setModelLabels([]);
    }
  }, [form.brandLabel]);

  useEffect(() => {
    setQuery(form);
  }, [form.modelLabel]);

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

    if (currentRange <= DealersCount) {
      form.range[1] = currentRange + ItemsPerPage;
      setQuery(form);
      setIsFetching(true);
    }
  };

  return (
    <Container>
      <MenuSwitcher current="dealers" />
      <Row>
        <div className="search-record-nav">
          <Section>
            <Row>
              <Col className="col col-6" sm="8" md="12">
                <FilterSearch
                  value={form.search}
                  updateField={updateField}
                  updateSearch={updateSearch}
                />
              </Col>

              <Col className="col d-md-none">
                <button
                  type="button"
                  className="btn btn-block btn-danger-reverse rounded"
                  onClick={() =>
                    setMenuMobileOpen(menuMobileOpen ? false : true)
                  }
                >
                  Filtrer <FontAwesomeIcon icon={faFilter} />
                </button>
              </Col>
            </Row>
          </Section>
          <Section>
            <p className="section-title">
              <Translate code="brand_and_model" />
            </p>

            {filters.brands && (
              <FilterBrands
                brands={filters.brands}
                value={form.brandLabel}
                updateField={updateField}
              />
            )}

            {modelLabels && (
              <FilterModels
                models={modelLabels}
                value={form.modelLabel}
                updateField={updateField}
              />
            )}

            <p className="section-title">
              <Translate code="storage_place" />
            </p>

            {filters.cities && (
              <FilterCheckboxes
                data={filters.cities}
                target="city"
                values={form.city}
                updateField={updateCheckBox}
                all
              />
            )}
          </Section>
          <Section>
            <FormActions reset={handleReset} />
          </Section>
        </div>

        <Col>
          <Row>
            <Col className="list-filter-buttons mb-2">
              <Button
                size="sm"
                outline
                className={form.list === "all" ? "active" : "inactive"}
                onClick={() => showCustomList("all")}
              >
                {t("all_dealers")}
              </Button>

              <Button
                size="sm"
                outline
                className={form.list === "my_dealers" ? "active" : "inactive"}
                onClick={() => showCustomList("my_dealers")}
              >
                {t("my_dealers")}
              </Button>
              <Link to="/records?list=my_dealers">
                <Button size="sm" outline className="inactive">
                  {t("vehicles_from_my_dealers")}
                </Button>
              </Link>
            </Col>
          </Row>
          {DealersCount === 0 && (
            <Alert color="secondary" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <Translate code="no_result" />
            </Alert>
          )}

          {DealersCount > 0 && (
            <Row className="dealer-list">
              <Col xs="12" sm="6" lg="8">
                <div className="h5 mb-3">
                  <b>{DealersCount}</b> {t("dealers")}
                </div>
              </Col>

              {dealers &&
                dealers.map((record, index) => (
                  <DealersElement key={index} dealer={record} />
                ))}
            </Row>
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

export default DealersListContainer;
