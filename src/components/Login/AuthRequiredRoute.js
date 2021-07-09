import { faCarCrash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Spinner } from "reactstrap";
import { Auth } from "../../providers/Auth";

export default function AuthRequiredRoute(props) {
  const { path, component } = props;
  const [logged, setLogged] = useState(null);
  Auth.isLogged()
    .then(() => setLogged(true))
    .catch(() => setLogged(false));
  if (logged === null) return <Spinner color="primary" />;
  if (logged) return <Route path={path} component={component} />;
  return <Redirect to="/login"></Redirect>;
}
