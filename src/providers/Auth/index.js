import AutobizAuth from "autobiz-auth";
import AuthClass from "./Auth";
import { apiB2bPlateform, domain } from "../../config";

const isDevLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const authInstance = new AutobizAuth(
  apiB2bPlateform,
  isDevLocalhost ? "localhost" : domain
);
export const Auth = new AuthClass(authInstance);
