import { Auth } from "aws-amplify";
import { apiB2bPlateform } from "./config";

const config = {
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "us-east-1:cf4b5832-8146-4ebd-ac3c-1d4dea4261de",

    // REQUIRED - Amazon Cognito Region
    region: "us-east-1",

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: "us-east-1",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "eu-west-1_YYMUabLh6",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "o9vmmt4oco9kiju1nk0fqacf",

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    // // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //     domain: '.yourdomain.com',
    // // OPTIONAL - Cookie path
    //     path: '/',
    // // OPTIONAL - Cookie expiration in days
    //     expires: 365,
    // // OPTIONAL - Cookie secure flag
    // // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    //     secure: true
    // },

    // OPTIONAL - customized storage object
    //storage: new MyStorage(),

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    //authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  API: {
    endpoints: [
      {
        name: "b2bPlateform",
        region: "us-east-1",
        endpoint: apiB2bPlateform
        // custom_header: async () => {
        //     //return { Authorization : 'token' }
        //     // Alternatively, with Cognito User Pools use this:
        //     return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }}
      }
    ]
  }
};

export default config;
