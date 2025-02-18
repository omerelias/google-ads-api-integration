import { SchedulerService } from '../scheduler.service';
import { GoogleAdsService } from '../googleAds.service';
import { Campaign, CampaignStatus, AdvertisingChannelType } from '../../types';

jest.mock('../googleAds.service');

describe('SchedulerService', () => {
  let schedulerService: SchedulerService;
  let mockGoogleAdsService: jest.Mocked<GoogleAdsService>;

  beforeEach(() => {
    mockGoogleAdsService = {
      getCampaigns: jest.fn(),
      createCampaign: jest.fn(),
    } as any;

    schedulerService = new SchedulerService(mockGoogleAdsService);
  });

  describe('processCampaigns', () => {
    it('should enable campaigns when scheduled time has passed', async () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 1000); // 1 second ago

      const mockCampaigns: Campaign[] = [
        {
          id: '123',
          name: 'Test Campaign',
          status: CampaignStatus.PAUSED,
          advertisingChannelType: AdvertisingChannelType.SEARCH,
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          scheduledTime: pastDate.toISOString(),
        },
      ];

      mockGoogleAdsService.getCampaigns.mockResolvedValue(mockCampaigns);
      mockGoogleAdsService.createCampaign.mockResolvedValue({
        ...mockCampaigns[0],
        status: CampaignStatus.ENABLED,
      });

      await schedulerService['processCampaigns'](mockCampaigns);

      expect(mockGoogleAdsService.createCampaign).toHaveBeenCalledWith({
        ...mockCampaigns[0],
        status: CampaignStatus.ENABLED,
      });
    });

    it('should not enable campaigns when scheduled time is in future', async () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 1000000); // Future date

      const mockCampaigns: Campaign[] = [
        {
          id: '123',
          name: 'Test Campaign',
          status: CampaignStatus.PAUSED,
          advertisingChannelType: AdvertisingChannelType.SEARCH,
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          scheduledTime: futureDate.toISOString(),
        },
      ];

      await schedulerService['processCampaigns'](mockCampaigns);

      expect(mockGoogleAdsService.createCampaign).not.toHaveBeenCalled();
    });
  });
});
