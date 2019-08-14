import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faFilter
} from "@fortawesome/free-solid-svg-icons";
import FilterSearch from "./FilterSearch";
import FilterConstructors from "./FilterConstructors";
import FilterModels from "./FilterModels";
import FilterYears from "./FilterYears";
import FilterKilometers from "./FilterKilometers";
import FilterCheckboxes from "./FilterCheckboxes";
import Sort from "./Sort.js";

import RecordsElement from "./RecordsElement";

import FilterTag from "./FilterTag";
import Section from "./Section";
import FormActions from "./FormActions";

import {
  useQueryParams,
  NumberParam,
  StringParam,
  DelimitedArrayParam
} from "use-query-params";

const RecordsListContainer = () => {
  const offers = [
    {
      id: "private",
      name: "Offres à particulier"
    },
    {
      id: "stock",
      name: "Véhicules en stock"
    }
  ];

  const sortList = [
    {
      id: "price_asc",
      name: "Tri : Prix croissants"
    },
    {
      id: "price_desc",
      name: "Tri : Prix décroissants"
    },
    {
      id: "age_desc",
      name: "Tri : Plus anciens"
    },
    {
      id: "age_asc",
      name: "Tri : Plus récents"
    },
    {
      id: "km_desc",
      name: "Tri : Plus kilométrés"
    },
    {
      id: "km_asc",
      name: "Tri : Moins kilométrés"
    }
  ];

  const initialFormState = {
    search: "",
    constructor: "",
    model: "",
    yearMecMin: "",
    yearMecMax: "",
    kmMin: "",
    kmMax: "",
    offersTypes: ["all"],
    pointOfSales: ["all"],
    sort: "age_asc",
    limit: 20,
    page: 1
  };

  const [query, setQuery] = useQueryParams({
    search: StringParam,
    constructor: NumberParam,
    model: NumberParam,
    yearMecMin: NumberParam,
    yearMecMax: NumberParam,
    kmMin: NumberParam,
    kmMax: NumberParam,
    offersTypes: DelimitedArrayParam,
    pointOfSales: DelimitedArrayParam,
    sort: StringParam,
    limit: NumberParam,
    page: NumberParam
  });

  const [form, setValues] = useState({
    search: query.search || initialFormState.search,
    constructor: query.constructor || initialFormState.constructor,
    model: query.model || initialFormState.model,
    yearMecMin: query.yearMecMin || initialFormState.yearMecMin,
    yearMecMax: query.yearMecMax || initialFormState.yearMecMax,
    kmMin: query.kmMin || initialFormState.kmMin,
    kmMax: query.kmMax || initialFormState.kmMax,
    offersTypes: query.offersTypes || initialFormState.offersTypes,
    pointOfSales: query.pointOfSales || initialFormState.pointOfSales,
    sort: query.sort || initialFormState.sort,
    limit: query.limit || initialFormState.limit,
    page: query.page || initialFormState.page
  });

  const [records, setRecords] = useState([]);
  const [RecordsTotalCount, setRecordsTotalCount] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [pointOfSales, setPointOfSales] = useState([]);
  const [models, setModels] = useState([]);
  const [menuMobileOpen, setMmenuMobileOpen] = useState(false);

  const updateField = e => {
    const { name, value } = e.target;

    setValues({
      ...form,
      [name]: value
    });
  };

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

    setValues({
      ...form,
      [target]: tmpTarget
    });
  };

  const removeFilter = target => {
    form[target] = "";
    handleSubmit();
  };

  const handleSubmit = () => {
    setMmenuMobileOpen(false);
    setQuery(form);
  };

  const handleReset = () => {
    handleSubmit();
    setValues(initialFormState);
    setQuery(initialFormState);
  };

  const handleSort = e => {
    const { value } = e.target;
    form.sort = value;
    setQuery(form);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await axios(`http://localhost:4000/recordsList`, {
        params: query
      });
      setRecords(result.data.records);
      setRecordsTotalCount(result.data.recordsTotalCount);
      setPointOfSales(result.data.pointOfSales);
    };
    fetchRecords();
  }, [query]);

  useEffect(() => {
    const fetchConstructors = async () => {
      const result = await axios(`http://localhost:4000/marques/`);
      setConstructors(result.data);
    };
    fetchConstructors();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (form.constructor === "") {
        setModels([]);
      } else {
        const result = await axios(
          `http://localhost:4000/marques/${form.constructor}`
        );
        setModels(result.data.models);
      }
    };
    fetchModels();
  }, [form.constructor]);

  function getConstructorName(id) {
    const filteredConstructors = constructors.filter(function(constructor) {
      return constructor.id === id;
    });
    if (filteredConstructors.length > 0) {
      return filteredConstructors[0].name;
    }
  }

  function getModelName(id) {
    if (models.length > 0) {
      const filteredModels = models.filter(function(model) {
        return model.id === id;
      });
      if (filteredModels.length > 0) {
        return filteredModels[0].name;
      }
    }
  }
  return (
    <Container>
      <Row>
        <div className="search-record-nav">
          <Section>
            <Row>
              <Col className="col col-6" sm="8" md="12">
                <FilterSearch value={form.search} onChange={updateField} />
              </Col>
              <Col className="col d-md-none">
                <button
                  type="button"
                  className="btn btn-block btn-danger-reverse rounded"
                  onClick={() =>
                    setMmenuMobileOpen(menuMobileOpen ? false : true)
                  }
                >
                  Filtrer <FontAwesomeIcon icon={faFilter} />
                </button>
              </Col>
            </Row>
          </Section>
          <div
            className={`${menuMobileOpen === false ? "d-none" : ""} d-md-block`}
          >
            <Section>
              <p className="section-title">Marque et modèle</p>
              <FilterConstructors
                constructors={constructors}
                value={form.constructor}
                updateField={updateField}
              />

              <FilterModels
                models={models}
                value={form.model}
                updateField={updateField}
              />

              <p className="section-title">Année MEC</p>
              <FilterYears
                yearMecMin={form.yearMecMin}
                yearMecMax={form.yearMecMax}
                updateField={updateField}
              />

              <p className="section-title">KM</p>
              <FilterKilometers
                kmMin={form.kmMin}
                kmMax={form.kmMax}
                updateField={updateField}
              />

              <p className="section-title">Lieu de stockage</p>
              <FilterCheckboxes
                data={pointOfSales}
                target="pointOfSales"
                values={form.pointOfSales}
                updateField={updateCheckBox}
                all
              />

              <p className="section-title">Types d'offres</p>
              <FilterCheckboxes
                data={offers}
                target="offersTypes"
                values={form.offersTypes}
                updateField={updateCheckBox}
                all
              />
            </Section>
            <Section>
              <FormActions reset={handleReset} submit={handleSubmit} />
            </Section>
          </div>
        </div>
        <Col>
          <Row>
            <Col className="tag-list">
              <FilterTag
                label="Recherche"
                value={query.search}
                target="search"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Marque"
                value={getConstructorName(query.constructor)}
                target="constructor"
                removeFilter={removeFilter}
              />

              <FilterTag
                label="Modèle"
                value={getModelName(query.model)}
                target="model"
                removeFilter={removeFilter}
              />

              <FilterTag
                label="Km min"
                value={query.kmMin}
                target="kmMin"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Km max"
                value={query.kmMax}
                target="kmMax"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Année MEC min"
                value={query.yearMecMin}
                target="yearMecMin"
                removeFilter={removeFilter}
              />
              <FilterTag
                label="Année MEC max"
                value={query.yearMecMax}
                target="yearMecMax"
                removeFilter={removeFilter}
              />
            </Col>
          </Row>
          {RecordsTotalCount === 0 && (
            <Alert color="secondary" className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Pas de résultats
            </Alert>
          )}

          {RecordsTotalCount > 0 && (
            <Row className="car-list">
              <Col xs="12" sm="6" lg="8">
                <div className="h5 mb-3">
                  <b>{RecordsTotalCount}</b> véhicules
                </div>
              </Col>
              <Col xs="12" sm="6" lg="4">
                <Sort
                  list={sortList}
                  value={form.sort}
                  updateField={handleSort}
                />
              </Col>
              {records.map((record, index) => (
                <RecordsElement key={index} record={record} />
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RecordsListContainer;
