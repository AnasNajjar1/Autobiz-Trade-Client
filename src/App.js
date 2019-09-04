import React from "react";
import "./assets/scss/app.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LoginView from "./views/LoginView.js";
import RecordsView from "./views/RecordsView.js";
import RecordsListView from "./views/RecordsListView.js";
import { QueryParamProvider } from "use-query-params";
import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

function App() {
  return (
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Switch>
          <Route path="/records/:refId" component={RecordsView} />

          <Route path="/records" component={RecordsListView} />
          <Route path="/login" component={LoginView} />
          <Redirect from="/" exact to="/login" />
        </Switch>
      </QueryParamProvider>
    </BrowserRouter>
  );
}

export default App;
