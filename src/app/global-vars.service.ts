import { Injectable } from "@angular/core";
import {
  BackendApiService,
  TransactionFee
} from "./backend-api.service";

import { IBalanceEntryResponse, 
         IPostEntryResponse,
         IUser,
         TutorialStatus } from "@adonoustech/desoscript-core";
import { ActivatedRoute, Router } from "@angular/router";
import { RouteNames } from "./app-routing.module";
import { Observable, Observer } from "rxjs";
import { LoggedInUserObservableResult } from "./shared/observable-results/logged-in-user-observable-result";
import { FollowChangeObservableResult } from "./shared/observable-results/follow-change-observable-result";
import { environment } from "../environments/environment";
import { AmplitudeClient } from "amplitude-js";
import { DomSanitizer } from "@angular/platform-browser";
import { IdentityService } from "./identity.service";
import { HttpClient } from "@angular/common/http";
import Timer = NodeJS.Timer;



@Injectable({
  providedIn: "root",
})
export class GlobalVarsService {
  // Note: I don't think we should have default values for this. I think we should just
  // loading spinner until we get a correct value. That said, I'm not going to fix that
  // right now, I'm just moving this magic number into a constant.
  static DEFAULT_NANOS_PER_USD_EXCHANGE_RATE = 1e9;
  static NANOS_PER_UNIT = 1e9;
  static WEI_PER_ETH = 1e18;

