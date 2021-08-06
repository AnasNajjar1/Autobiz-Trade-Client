import React, { Component } from "react";
import "./assets/scss/app.scss";
import "./assets/scss/report.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { dictionnary, languageList } from "./language-context";
import LoginView from "./views/LoginView.js";
import RecordsView from "./views/RecordsView.js";
import RecordsListView from "./views/RecordsListView.js";
import ListsListView from "./views/ListsListView.js";
import DealersView from "./views/DealersView.js";
import ReportsView from "./views/ReportsView.js";
import DealersListView from "./views/DealersListView.js";
import { QueryParamProvider } from "use-query-params";
import moment from "moment";
import Amplify from "aws-amplify";
import awsconfig from "./aws-config";
import AuthRequiredRoute from "./components/Login/AuthRequiredRoute";
import _ from "lodash";
import Cookies from "js-cookie";
import TagManager from "react-gtm-module";
import { tagManagerArgs, didomiConfig, zendeskConfig } from "./config";
import RegisterView from "./views/RegisterView";
import { DidomiSDK } from "@didomi/react";
import Zendesk from "react-zendesk";
import { TranslateProvider, TranslateInstance } from "autobiz-translate";

Amplify.configure(awsconfig);
TagManager.initialize(tagManagerArgs);

class App extends Component {
  constructor() {
    super();

    this.state = {
      language: null,
      stage: process.env.REACT_APP_ENV === "prod" ? "prod" : "dev",
    };
    this.entryPath = {
      pathname: "/records",
    };

    this.didomiObject = {};
  }

  resetPathName = () => {
    const splitPathName = window.location.pathname.split("/");
    const splitPathLang = splitPathName[1];
    if (!splitPathName.includes("login"))
      this.entryPath = {
        pathname: languageList.includes(splitPathLang)
          ? splitPathName.slice(2).join("/")
          : window.location.pathname,
      };
    if (languageList.includes(splitPathLang))
      Cookies.set("appLanguage", splitPathLang, {
        expires: 365,
      });
  };

  changeLanguage = async (lang) => {
    let language = process.env.REACT_APP_LANG;
    if (Cookies.get("appLanguage")) {
      language = Cookies.get("appLanguage");
    } else {
      let res = _.split(window.navigator.language, "-", 1);
      if (dictionnary.hasOwnProperty(res[0])) language = res[0];
      Cookies.set("appLanguage", language, { expires: 365 });
    }
    ["/login", "/register"].map((path) =>
      window.location.pathname === path
        ? window.location.replace(`${language}${path}`)
        : ""
    );

    if (lang) language = lang;
    moment.locale(language);
    localStorage.removeItem("translation");
    const translation = await TranslateInstance.init(
      "trade-app",
      language,
      this.state.stage
    );
    if (!translation)
      TranslateInstance.appendCustomDictionary(dictionnary[language]);
    this.setState({ language });
  };

  handleChangeLanguage = async (event) => {
    if (event.detail.language) {
      await this.changeLanguage(event.detail.language);
    }
  };

  componentWillMount() {
    this.resetPathName();
    this.changeLanguage();
    window.addEventListener("changeLanguage", this.handleChangeLanguage);
    window.addEventListener("storage", this.handleRefresh);
  }

  handleRefresh = async (e) => {
    if (e.key === "b2b-plateform") {
      this.changeLanguage(Cookies.get("appLanguage"));
      return;
    }
  };

  onDidomiReady(didomi) {
    this.didomiObject = didomi;
  }

  render() {
    const { language, stage } = this.state;
    return (
      <>
        {language && (
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
                  <AuthRequiredRoute
                    path="/records"
                    component={RecordsListView}
                  />
                  <AuthRequiredRoute
                    path="/dealers/:refId"
                    component={DealersView}
                  />
                  <AuthRequiredRoute
                    path="/dealers"
                    component={DealersListView}
                  />
                  <AuthRequiredRoute path="/lists" component={ListsListView} />
                  <Route
                    exact
                    path="/login"
                    render={(props) => (
                      <LoginView
                        {...props}
                        entryPath={this.entryPath}
                        didomi={this.didomiObject}
                      />
                    )}
                  />
                  <Route exact path="/register" component={RegisterView} />
                  <Redirect from="/" exact to="/records" />
                </Switch>
              </QueryParamProvider>
            </TranslateProvider>
          </BrowserRouter>
        )}
        <DidomiSDK
          apiKey={didomiConfig.apiKey}
          noticeId={didomiConfig.noticeId}
          config={didomiConfig.config}
          onReady={this.onDidomiReady.bind(this)}
        />
        <Zendesk zendeskKey={zendeskConfig.apiKey} />
      </>
    );
  }
}

export default App;
