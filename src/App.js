import React, { Component } from "react";
import "./assets/scss/app.scss";
import "./assets/scss/report.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { LanguageContext, dictionnary } from "./language-context";
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
import { withAuthenticator } from "aws-amplify-react";
import awsconfig from "./aws-config";
import AuthRequiredRoute from "./components/LoginForm/AuthRequiredRoute";
import _ from "lodash";
import Cookies from "js-cookie";
import getTranslations from "./translations/services/getTranslations";
import cacheStaticContent from "./translations/services/cacheStaticContent";
import TagManager from "react-gtm-module";
import { tagManagerArgs } from "./config";

Amplify.configure(awsconfig);
TagManager.initialize(tagManagerArgs);

class App extends Component {
  state = {
    language: dictionnary[process.env.REACT_APP_LANG],
  };

  constructor() {
    super();
    this.entryPath = {
      pathname: "/records",
    };
    if (window.location.pathname !== "/login") {
      this.entryPath = {
        pathname: window.location.pathname,
      };
    }
  }

  changeLanguage = async (language) => {
    if (dictionnary.hasOwnProperty(language)) {
      try {
        const languageDict = await getTranslations(language);
        moment.locale(language);
        this.setState({ language: languageDict }); //dictionnary[language]
      } catch (e) {
        console.log("missing trads", e.toString());
      }
      return;
    }
    console.log("language not found : ", language);
    return;
  };

  handleChangeLanguage = async (event) => {
    if (event.detail.language) {
      await this.changeLanguage(event.detail.language);
    }
  };

  componentWillMount() {
    let language = process.env.REACT_APP_LANG;

    if (Cookies.get("appLanguage")) {
      language = Cookies.get("appLanguage");
    } else {
      let res = _.split(window.navigator.language, "-", 1);
      if (dictionnary.hasOwnProperty(res[0])) {
        language = res[0];
        Cookies.set("appLanguage", language, { expires: 365 });
      } else {
        Cookies.set("appLanguage", process.env.REACT_APP_LANG, {
          expires: 365,
        });
      }
    }

    this.changeLanguage(language);

    window.addEventListener("changeLanguage", this.handleChangeLanguage);
    window.addEventListener("storage", this.handleRefresh);
    Object.keys(dictionnary).map((language) => cacheStaticContent(language));
  }

  handleRefresh = async (e) => {
    if (e.key === "b2b-plateform") {
      this.changeLanguage(Cookies.get("appLanguage"));
      return;
    }
  };

  render() {
    return (
      <BrowserRouter>
        <LanguageContext.Provider value={this.state.language}>
          <QueryParamProvider ReactRouterRoute={Route}>
            <Switch>
              <Route path="/reports/:lang/:refId" component={ReportsView} />
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
                path="/login"
                render={(props) => (
                  <LoginView {...props} entryPath={this.entryPath} />
                )}
              />
              <Redirect from="/" exact to="/records" />
            </Switch>
          </QueryParamProvider>
        </LanguageContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
