const docusign = require('docusign-esign');
require('dotenv').config();

const jwtAuth = async () => {
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH);
  dsApiClient.setOAuthBasePath('account-d.docusign.com');

  const results = await dsApiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY,
    process.env.DOCUSIGN_USER_ID,
    'account-d.docusign.com',
    Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY, 'base64'),
    ['signature'],
    3600
  );

  const accessToken = results.body.access_token;
  const userInfo = await dsApiClient.getUserInfo(accessToken);

  return {
    accessToken,
    accountId: userInfo.accounts[0].accountId,
    apiClient: dsApiClient,
  };
};

module.exports = jwtAuth;
