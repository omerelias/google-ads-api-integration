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

### Setting up Google Ads API with Test Account

1. **Access Google Ads API Developer's Console**

   - Go to [Google Ads API Developer's Console](https://developers.google.com/google-ads/api/docs/first-call/overview)
   - Click "Get Started"
   - Sign in with your Google account (no need to create a campaign)

2. **Request Test Account Access**

   - Go to [OAuth Credentials page](https://console.cloud.google.com/apis/credentials)
   - Create a new project if needed
   - Enable Google Ads API
   - Create OAuth 2.0 Client ID
   - Download the client configuration file
   - Request a test manager account from [Test Accounts page](https://developers.google.com/google-ads/api/docs/first-call/test-accounts)

   - You'll receive a test account with:
     - Pre-approved developer token
     - Test customer ID
     - Sample campaigns and data

3. **Get Your Credentials**

   - Developer token (provided with test account)
   - Test account Customer ID
   - OAuth2 credentials from your client configuration
   - No need to create real campaigns or spend money

4. **Test Account Limitations**

   - Test accounts are limited to specific API operations
   - No real ads will be served
   - Perfect for development and testing
   - Test accounts don't expire
   - Comes with pre-populated test data

5. **Using the Test Environment**

   - All API calls will be directed to the test environment
   - No risk of affecting real campaigns or spending money
   - Test data is regularly reset
   - Use test account endpoints for all API calls
   - Sample data includes campaigns, ad groups, and ads

6. **Development Workflow**

   - Use test account credentials in your `.env` file
   - Test account format will be: XXX-XXX-XXXX
   - Use provided test OAuth credentials
   - Develop and test your features
   - All API calls will use test data
   - No risk of accidental ad spending

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
