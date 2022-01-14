import { IPost } from "@adonoustech/desoscript-core";

export interface ISponsorship {
    sponsorshipDate: number;
    desoUserName: string;
    desoPublicKey: string;
    sponsoredNFT: IPost
    affialitePercentage: number;
    affiliatePercentagePaid?: boolean;
    affiliatePercentagePaidDate?: number;
    sponsorshipAnnounced?: boolean;
    sponsorshipAnnouncedDate?: number;
    affiliatePaymentAnnounced?: boolean;
    affiliatePaymentAnnouncedDate?: number;
    NFTFinancialInformation?: any;
    dbIndex?: number;
    compoundIndex?: string;
}