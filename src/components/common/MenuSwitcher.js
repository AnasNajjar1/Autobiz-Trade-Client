import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "reactstrap";
import { t } from "../common/Translate";
const MenuSwitcher = (props) => {
  return (
    <div className="switcher">
      <ul>
        <li className={props.current === "dealers" ? "active" : ""}>
          <Link to="/dealers">{t("dealers")}</Link>
        </li>
        <li className={props.current === "records" ? "active" : ""}>
          <Link to="/records">{t("vehicles")}</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuSwitcher;
