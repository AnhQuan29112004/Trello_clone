import * as Keychain from 'react-native-keychain';


export const saveTokens = async (accessToken: string, refreshToken: string) => {
    try {
        await Keychain.setGenericPassword('accessToken', accessToken, {
          service: 'com.trello.accessToken',
        });
        await Keychain.setGenericPassword('refreshToken', refreshToken, {
          service: 'com.trello.refreshToken',
        });
        console.log('Tokens stored successfully');
      } catch (error) {
        console.error('Error storing tokens:', error);
      }
};


export const getAccessToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({service: 'com.trello.accessToken'});
  return credentials ? credentials.password : null;
};

export const getRefreshToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({service: 'com.trello.refreshToken'});
  return credentials ? credentials.password : null;
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword({service: 'com.trello.accessToken'});
  await Keychain.resetGenericPassword({service: 'com.trello.refreshToken'});
};
