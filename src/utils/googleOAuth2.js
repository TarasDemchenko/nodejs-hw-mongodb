import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';

const googleOAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
});

export const generateOAuthURL = () =>
  googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  try {
    const responce = await googleOAuth2Client.getToken(code);

    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: responce.tokens.id_token,
    });

    return ticket;
  } catch (error) {
    if (
      error.responce &&
      error.responce.status >= 400 &&
      error.responce <= 499
    ) {
      throw createHttpError(401, 'Unathorized');
    }
    throw error;
  }
};
