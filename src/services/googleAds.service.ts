import { GaxiosPromise } from "gaxios";
import { request } from "gaxios";
import { AuthService } from "./auth.service";
import { Campaign, CampaignStatistics, GoogleAdsConfig } from "../types";

export class GoogleAdsService {
  private baseUrl = "https://googleads.googleapis.com/v14";
  private authService: AuthService;
  private customerId: string;
  private developerToken: string;

  constructor(config: GoogleAdsConfig) {
    this.authService = new AuthService(config);
    this.customerId = config.customerId;
    this.developerToken = config.developerToken;
  }

  private async getHeaders() {
    const accessToken = await this.authService.getAccessToken();
    return {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": this.developerToken,
    };
  }

  async getCampaigns(): Promise<Campaign[]> {
    const query = `
      SELECT 
        campaign.id, 
        campaign.name, 
        campaign.status,
        campaign.advertising_channel_type,
        campaign.start_date,
        campaign.end_date
      FROM campaign
      WHERE campaign.status != 'REMOVED'
    `;

    const response = await request({
      url: `${this.baseUrl}/customers/${this.customerId}/googleAds:search`,
      method: "POST",
      headers: await this.getHeaders(),
      data: { query },
    });

    return this.transformCampaignResponse(response.data);
  }

  async getCampaignStatistics(
    campaignId: string,
    startDate: string,
    endDate: string
  ): Promise<CampaignStatistics[]> {
    const query = `
      SELECT 
        campaign.id, 
        campaign.name, 
        metrics.impressions, 
        metrics.clicks, 
        metrics.conversions, 
        metrics.cost_micros,
        segments.date
      FROM campaign
      WHERE campaign.id = '${campaignId}'
      AND segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    const response = await request({
      url: `${this.baseUrl}/customers/${this.customerId}/googleAds:search`,
      method: "POST",
      headers: await this.getHeaders(),
      data: { query },
    });

    return this.transformStatisticsResponse(response.data);
  }

  async createCampaign(campaign: Omit<Campaign, "id">): Promise<Campaign> {
    const response = await request({
      url: `${this.baseUrl}/customers/${this.customerId}/campaigns`,
      method: "POST",
      headers: await this.getHeaders(),
      data: this.transformCampaignRequest(campaign),
    });

    return this.transformCampaignResponse(response.data)[0];
  }

  private transformCampaignResponse(data: any): Campaign[] {
    // Transform the Google Ads API response to our Campaign type
    // Implementation details depend on the exact API response structure
    return data.results.map((result: any) => ({
      id: result.campaign.id,
      name: result.campaign.name,
      status: result.campaign.status,
      advertisingChannelType: result.campaign.advertisingChannelType,
      startDate: result.campaign.startDate,
      endDate: result.campaign.endDate,
      scheduledTime: result.campaign.scheduledTime,
    }));
  }

  private transformStatisticsResponse(data: any): CampaignStatistics[] {
    // Transform the Google Ads API response to our CampaignStatistics type
    return data.results.map((result: any) => ({
      campaignId: result.campaign.id,
      campaignName: result.campaign.name,
      impressions: Number(result.metrics.impressions),
      clicks: Number(result.metrics.clicks),
      conversions: Number(result.metrics.conversions),
      costMicros: Number(result.metrics.costMicros),
      date: result.segments.date,
    }));
  }

  private transformCampaignRequest(campaign: Omit<Campaign, "id">): any {
    // Transform our Campaign type to the Google Ads API request format
    return {
      name: campaign.name,
      status: campaign.status,
      advertisingChannelType: campaign.advertisingChannelType,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    };
  }
}
