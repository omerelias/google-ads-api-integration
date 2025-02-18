# Google Ads API Integration

A TypeScript-based integration with Google Ads API using Gaxios, with MongoDB for data persistence.

## Features

- OAuth 2.0 authentication
- Campaign management (create, read, update)
- Campaign statistics with filtering
- Automated campaign scheduling
- MongoDB integration for data persistence
- TypeScript support

## Data Models

### Campaign Schema

```typescript
// MongoDB Schema
const campaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CampaignStatus),
      required: true,
    },
    advertisingChannelType: {
      type: String,
      enum: Object.values(AdvertisingChannelType),
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    googleAdsCampaignId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
```

### User Schema

```typescript
// MongoDB Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    tokenExpiry: {
      type: Date,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
```

## API Functions

### Authentication

typescript
// Generate initial OAuth tokens
generateAuthUrl(): string
handleAuthCallback(code: string): Promise<User>
// Token management
refreshAccessToken(userId: string): Promise<string>
getValidAccessToken(userId: string): Promise<string>

### Campaign Management

typescript
// Create new campaign
createCampaign(userId: string, campaignData: Omit<Campaign, 'id'>): Promise<Campaign>
// Retrieve campaigns
getCampaigns(userId: string): Promise<Campaign[]>
getCampaignById(userId: string, campaignId: string): Promise<Campaign>
// Update campaign
updateCampaign(userId: string, campaignId: string, updates: Partial<Campaign>): Promise<Campaign>
// Delete campaign
deleteCampaign(userId: string, campaignId: string): Promise<void>
// Get campaign statistics
getCampaignStatistics(
userId: string,
campaignId: string,
startDate: string,
endDate: string
): Promise<CampaignStatistics>

### Scheduler

typescript
// Start campaign scheduler
startScheduler(): void
// Process campaigns for scheduling
processCampaigns(campaigns: Campaign[]): Promise<void>

## Authentication Flow

1. Generate auth URL using `generateAuthUrl()`
2. Redirect user to Google OAuth consent screen
3. Handle callback with `handleAuthCallback(code)`
4. Store user tokens in MongoDB
5. Use `getValidAccessToken()` for API requests (automatically refreshes if expired)

## Setup

1. Clone the repository:
   bash
   git clone https://github.com/omerelias/google-ads-api-integration.git
   cd google-ads-api-integration

2. Install dependencies:
   bash
   npm install

3. Create a `.env` file in the root directory:

env

Google Ads API Credentials
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id

MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

4. Build the project:
   bash
   npm run

5. Start the application:
   bash
   npm start

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

src/

├── models/ # MongoDB models

│ ├── campaign.ts

│ └── user.ts

├── services/ # Core services

│ ├── auth.service.ts # Authentication handling

│ ├── googleAds.service.ts # Google Ads API integration

│ └── scheduler.service.ts # Campaign scheduling

├── types/ # TypeScript type definitions

│ └── index.ts

└── index.ts # Application entry point

## Core Logic

1. **Authentication**

   - Generate OAuth URL for user authorization
   - Handle OAuth callback and token generation
   - Store tokens in MongoDB
   - Automatically refresh expired tokens

2. **Campaign Management**

   - Create campaigns with scheduling
   - Retrieve and filter campaigns
   - Update campaign status and details
   - Delete campaigns
   - Fetch campaign statistics

3. **Scheduling**

   - Runs every minute to check scheduled campaigns
   - Enables campaigns when their scheduled time arrives
   - Updates campaign status in both Google Ads and MongoDB

4. **Error Handling**
   - Token refresh on expiration
   - API rate limiting
   - Error logging and monitoring

## Testing

The project includes comprehensive tests for all core functionality:

- Authentication flow
- Campaign management
- Scheduling logic
- Error handling

Run tests with:
bash
npm test

## License

MIT

## Google Ads API Setup

1. **Create a Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Ads API for your project

2. **Configure OAuth Consent Screen**

   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the application name and user support email
   - Add authorized domains
   - Add scopes: `https://www.googleapis.com/auth/adwords`

3. **Create OAuth 2.0 Credentials**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs (e.g., `http://localhost:3000/auth/callback`)
   - Save your `Client ID` and `Client Secret`

4. **Get Google Ads Developer Token**

   - Go to [Google Ads Manager Account](https://ads.google.com/aw/overview)
   - Click the tools icon (⚙️) > "Setup" > "API Center"
   - Apply for a developer token
   - Once approved, copy your developer token

5. **Get Refresh Token**

   - Use the following URL format to get authorization code:

   ```
   https://accounts.google.com/o/oauth2/v2/auth?
   client_id=YOUR_CLIENT_ID&
   response_type=code&
   scope=https://www.googleapis.com/auth/adwords&
   redirect_uri=YOUR_REDIRECT_URI&
   access_type=offline&
   prompt=consent
   ```

   - Exchange the authorization code for refresh token using:

   ```bash
   curl -d "client_id=YOUR_CLIENT_ID" \
        -d "client_secret=YOUR_CLIENT_SECRET" \
        -d "code=AUTHORIZATION_CODE" \
        -d "grant_type=authorization_code" \
        -d "redirect_uri=YOUR_REDIRECT_URI" \
        https://oauth2.googleapis.com/token
   ```

6. **Get Customer ID**
   - Log in to your Google Ads account
   - Click the tools icon (⚙️)
   - Your customer ID is displayed in the top right (format: XXX-XXX-XXXX)

### Testing the API

1. **Test Environment Setup**

   ```bash
   # Create a test .env file
   cp .env.example .env

   # Fill in your credentials
   GOOGLE_ADS_CLIENT_ID=your_client_id
   GOOGLE_ADS_CLIENT_SECRET=your_client_secret
   GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
   GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
   GOOGLE_ADS_CUSTOMER_ID=your_customer_id
   ```

2. **Quick API Test**

   ```bash
   # Start the development server
   npm run dev

   # In another terminal, test the API
   curl http://localhost:3000/api/campaigns
   ```

3. **Using Google Ads API Test Account**
   - You can request a test account from Google Ads
   - This allows testing without affecting real campaigns
   - Apply for test account access in the Google Ads API Center

### Common Issues

1. **Authentication Errors**

   - Verify OAuth consent screen configuration
   - Check if refresh token is valid
   - Ensure correct scopes are enabled

2. **API Access Errors**

   - Confirm developer token is approved
   - Check if API is enabled in Google Cloud Console
   - Verify customer ID format

3. **Rate Limiting**
   - Default quota is 15,000 operations per day
   - Monitor usage in Google Cloud Console
   - Request quota increase if needed
