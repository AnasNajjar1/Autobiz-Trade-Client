import clearAuthData from "../Auth/clearAuthData";

export default class ApiClass {
  auth;

  constructor(authApi) {
    this.auth = authApi;
  }

  async request(method, endpoint, params = {}, data = {}, headers = {}) {
    try {
      return await this.auth.request(method, endpoint, data, params, headers);
    } catch (error) {
      if (error.response?.status === 403) {
        try {
          await this.auth.refreshToken();
          return await this.auth.request(
            method,
            endpoint,
            data,
            params,
            headers
          );
        } catch {
          await clearAuthData();
          window.location.reload();
        }
      }

      throw Error(error.response ? error.response?.data?.message : error);
    }
  }
}
