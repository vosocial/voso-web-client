// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  uploadImageHostname: "",
  jumioEndpointHostname: "",
  uploadVideoHostname: "",
  identityURL: "https://identity.deso.org",
  api: {
    UIPassthroughUri: 'https://vmbkv37t4l.execute-api.us-west-2.amazonaws.com/prod/',
    PubUIPassthroughUri: 'https://hpe3x5h1dk.execute-api.us-west-2.amazonaws.com/prod/'
  },
  authData: {
    AppWebDomain: 'bc-roadmap-web.auth.us-west-2.amazoncognito.com',
    TokenScopesArray: ['aws.cognito.signin.user.admin','email','openid','phone','profile'], // doesnt work
    RedirectUriSignIn: 'http://localhost:4200/voso-connect',
    RedirectUriSignOut: 'http://localhost:4200/signout',
    IdentityProvider: 'LoginWithAmazon',
    IdentityPoolId: 'us-west-2:8c3b8771-43a5-4431-94c4-14165f8f9402',
    UserPoolId: 'us-west-2_WyALRhOEh',
    AdvancedSecurityDataCollectionFlag: false,
    Region: 'us-west-2',
    UserPoolWebClientId: '4a4sleumr04v37idtarla9nl99'
  },
  system: {
    dbTableName: 'voice-collective-dev-DBTableB8F703DA-NLI82RUM2HOY'
  },
  dd: {
    apiKey: "",
    jsPath: "",
    ajaxListenerPath: "",
    endpoint: "",
  },
  node: {
    name: 'Ninja Node',
    url: 'https://node.bitcloutapps.ninja',
    api: 'https://node.bitcloutapps.ninja/api/v0/',
    logoAssetDir: '/assets/deso/',
    host: 'node.bitcloutapps.ninja',
    profile_pic_fallback: '/assets/img/default_profile_pic.png'
  },
  admin: {
    defaultReaderKey: 'BC1YLgQMDskGR7m7V3uRqh62wFCZsPgVWH5BFHijArSRLJyPCVo9AuR'
  },
  cdn: {
    endpoint: 'https://d3bgu04shib8ev.cloudfront.net/'
  }
};
