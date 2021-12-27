import { User } from "../../backend-api.service";
import { IUser } from "@adonoustech/desoscript-core";

export class LoggedInUserObservableResult {
  public loggedInUser: IUser;

  // Does this user have the same pubkey as the previous user?
  public isSameUserAsBefore: boolean;
}
