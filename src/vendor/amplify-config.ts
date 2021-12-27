import { environment } from '../environments/environment';

// See https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
export const Auth = {
    identityPoolId: environment.authData.IdentityPoolId,
    region: environment.authData.Region,
    identityPoolRegion: environment.authData.Region,
    userPoolId: environment.authData.UserPoolId,
    userPoolWebClientId: environment.authData.UserPoolWebClientId,
    oauth: {
        domain: environment.authData.AppWebDomain,
        scope: environment.authData.TokenScopesArray,
        redirectSignIn: environment.authData.RedirectUriSignIn,
        redirectSignOut: environment.authData.RedirectUriSignOut,
        responseType: 'code'
    }
};