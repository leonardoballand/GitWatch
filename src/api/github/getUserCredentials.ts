import {config} from 'utils/OAuthManager';

const getUserCredentials = async (code: string) => {
  try {
    // send post to get access token
    const res = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${config.clientId}&client_secret=${config.clientSecret}&code=${code}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (res.status === 200) {
      const credentials = await res.json();
      console.log('github credentials', credentials);
      return credentials;
    } else {
      return null;
    }
  } catch (err) {
    console.log('onCodeReceived error', err);
    throw err;
  }
};

export default getUserCredentials;
