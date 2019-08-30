import React from "react";
import "./assets/scss/app.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LoginView from "./views/LoginView.js";
import RecordsView from "./views/RecordsView.js";
import RecordsListView from "./views/RecordsListView.js";
import { QueryParamProvider } from "use-query-params";
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import awsconfig from "./aws-config"

function App() {
  Auth.currentAuthenticatedUser().then(user => {
    console.log("currentAuthenticatedUser",user)
    Auth.federatedSignIn()
  });
  Auth.currentCredentials().then(creds => console.log("Current credentials",creds, "session token", creds.sessionToken));
  Auth.currentSession().then(session => console.log("token", `Bearer ${session.getAccessToken().getJwtToken()}`))


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

export default withAuthenticator(App, true);


Amplify.configure(awsconfig);
