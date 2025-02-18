import * as cron from 'node-cron';
import { GoogleAdsService } from './googleAds.service';
import { Campaign, CampaignStatus } from '../types';

export class SchedulerService {
  private googleAdsService: GoogleAdsService;

  constructor(googleAdsService: GoogleAdsService) {
    this.googleAdsService = googleAdsService;
  }

  startScheduler(): void {
    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        const campaigns = await this.googleAdsService.getCampaigns();
        await this.processCampaigns(campaigns);
      } catch (error) {
        console.error('Error processing scheduled campaigns:', error);
      }
    });
  }

  private async processCampaigns(campaigns: Campaign[]): Promise<void> {
    const now = new Date();

    for (const campaign of campaigns) {
      if (!campaign.scheduledTime) continue;

      const scheduledTime = new Date(campaign.scheduledTime);

      // If the scheduled time has passed and the campaign is not yet enabled
      if (scheduledTime <= now && campaign.status !== CampaignStatus.ENABLED) {
        try {
          await this.googleAdsService.createCampaign({
            ...campaign,
            status: CampaignStatus.ENABLED,
          });
        } catch (error) {
          console.error(`Error enabling campaign ${campaign.id}:`, error);
        }
      }
    }
  }
}
