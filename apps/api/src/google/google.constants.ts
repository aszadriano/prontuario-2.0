export const GOOGLE_OAUTH_CLIENT_FACTORY = 'GOOGLE_OAUTH_CLIENT_FACTORY';
export type GoogleOAuthClientFactory = () => import('google-auth-library').OAuth2Client;
