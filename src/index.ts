import { GoogleAdsService } from './services/googleAds.service';
import { SchedulerService } from './services/scheduler.service';
import { GoogleAdsConfig } from './types';

const config: GoogleAdsConfig = {
  clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
};

const googleAdsService = new GoogleAdsService(config);
const schedulerService = new SchedulerService(googleAdsService);

// Start the scheduler
schedulerService.startScheduler();
