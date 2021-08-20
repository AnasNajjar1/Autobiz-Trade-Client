import React, { useState } from "react";
import "./assets/scss/app.scss";
import "./assets/scss/report.scss";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useParams,
} from "react-router-dom";
import {
  defineCorrectLanguage,
  handleChangeLang,
  defineEntryPath,
} from "./language-context";
import LoginView from "./views/LoginView.js";
import RecordsView from "./views/RecordsView.js";
import RecordsListView from "./views/RecordsListView.js";
import ListsListView from "./views/ListsListView.js";
import DealersView from "./views/DealersView.js";
import ReportsView from "./views/ReportsView.js";
import DealersListView from "./views/DealersListView.js";
import { QueryParamProvider } from "use-query-params";
import Amplify from "aws-amplify";
import awsconfig from "./aws-config";
import AuthRequiredRoute from "./components/Login/AuthRequiredRoute";
import _ from "lodash";
import TagManager from "react-gtm-module";
import { tagManagerArgs, didomiConfig, zendeskConfig } from "./config";
import RegisterView from "./views/RegisterView";
import { DidomiSDK } from "@didomi/react";
import Zendesk from "react-zendesk";
import { TranslateProvider } from "autobiz-translate";

Amplify.configure(awsconfig);
TagManager.initialize(tagManagerArgs);

const stage = process.env.REACT_APP_ENV === "prod" ? "prod" : "dev";

const App = ({ entryPath }) => {
  let { language: languageUrl } = useParams();
  const [didomiObject, setDidomiObject] = useState({});

  const language = defineCorrectLanguage(languageUrl);

  if (language !== languageUrl) handleChangeLang(language);

  const onDidomiReady = (didomi) => {
    setDidomiObject(didomi);
  };

  return (
    <>
      <BrowserRouter exact basename={`/${language}`}>
        <TranslateProvider
          projectName="trade-app"
          stage={stage}
          language={language}
        >
          <QueryParamProvider ReactRouterRoute={Route}>
            <Switch>
              <Route path="/reports/:refId" component={ReportsView} />
              <AuthRequiredRoute
                path="/records/:refId"
                component={RecordsView}
              />
              <AuthRequiredRoute path="/records" component={RecordsListView} />
              <AuthRequiredRoute
                path="/dealers/:refId"
                component={DealersView}
              />
              <AuthRequiredRoute path="/dealers" component={DealersListView} />
              <AuthRequiredRoute path="/lists" component={ListsListView} />
              <Route
                exact
                path="/login"
                render={(props) => (
                  <LoginView
                    {...props}
                    entryPath={entryPath}
                    didomi={didomiObject}
                  />
                )}
              />
              <Route exact path="/register" component={RegisterView} />
              <Redirect from="/" exact to="/records" />
            </Switch>
          </QueryParamProvider>
        </TranslateProvider>
      </BrowserRouter>
      <DidomiSDK
        apiKey={didomiConfig.apiKey}
        noticeId={didomiConfig.noticeId}
        config={didomiConfig.config}
        onReady={onDidomiReady}
      />
      <Zendesk zendeskKey={zendeskConfig.apiKey} />
    </>
  );
};

export default () => {
  const entryPath = {
    pathname: defineEntryPath(),
  };
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={["/:language", "/"]}
          component={() => <App entryPath={entryPath} />}
        />
      </Switch>
    </BrowserRouter>
  );
};
