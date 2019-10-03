import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
//import isLogged from './isLogged';
import { Spinner } from "reactstrap";
import { Auth } from "aws-amplify";

export default function AuthRequiredRoute(props) {
  const { path, component } = props;
  const [logged, setLogged] = useState(null);
  Auth.currentAuthenticatedUser()
    .then(user => {
      setLogged(true);
    })
    .catch(() => setLogged(false));
  Auth.currentUserCredentials().then(credentials => {
    //console.log(credentials);
  });
  if (logged === null) return <Spinner color="primary" />;
  if (logged) return <Route path={path} component={component} />;
  return <Redirect to="/login"></Redirect>;
}
