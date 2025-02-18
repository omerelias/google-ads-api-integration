import { GaxiosPromise } from 'gaxios';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import { GoogleAdsConfig } from '../types';

export class AuthService {
  private oauth2Client: OAuth2Client;

  constructor(config: GoogleAdsConfig) {
    this.oauth2Client = new OAuth2Client({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });
    this.oauth2Client.setCredentials({
      refresh_token: config.refreshToken,
    });
  }

  async getAccessToken(): Promise<string> {
    const { token } = await this.oauth2Client.getAccessToken();
    return token || '';
  }

  async refreshAccessToken(): Promise<void> {
    await this.oauth2Client.refreshAccessToken();
  }
}
