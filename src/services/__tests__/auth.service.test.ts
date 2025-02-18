import { AuthService } from '../auth.service';
import { GoogleAdsConfig } from '../../types';
import { OAuth2Client } from 'google-auth-library';

// Create a mock class that extends OAuth2Client
class MockOAuth2Client {
  setCredentials = jest.fn();
  getAccessToken = jest.fn();
}

const mockOAuth2Client = new MockOAuth2Client();

// Mock the entire module
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(() => mockOAuth2Client),
}));

describe('AuthService', () => {
  let authService: AuthService;
  const mockConfig: GoogleAdsConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    developerToken: 'test-developer-token',
    refreshToken: 'test-refresh-token',
    customerId: 'test-customer-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // No need to recreate mockOAuth2Client or reset implementation
    authService = new AuthService(mockConfig);
  });

  describe('getAccessToken', () => {
    it('should return access token', async () => {
      const mockToken = 'mock-access-token';
      mockOAuth2Client.getAccessToken.mockResolvedValue({
        token: mockToken,
        res: undefined,
      });

      const result = await authService.getAccessToken();
      expect(result).toBe(mockToken);
      expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith({
        refresh_token: mockConfig.refreshToken,
      });
    });

    it('should return empty string if no token', async () => {
      mockOAuth2Client.getAccessToken.mockResolvedValue({
        token: undefined,
        res: undefined,
      });

      const result = await authService.getAccessToken();
      expect(result).toBe('');
      expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith({
        refresh_token: mockConfig.refreshToken,
      });
    });
  });
});
