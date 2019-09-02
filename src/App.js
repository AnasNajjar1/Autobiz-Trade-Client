import React from "react";
import "./assets/scss/app.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LoginView from "./views/LoginView.js";
import RecordsView from "./views/RecordsView.js";
import RecordsListView from "./views/RecordsListView.js";
import { QueryParamProvider } from "use-query-params";
import Amplify, { Auth, API } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import awsconfig from "./aws-config";



Amplify.configure(awsconfig);

function App() {
  Auth.currentAuthenticatedUser().then(user => {
    console.log("currentAuthenticatedUser", user);
    //Auth.federatedSignIn()
  });
  Auth.currentCredentials().then(creds =>
    console.log(
      "Current credentials",
      creds,
      "session token",
      creds.sessionToken
    )
  );
  Auth.currentSession().then(session =>
    console.log("token", `Bearer ${session.getAccessToken().getJwtToken()}`)
  );

  try {
    API.get("b2bPlateform", `/filters`).then(result =>
      console.log("result call", result)
    );
  } catch (e) {
    console.log("error call api", e);
  }

  API.get("b2bPlateform", "/auction", {
    queryStringParameters: {
      id: "018d1b20-ca2b-11e9-940b-a333546ade96"
    }
  }).then(result => console.log("result call", result));

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