  constructor(
    private backendApi: BackendApiService,
    private sanitizer: DomSanitizer,
    private identityService: IdentityService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  static MAX_POST_LENGTH = 560;

  static FOUNDER_REWARD_BASIS_POINTS_WARNING_THRESHOLD = 50 * 100;

  static CREATOR_COIN_RESERVE_RATIO = 0.3333333;
  static CREATOR_COIN_TRADE_FEED_BASIS_POINTS = 1;

  // This is set to false immediately after our first attempt to get a loggedInUser.
  loadingInitialAppState = true;

  // We're waiting for the user to grant storage access (full-screen takeover)
  requestingStorageAccess = false;

  // Track if the user is dragging the diamond selector. If so, need to disable text selection in the app.
  userIsDragging = false;

  RouteNames = RouteNames;

  pausePolling = false; // TODO: Monkey patch for when polling conflicts with other calls.
  pauseMessageUpdates = false; // TODO: Monkey patch for when message polling conflicts with other calls.

  desoToUSDExchangeRateToDisplay = "Fetching...";

  // We keep information regarding the messages tab in global vars for smooth
  // transitions to and from messages.
  messageNotificationCount = 0;
  messagesSortAlgorithm = "time";
  messagesPerFetch = 25;
  openSettingsTray = false;
  newMessagesFromPage = 0;
  messagesRequestsHoldersOnly = true;
  messagesRequestsHoldingsOnly = false;
  messagesRequestsFollowersOnly = false;
  messagesRequestsFollowedOnly = false;

  // Whether or not to show processing spinners in the UI for unmined transactions.
  showProcessingSpinners = false;

  // We track logged-in state
  loggedInUser: IUser;
  userList: IUser[] = [];

  // Temporarily track tutorial status here until backend it flowing
  TutorialStatus: TutorialStatus;

  // map[pubkey]->bool of globomods
  globoMods: any;
  feeRateDeSoPerKB = 1000 / 1e9;
  postsToShow = [];
  followFeedPosts = [];
  messageResponse = null;
  messageMeta = {
    // <public_key || tstamp> -> messageObj
    decryptedMessgesMap: {},
    // <public_key> -> numMessagesRead
    notificationMap: {},
  };
  // Search and filter params
  filterType = "";
  // The coin balance and user profiles of the coins the the user
  // hodls and the users who hodl him.
  youHodlMap: { [k: string]: IBalanceEntryResponse } = {};

  // Map of diamond level to deso nanos.
  diamondLevelMap = {};

  // TODO(performance): We used to call the functions called by this function every
  // second. Now we call them only when needed, but the future is to get rid of this
  // and make everything use sockets.
  updateEverything: any;

  emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  latestBitcoinAPIResponse: any;

  // Whether the left bar (hamburger) menu for mobile is currently open
  isLeftBarMobileOpen = false;

  loggedInUserObservable: Observable<LoggedInUserObservableResult>;
  loggedInUserObservers = [] as Observer<LoggedInUserObservableResult>[];

  followChangeObservable: Observable<FollowChangeObservableResult>;
  followChangeObservers = [] as Observer<FollowChangeObservableResult>[];

  nodeInfo: any;
  // The API node we connect to
  localNode: string = null;
  // Whether or not the node is running on the testnet or mainnet.
  isTestnet = false;

  // Whether or not to show the Verify phone number flow.
  showPhoneNumberVerification = false;

  // Whether or not to show the Buy DeSo with USD flow.
  showBuyWithUSD = false;

  // Buy DESO with ETH
  showBuyWithETH = false;

  // Whether or not to show the Jumio verification flow.
  showJumio = false;

  // Whether or not this node comps profile creation.
  isCompProfileCreation = false;

  // Current fee to create a profile.
  createProfileFeeNanos: number;

  // Support email for this node (renders Help in the left bar nav)
  supportEmail: string = null;

  // ETH exchange rates
  usdPerETHExchangeRate: number;
  nanosPerETHExchangeRate: number;

  // BTC exchange rates
  satoshisPerDeSoExchangeRate: number;
  usdPerBitcoinExchangeRate: number;

  // USD exchange rates
  nanosPerUSDExchangeRate: number;

  defaultFeeRateNanosPerKB: number;

  NanosSold: number;
  ProtocolUSDCentsPerBitcoinExchangeRate: number;

  nanosToDeSoMemo = {};
  formatUSDMemo = {};

  confetti: any;
  canvasCount = 0;
  minSatoshisBurnedForProfileCreation: number;

  amplitude: AmplitudeClient;

  // Price of DeSo values
  ExchangeUSDCentsPerDeSo: number;
  USDCentsPerDeSoReservePrice: number;
  BuyDeSoFeeBasisPoints: number = 0;

  // Timestamp of last profile update
  profileUpdateTimestamp: number;

  jumioDeSoNanos = 0;

  referralUSDCents: number = 0;

  transactionFeeMap: { [k: string]: TransactionFee[] };

  SetupMessages() {
    // If there's no loggedInUser, we set the notification count to zero
    if (!this.loggedInUser) {
      this.messageNotificationCount = 0;
      return;
    }

    // If a message response already exists, we skip this step
    if (this.messageResponse) {
      return;
    }

    let storedTab = this.backendApi.GetStorage("mostRecentMessagesTab");
    if (storedTab === null) {
      storedTab = "My Holders";
      this.backendApi.SetStorage("mostRecentMessagesTab", storedTab);
    }

    // Set the filters most recently used and load the messages
    this.SetMessagesFilter(storedTab);
    this.LoadInitialMessages();
  }

  SetMessagesFilter(tabName: any) {
    // Set the request parameters if it's a known tab.
    // Custom is set in the filter menu component and saved in local storage.
    if (tabName !== "Custom") {
      this.messagesRequestsHoldersOnly = tabName === "My Holders";
      this.messagesRequestsHoldingsOnly = false;
      this.messagesRequestsFollowersOnly = false;
      this.messagesRequestsFollowedOnly = false;
      this.messagesSortAlgorithm = "time";
    } else {
      this.messagesRequestsHoldersOnly = this.backendApi.GetStorage("customMessagesRequestsHoldersOnly");
      this.messagesRequestsHoldingsOnly = this.backendApi.GetStorage("customMessagesRequestsHoldingsOnly");
      this.messagesRequestsFollowersOnly = this.backendApi.GetStorage("customMessagesRequestsFollowersOnly");
      this.messagesRequestsFollowedOnly = this.backendApi.GetStorage("customMessagesRequestsFollowedOnly");
      this.messagesSortAlgorithm = this.backendApi.GetStorage("customMessagesSortAlgorithm");
    }
  }

  LoadInitialMessages() {
    if (!this.loggedInUser) {
      return;
    }

    this.backendApi
      .GetMessages(
        this.localNode,
        this.loggedInUser.PublicKeyBase58Check,
        "",
        this.messagesPerFetch,
        this.messagesRequestsHoldersOnly,
        this.messagesRequestsHoldingsOnly,
        this.messagesRequestsFollowersOnly,
        this.messagesRequestsFollowedOnly,
        this.messagesSortAlgorithm
      )
      .subscribe(
        (res) => {
          if (this.pauseMessageUpdates) {
            // We pause message updates when a user sends a messages so that we can
            // wait for it to be sent before updating the thread.  If we do not do this the
            // temporary message place holder would disappear until "GetMessages()" finds it.
          } else {
            this.messageResponse = res;

            // Update the number of new messages so we know when to stop scrolling
            this.newMessagesFromPage = res.OrderedContactsWithMessages.length;
          }
        },
        (err) => {
          console.error(this.backendApi.stringifyError(err));
        }
      );
  }

  _notifyLoggedInUserObservers(newLoggedInUser: IUser, isSameUserAsBefore: boolean) {
    this.loggedInUserObservers.forEach((observer) => {
      const result = new LoggedInUserObservableResult();
      result.loggedInUser = newLoggedInUser;
      result.isSameUserAsBefore = isSameUserAsBefore;
      observer.next(result);
    });
  }

  userInTutorial(user: IUser): boolean {
    return (
      user && [TutorialStatus.COMPLETE, TutorialStatus.EMPTY, TutorialStatus.SKIPPED].indexOf(user?.TutorialStatus) < 0
    );
  }

  // NEVER change loggedInUser property directly. Use this method instead.
  setLoggedInUser(user: IUser) {
    const isSameUserAsBefore =
      this.loggedInUser && user && this.loggedInUser.PublicKeyBase58Check === user.PublicKeyBase58Check;

    this.loggedInUser = user;

    // Fetch referralLinks for the userList before completing the load.
    this.backendApi.GetReferralInfoForUser(this.localNode, this.loggedInUser.PublicKeyBase58Check).subscribe(
      (res: any) => {
        this.loggedInUser.ReferralInfoResponses = res.ReferralInfoResponses;
      },
      (err: any) => {
        console.log(err);
      }
    );

    // If Jumio callback hasn't returned yet, we need to poll to update the user metadata.
    if (user && user?.JumioFinishedTime > 0 && !user?.JumioReturned) {
      this.pollLoggedInUserForJumio(user.PublicKeyBase58Check);
    }

    if (!isSameUserAsBefore) {
      // Store the user in localStorage
      this.backendApi.SetStorage(this.backendApi.LastLoggedInUserKey, user?.PublicKeyBase58Check);

      // Identify the user in amplitude
      this.amplitude?.setUserId(user?.PublicKeyBase58Check);

      // Clear out the message inbox and BitcoinAPI
      this.messageResponse = null;
      this.latestBitcoinAPIResponse = null;

      // Fix the youHodl / hodlYou maps.
      for (const entry of this.loggedInUser?.UsersYouHODL || []) {
        this.youHodlMap[entry.CreatorPublicKeyBase58Check] = entry;
      }
      this.followFeedPosts = [];
    }

    this._notifyLoggedInUserObservers(user, isSameUserAsBefore);
  }

  getLinkForReferralHash(referralHash: string) {
    // FIXME: Generalize this once there are referral programs running
    // on other nodes.
    return `https://diamondapp.com?r=${referralHash}`;
  }

  hasUserBlockedCreator(publicKeyBase58Check): boolean {
    return this.loggedInUser?.BlockedPubKeys && publicKeyBase58Check in this.loggedInUser?.BlockedPubKeys;
  }

  showAdminTools(): boolean {
    return this.loggedInUser?.IsAdmin || this.loggedInUser?.IsSuperAdmin;
  }

  showSuperAdminTools(): boolean {
    return this.loggedInUser?.IsSuperAdmin;
  }

  networkName(): string {
    return this.isTestnet ? "testnet" : "mainnet";
  }

  getUSDForDiamond(index: number): string {
    const desoNanos = this.diamondLevelMap[index];
    const val = this.nanosToUSDNumber(desoNanos);
    if (val < 1) {
      return this.formatUSD(Math.max(val, 0.01), 2);
    }
    return this.abbreviateNumber(val, 0, true);
  }

  nanosToDeSo(nanos: number, maximumFractionDigits?: number): string {
    if (this.nanosToDeSoMemo[nanos] && this.nanosToDeSoMemo[nanos][maximumFractionDigits]) {
      return this.nanosToDeSoMemo[nanos][maximumFractionDigits];
    }

    this.nanosToDeSoMemo[nanos] = this.nanosToDeSoMemo[nanos] || {};

    if (!maximumFractionDigits && nanos > 0) {
      // maximumFractionDigits defaults to 3.
      // Set it higher only if we have very small amounts.
      maximumFractionDigits = Math.floor(10 - Math.log10(nanos));
    }

    // Always show at least 2 digits
    if (maximumFractionDigits < 2) {
      maximumFractionDigits = 2;
    }

    // Never show more than 9 digits
    if (maximumFractionDigits > 9) {
      maximumFractionDigits = 9;
    }

    // Always show at least 2 digits
    const minimumFractionDigits = 2;
    const num = nanos / 1e9;
    this.nanosToDeSoMemo[nanos][maximumFractionDigits] = Number(num).toLocaleString("en-US", {
      style: "decimal",
      currency: "USD",
      minimumFractionDigits,
      maximumFractionDigits,
    });
    return this.nanosToDeSoMemo[nanos][maximumFractionDigits];
  }

  formatUSD(num: number, decimal: number): string {
    if (this.formatUSDMemo[num] && this.formatUSDMemo[num][decimal]) {
      return this.formatUSDMemo[num][decimal];
    }

    this.formatUSDMemo[num] = this.formatUSDMemo[num] || {};

    this.formatUSDMemo[num][decimal] = Number(num).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });
    return this.formatUSDMemo[num][decimal];
  }

  /*
   * Converts long numbers to convenient abbreviations
   * Examples:
   *   value: 12345, decimals: 1 => 12.3K
   *   value: 3492311, decimals: 2 => 3.49M
   * */
  abbreviateNumber(value: number, decimals: number, formatUSD: boolean = false): string {
    let shortValue;
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor((("" + value.toFixed(0)).length - 1) / 3);
    if (suffixNum === 0) {
      // if the number is less than 1000, we should only show at most 2 decimals places
      decimals = Math.min(2, decimals);
    }
    shortValue = (value / Math.pow(1000, suffixNum)).toFixed(decimals);
    if (formatUSD) {
      shortValue = this.formatUSD(shortValue, decimals);
    }
    return shortValue + suffixes[suffixNum];
  }

  nanosToUSDNumber(nanos: number): number {
    return nanos / this.nanosPerUSDExchangeRate;
  }

  usdToNanosNumber(usdAmount: number): number {
    return usdAmount * this.nanosPerUSDExchangeRate;
  }

  nanosToUSD(nanos: number, decimal?: number): string {
    if (decimal == null) {
      decimal = 4;
    }
    return this.formatUSD(this.nanosToUSDNumber(nanos), decimal);
  }

  isMobile(): boolean {
    // from https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    return viewportWidth <= 992;
  }

  // Calculates the amount of deso one would receive if they sold an amount equal to creatorCoinAmountNano
  // given the current state of a creator's coin as defined by the coinEntry
  desoNanosYouWouldGetIfYouSold(creatorCoinAmountNano: number, coinEntry: any): number {
    // These calculations are derived from the Bancor pricing formula, which
    // is proportional to a polynomial price curve (and equivalent to Uniswap
    // under certain assumptions). For more information, see the comment on
    // CreatorCoinSlope in constants.go and check out the Mathematica notebook
    // linked in that comment.
    //
    // This is the formula:
    // - B0 * (1 - (1 - dS / S0)^(1/RR))
    // - where:
    //     dS = bigDeltaCreatorCoin,
    //     B0 = bigCurrentDeSoLocked
    //     S0 = bigCurrentCreatorCoinSupply
    //     RR = params.CreatorCoinReserveRatio
    const desoLockedNanos = coinEntry.DeSoLockedNanos;
    const currentCreatorCoinSupply = coinEntry.CoinsInCirculationNanos;
    // const deltaDeSo = creatorCoinAmountNano;
    const desoBeforeFeesNanos =
      desoLockedNanos *
      (1 -
        Math.pow(
          1 - creatorCoinAmountNano / currentCreatorCoinSupply,
          1 / GlobalVarsService.CREATOR_COIN_RESERVE_RATIO
        ));

    return (desoBeforeFeesNanos * (100 * 100 - GlobalVarsService.CREATOR_COIN_TRADE_FEED_BASIS_POINTS)) / (100 * 100);
  }

  // Return a formatted version of the amount one would receive in USD if they sold creatorCoinAmountNano number of Creator Coins
  // given the current state of a creator's coin as defined by the coinEntry
  usdYouWouldGetIfYouSoldDisplay(creatorCoinAmountNano: number, coinEntry: any, abbreviate: boolean = true): string {
    if (creatorCoinAmountNano == 0) return "$0";
    const usdValue = this.nanosToUSDNumber(this.desoNanosYouWouldGetIfYouSold(creatorCoinAmountNano, coinEntry));
    return abbreviate ? this.abbreviateNumber(usdValue, 2, true) : this.formatUSD(usdValue, 2);
  }

  creatorCoinNanosToUSDNaive(creatorCoinNanos, coinPriceDeSoNanos, abbreviate: boolean = false): string {
    const usdValue = this.nanosToUSDNumber((creatorCoinNanos / 1e9) * coinPriceDeSoNanos);
    return abbreviate ? this.abbreviateNumber(usdValue, 2, true) : this.formatUSD(usdValue, 2);
  }

  createProfileFeeInDeSo(): number {
    return this.createProfileFeeNanos / 1e9;
  }

  createProfileFeeInUsd(): string {
    return this.nanosToUSD(this.createProfileFeeNanos, 2);
  }

  convertTstampToDaysOrHours(tstampNanos: number) {
    // get total seconds between the times
    let delta = Math.abs(tstampNanos / 1000000 - new Date().getTime()) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.ceil(delta / 60) % 60;

    return `${days ? days + "d " : ""} ${!days && hours ? hours + "h" : ""} ${
      !days && !hours && minutes ? minutes + "m" : ""
    }`;
  }

  convertTstampToDateOrTime(tstampNanos: number) {
    const date = new Date(tstampNanos / 1e6);
    const currentDate = new Date();
    if (
      date.getDate() != currentDate.getDate() ||
      date.getMonth() != currentDate.getMonth() ||
      date.getFullYear() != currentDate.getFullYear()
    ) {
      return date.toLocaleString("default", { month: "short", day: "numeric" });
    }

    return date.toLocaleString("default", { hour: "numeric", minute: "numeric" });
  }

  convertTstampToDateTime(tstampNanos: number) {
    const date = new Date(tstampNanos / 1e6);
    const currentDate = new Date();
    if (
      date.getDate() != currentDate.getDate() ||
      date.getMonth() != currentDate.getMonth() ||
      date.getFullYear() != currentDate.getFullYear()
    ) {
      return date.toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
    }

    return date.toLocaleString("default", { hour: "numeric", minute: "numeric" });
  }

  doesLoggedInUserHaveProfile() {
    if (!this.loggedInUser) {
      return false;
    }

    const hasProfile =
      this.loggedInUser.ProfileEntryResponse && this.loggedInUser.ProfileEntryResponse.Username.length > 0;

    return hasProfile;
  }

  _copyText(val: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }

  truncate(ss: string, len?: number): string {
    let ll = len;
    if (!ll) {
      ll = 18;
    }
    if (!ss || ss.length <= ll) {
      return ss;
    }
    return ss.slice(0, ll) + "...";
  }

  _parseFloat(val: any) {
    return parseFloat(val) ? parseFloat(val) : 0;
  }

  scrollTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  showLandingPage() {
    return this.userList && this.userList.length === 0;
  }

  _globopoll(passedFunc: any, expirationSecs?: any) {
    const startTime = new Date();
    const interval = setInterval(() => {
      if (passedFunc()) {
        clearInterval(interval);
      }
      if (expirationSecs && new Date().getTime() - startTime.getTime() > expirationSecs * 1000) {
        return true;
      }
    }, 1000);
  }

  _setUpLoggedInUserObservable() {
    this.loggedInUserObservable = new Observable((observer) => {
      this.loggedInUserObservers.push(observer);
    });
  }

  _setUpFollowChangeObservable() {
    this.followChangeObservable = new Observable((observer) => {
      this.followChangeObservers.push(observer);
    });
  }

  // Does some basic checks on a public key.
  isMaybePublicKey(pk: string) {
    // Test net public keys start with 'tBC', regular public keys start with 'BC'.
    return (pk.startsWith("tBC") && pk.length == 54) || (pk.startsWith("BC") && pk.length == 55);
  }

  isVanillaRepost(post: IPostEntryResponse): boolean {
    return !post.Body && !post.ImageURLs?.length && !!post.RepostedPostEntryResponse;
  }

  getPostContentHashHex(post: IPostEntryResponse): string {
    return this.isVanillaRepost(post) ? post.RepostedPostEntryResponse.PostHashHex : post.PostHashHex;
  }

  incrementCommentCount(post: IPostEntryResponse): IPostEntryResponse {
    if (this.isVanillaRepost(post)) {
      post.RepostedPostEntryResponse.CommentCount += 1;
    } else {
      post.CommentCount += 1;
    }
    return post;
  }

  // Log an event to amplitude
  //
  // Please follow the event format:
  //    singular object : present tense verb : extra context
  //
  // For example:
  //    bitpop : buy
  //    account : create : step1
  //    profile : update
  //    profile : update : error
  //
  // Use the data object to store extra event metadata. Don't use
  // the metadata to differentiate two events with the same name.
  // Instead, just create two (or more) events with better names.
  logEvent(event: string, data?: any) {
    if (!this.amplitude) {
      return;
    }
    // If the user is in the tutorial, add the "tutorial : " prefix.
    if (this.userInTutorial(this.loggedInUser)) {
      event = "tutorial : " + event;
    }
    this.amplitude.logEvent(event, data);
  }

  // Helper to launch the get free deso flow in identity.
  launchGetFreeDESOFlow() {
    this.logEvent("identity : jumio : launch");
    this.identityService
      .launch("/get-free-deso", {
        public_key: this.loggedInUser?.PublicKeyBase58Check,
        referralCode: localStorage.getItem("referralCode"),
      })
      .subscribe(() => {
        this.logEvent("identity : jumio : success");
        this.updateEverything();
      });
  }

  launchIdentityFlow(event: string): void {
    this.logEvent(`account : ${event} : launch`);
    this.identityService.launch("/log-in", { referralCode: localStorage.getItem("referralCode") }).subscribe((res) => {
      this.logEvent(`account : ${event} : success`);
      this.backendApi.setIdentityServiceUsers(res.users, res.publicKeyAdded);
      this.updateEverything().add(() => {
        this.flowRedirect(res.signedUp); // executes after identity connected
      });
    });
  }

  launchLoginFlow() {
    this.launchIdentityFlow("login");
  }

  launchSignupFlow() {
    this.launchIdentityFlow("create");
  }

  flowRedirect(signedUp: boolean): void {
    if (signedUp) {
      // If this node supports phone number verification, go to step 3, else proceed to step 4.
      const stepNum = this.showPhoneNumberVerification ? 3 : 4;
      this.router.navigate(["/" + this.RouteNames.SIGN_UP], {
        queryParams: { stepNum },
      });
    } else {
      this.router.navigate(["/" + this.RouteNames.VOSO_CONNECT]);
    }
  }

  Init(loggedInUser: IUser, userList: IUser[], route: ActivatedRoute) {
    this._setUpLoggedInUserObservable();
    this._setUpFollowChangeObservable();

    route.queryParams.subscribe((queryParams) => {
      if (queryParams.r) {
        localStorage.setItem("referralCode", queryParams.r);
        this.router.navigate([], { queryParams: { r: undefined }, queryParamsHandling: "merge" });
        this.getReferralUSDCents();
      }
    });

    this.getReferralUSDCents();
    this.userList = userList;
    this.satoshisPerDeSoExchangeRate = 0;
    this.nanosPerUSDExchangeRate = GlobalVarsService.DEFAULT_NANOS_PER_USD_EXCHANGE_RATE;
    this.usdPerBitcoinExchangeRate = 10000;
    this.defaultFeeRateNanosPerKB = 1000.0;

    //this.localNode = this.backendApi.GetStorage(this.backendApi.LastLocalNodeKey);
    this.localNode = environment.node.host

    if (!this.localNode) {
      const hostname = (window as any).location.hostname;
      if (environment.production) {
        this.localNode = hostname;
      } else {
        this.localNode = `${hostname}:17001`;
      }

      this.backendApi.SetStorage(this.backendApi.LastLocalNodeKey, this.localNode);
    }

    let identityServiceURL = this.backendApi.GetStorage(this.backendApi.LastIdentityServiceKey);
    if (!identityServiceURL) {
      identityServiceURL = environment.identityURL;
      this.backendApi.SetStorage(this.backendApi.LastIdentityServiceKey, identityServiceURL);
    }
    this.identityService.identityServiceURL = identityServiceURL;
    this.identityService.sanitizedIdentityServiceURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${identityServiceURL}/embed?v=2`
    );

    this._globopoll(() => {
      if (!this.defaultFeeRateNanosPerKB) {
        return false;
      }
      this.feeRateDeSoPerKB = this.defaultFeeRateNanosPerKB / 1e9;
      return true;
    });
  }

  // Get the highest level parent component that has the app-theme styling.
  getTargetComponentSelector(): string {
    return GlobalVarsService.getTargetComponentSelectorFromRouter(this.router);
  }

  static getTargetComponentSelectorFromRouter(router: Router): string {
    if (router.url.startsWith("/" + RouteNames.BROWSE)) {
      return "browse-page";
    }
    if (router.url.startsWith("/" + RouteNames.LANDING)) {
      return "landing-page";
    }
    if (router.url.startsWith("/" + RouteNames.INBOX_PREFIX)) {
      return "messages-page";
    }
    return "app-page";
  }

  _updateDeSoExchangeRate() {
    this.backendApi.GetExchangeRate(this.localNode).subscribe(
      (res: any) => {
        // BTC
        this.satoshisPerDeSoExchangeRate = res.SatoshisPerDeSoExchangeRate;
        this.ProtocolUSDCentsPerBitcoinExchangeRate = res.USDCentsPerBitcoinExchangeRate;
        this.usdPerBitcoinExchangeRate = res.USDCentsPerBitcoinExchangeRate / 100;

        // ETH
        this.usdPerETHExchangeRate = res.USDCentsPerETHExchangeRate / 100;
        this.nanosPerETHExchangeRate = res.NanosPerETHExchangeRate;

        // DESO
        this.NanosSold = res.NanosSold;
        this.ExchangeUSDCentsPerDeSo = res.USDCentsPerDeSoExchangeRate;
        this.USDCentsPerDeSoReservePrice = res.USDCentsPerDeSoReserveExchangeRate;
        this.BuyDeSoFeeBasisPoints = res.BuyDeSoFeeBasisPoints;

        const nanosPerUnit = GlobalVarsService.NANOS_PER_UNIT;
        this.nanosPerUSDExchangeRate = nanosPerUnit / (this.ExchangeUSDCentsPerDeSo / 100);
        this.desoToUSDExchangeRateToDisplay = this.nanosToUSD(nanosPerUnit, null);
        this.desoToUSDExchangeRateToDisplay = this.nanosToUSD(nanosPerUnit, 2);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  resentVerifyEmail = false;
  resendVerifyEmail() {
    this.backendApi.ResendVerifyEmail(this.localNode, this.loggedInUser.PublicKeyBase58Check).subscribe();
    this.resentVerifyEmail = true;
  }



  jumioInterval: Timer = null;
  // If we return from the Jumio flow, poll for up to 10 minutes to see if we need to update the user's balance.
  pollLoggedInUserForJumio(publicKey: string): void {
    if (this.jumioInterval) {
      clearInterval(this.jumioInterval);
    }
    let attempts = 0;
    let numTries = 120;
    let timeoutMillis = 5000;
    this.jumioInterval = setInterval(() => {
      if (attempts >= numTries) {
        clearInterval(this.jumioInterval);
        return;
      }
      this.backendApi
        .GetJumioStatusForPublicKey(environment.jumioEndpointHostname, publicKey)
        .subscribe(
          (res: any) => {
            if (res.JumioVerified) {
              let user: IUser;
              this.userList.forEach((userInList, idx) => {
                if (userInList.PublicKeyBase58Check === publicKey) {
                  this.userList[idx].JumioVerified = res.JumioVerified;
                  this.userList[idx].JumioReturned = res.JumioReturned;
                  this.userList[idx].JumioFinishedTime = res.JumioFinishedTime;
                  this.userList[idx].BalanceNanos = res.BalanceNanos;
                  this.userList[idx].MustCompleteTutorial = true;
                  user = this.userList[idx];
                }
              });
              if (user) {
                this.setLoggedInUser(user);
              }
              localStorage.setItem("referralCode", undefined);
              //this.celebrate();
              if (user.TutorialStatus === TutorialStatus.EMPTY) {
                //this.startTutorialAlert();
                console.log('tutorial prompt')
              }
              clearInterval(this.jumioInterval);
              return;
            }
            // If the user wasn't verified by jumio, but Jumio did return a callback, stop polling.
            if (res.JumioReturned) {
              clearInterval(this.jumioInterval);
            }
          },
          (error) => {
            clearInterval(this.jumioInterval);
          }
        )
        .add(() => attempts++);
    }, timeoutMillis);
  }

  getFreeDESOMessage(): string {
    return this.referralUSDCents
      ? this.formatUSD(this.referralUSDCents / 100, 0)
      : this.nanosToUSD(this.jumioDeSoNanos, 0);
  }

  getReferralUSDCents(): void {
    const referralHash = localStorage.getItem("referralCode");
    if (referralHash) {
      this.backendApi
        .GetReferralInfoForReferralHash(environment.jumioEndpointHostname, referralHash)
        .subscribe((res) => {
          const referralInfo = res.ReferralInfoResponse.Info;
          if (
            res.ReferralInfoResponse.IsActive &&
            (referralInfo.TotalReferrals < referralInfo.MaxReferrals || referralInfo.MaxReferrals == 0)
          ) {
            this.referralUSDCents = referralInfo.RefereeAmountUSDCents;
          }
        });
    }
  }
}
