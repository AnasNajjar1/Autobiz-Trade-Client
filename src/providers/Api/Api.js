export default class ApiClass {
  auth;

  constructor(authApi) {
    this.auth = authApi;
  }

  async request(method, endpoint, params = {}, data = {}, headers = {}) {
    try {
      return await this.auth.request(method, endpoint, data, params, headers);
    } catch (error) {
      if (error.response?.status === 403) await this.auth.refreshToken();
      throw Error(error.response ? error.response?.data?.message : error);
    }
  }
}
