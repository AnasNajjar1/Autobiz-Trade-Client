import Cookies from "js-cookie";
import { domain } from "../../config";

export default async function clearAuthData() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (!["translation", "didomi_token"].includes(key))
        localStorage.removeItem(key);
    });
    Object.keys(sessionStorage).forEach((key) => {
      sessionStorage.removeItem(key);
    });
    Object.entries(Cookies.get()).forEach(([key]) => {
      if (!["appLanguage", "didomi_token"].includes(key)){
        document.cookie = `${key}=;domain=${domain};path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      }
    });
    return "success";
  } catch (e) {
    throw new Error("fail deleting data for logout !");
  }
}
