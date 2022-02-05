export const config = {
  redirectUrl: 'gitwatch://oauth',
  clientId: '26a3032c3abbb494d07a',
  clientSecret: '553ea47ffa7aab2a138d75e5d81300d63218eec4',
  scopes: ['identity', 'repo', 'user', 'org'],
  additionalHeaders: {Accept: 'application/json'},
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint:
      'https://github.com/settings/connections/applications/26a3032c3abbb494d07a',
  },
};
