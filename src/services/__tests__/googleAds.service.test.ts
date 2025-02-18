import { GoogleAdsService } from '../googleAds.service';
import { AuthService } from '../auth.service';
import { Campaign, CampaignStatus, AdvertisingChannelType } from '../../types';
import { request } from 'gaxios';

jest.mock('../auth.service');
jest.mock('gaxios');

describe('GoogleAdsService', () => {
  let googleAdsService: GoogleAdsService;
  const mockConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    developerToken: 'test-developer-token',
    refreshToken: 'test-refresh-token',
    customerId: 'test-customer-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    googleAdsService = new GoogleAdsService(mockConfig);
  });

  describe('getCampaigns', () => {
    it('should fetch and transform campaigns', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              campaign: {
                id: '123',
                name: 'Test Campaign',
                status: CampaignStatus.ENABLED,
                advertisingChannelType: AdvertisingChannelType.SEARCH,
                startDate: '2023-01-01',
                endDate: '2023-12-31',
              },
            },
          ],
        },
      };

      jest.spyOn(googleAdsService as any, 'getHeaders').mockResolvedValue({
        Authorization: 'Bearer test-token',
        'developer-token': mockConfig.developerToken,
      });

      (request as jest.Mock).mockResolvedValue(mockResponse);

      const campaigns = await googleAdsService.getCampaigns();
      expect(campaigns).toHaveLength(1);
      expect(campaigns[0].id).toBe('123');
      expect(campaigns[0].status).toBe(CampaignStatus.ENABLED);
    });
  });
});
