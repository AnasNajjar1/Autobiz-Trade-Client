import React from "react";
import "./assets/scss/app.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { LanguageContext } from "./language-context";
import LoginView from "./views/LoginView.js";
import RecordsView from "./views/RecordsView.js";
import RecordsListView from "./views/RecordsListView.js";
import { QueryParamProvider } from "use-query-params";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/de";
import getTranslations from "./services/getTranslations";
import Amplify, { Auth, API } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import awsconfig from "./aws-config";

moment.locale(process.env.REACT_APP_LANG);

Amplify.configure(awsconfig);

function App() {
  const translationJson = getTranslations(process.env.REACT_APP_LANG);

  return (
    <BrowserRouter>
      <LanguageContext.Provider value={translationJson}>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route path="/records/:refId" component={RecordsView} />

            <Route path="/records" component={RecordsListView} />
            <Route path="/login" component={LoginView} />
            <Redirect from="/" exact to="/records" />
          </Switch>
        </QueryParamProvider>
      </LanguageContext.Provider>
    </BrowserRouter>
  );
}

export default withAuthenticator(App, true);
