export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  advertisingChannelType: AdvertisingChannelType;
  startDate: string;
  endDate: string;
  scheduledTime?: string; // When to run the campaign
}

export enum CampaignStatus {
  ENABLED = "ENABLED",
  PAUSED = "PAUSED",
  REMOVED = "REMOVED",
}

export enum AdvertisingChannelType {
  SEARCH = "SEARCH",
  DISPLAY = "DISPLAY",
  VIDEO = "VIDEO",
  SHOPPING = "SHOPPING",
}

export interface CampaignStatistics {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  conversions: number;
  costMicros: number;
  date: string;
}

export interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  developerToken: string;
  refreshToken: string;
  customerId: string;
}
