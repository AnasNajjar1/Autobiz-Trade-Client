export default class ApiClass {
  auth;
  tokenExpired;

  constructor(authApi) {
    this.auth = authApi;
    this.tokenExpired = sessionStorage.getItem("tokenExpired") || 0;
  }

  async request(method, endpoint, params = {}, data = {}, headers = {}) {
    try {
      return await this.auth.request(method, endpoint, data, params, headers);
    } catch (error) {
      if (error.response?.status === 403) {
        this.setTokenExpired();
        await this.auth.refreshToken();
        if (this.tokenExpired <= 1) window.location.reload();
      }

      throw Error(error.response ? error.response?.data?.message : error);
    }
  }

  setTokenExpired() {
    sessionStorage.setItem("tokenExpired", this.tokenExpired + 1);
  }
}
