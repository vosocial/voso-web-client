import { IUser } from "@adonoustech/desoscript-core";
import { CognitoUser } from "@aws-amplify/auth";
import { ISponsorship } from "./i-sponsorship";

export abstract class FeedShell {
    // Auth
    abstract desoUser: IUser | undefined;
    abstract vosoUser: CognitoUser | undefined;

    // Misc
    abstract initializing: boolean | undefined;
    abstract working: boolean | undefined;

    constructor() {}
}
