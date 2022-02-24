export default class AuthClass {
  constructor(authInstanceProvider) {
    this.auth = authInstanceProvider;
  }

  async login(username, password, recaptchaToken) {
    await this.auth.login(
      username,
      password,
      "autobizTrade",
      true,
      recaptchaToken
    );
  }

  async refreshToken() {
    await this.auth.refreshToken(this.auth.tokenData()?.refreshToken);
  }

  async isLogged() {
    const tokenData = this.auth.tokenData();
    if (!tokenData) throw new Error("error ");
    if (!("refreshToken" in tokenData)) throw new Error("error ");
    if (!("accessToken" in tokenData))
      await this.auth.refreshToken(tokenData.refreshToken);
  }

  async logout() {
    if (this.auth.tokenData()?.accessToken)
      await this.auth.logout(this.auth.tokenData()?.accessToken);
    return true;
  }

  async request(method, endpoint, data, params, headers) {
    return await this.auth.request(method, endpoint, data, params, headers);
  }

  token() {
    return this.auth.tokenData()?.accessToken;
  }

  currentUser() {
    if (!this.token()) return {};
    return this.auth.currentUser(this.token());
  }

  currentUserApps(language) {
    if (!this.token()) return [];
    return this.auth.getUserApps(this.token(), language);
  }

  currentUserOtherApps(language) {
    const apps = this.currentUserApps(language);
    return apps.filter((app) => app.name !== "autobizTrade");
  }

  getTradeApp(language) {
    const apps = this.currentUserApps(language);
    return apps.find((app) => app.name === "autobizTrade");
  }

  tokenData() {
    return this.auth.tokenData();
  }

  userId() {
    return parseInt(this.currentUser().userId, 10);
  }

  fullName() {
    return `${this.currentUser().firstname || ""} ${
      this.currentUser().lastname || ""
    }`;
  }

  country() {
    return this.currentUser()?.country;
  }

  role() {
    return this.auth.tokenData()?.user.role;
  }

  roles() {
    return this.auth.tokenData()?.user.roles;
  }
}
