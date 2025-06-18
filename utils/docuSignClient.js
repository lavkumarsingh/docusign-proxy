const docusign = require('docusign-esign');
require('dotenv').config();

const jwtAuth = async () => {
  // Validate required environment variables
  const requiredEnvVars = [
    'DOCUSIGN_BASE_PATH',
    'DOCUSIGN_INTEGRATION_KEY',
    'DOCUSIGN_USER_ID',
    'DOCUSIGN_PRIVATE_KEY',
  ];

  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH);
  dsApiClient.setOAuthBasePath('account-d.docusign.com');

  try {
    const results = await dsApiClient.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      process.env.DOCUSIGN_USER_ID,
      'account-d.docusign.com',
      Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY, 'base64'),
      ['signature'],
      3600
    );

    if (!results || !results.body || !results.body.access_token) {
      throw new Error('Failed to retrieve access token from DocuSign.');
    }

    const accessToken = results.body.access_token;

    let userInfo;
    try {
      userInfo = await dsApiClient.getUserInfo(accessToken);
    } catch (userInfoError) {
      throw new Error(`Failed to retrieve user info: ${userInfoError.message}`);
    }

    if (
      !userInfo ||
      !userInfo.accounts ||
      !userInfo.accounts.length ||
      !userInfo.accounts[0].accountId
    ) {
      throw new Error('Invalid user info or missing account ID.');
    }

    return {
      accessToken,
      accountId: userInfo.accounts[0].accountId,
      apiClient: dsApiClient,
    };
  } catch (err) {
    console.error('DocuSign JWT Authentication Error:', err.message);
    throw new Error(`DocuSign authentication failed: ${err.message}`);
  }
};

module.exports = jwtAuth;
