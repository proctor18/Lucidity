// Authorization that could be used for google
// Needed to add this to make my google functions to play nice (to work)

import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '<396349567792-u9qucg3uo3nv7icjpofven0us66mla9t.apps.googleusercontent.com>',
    iosClientId: '<396349567792-6d0gr81tobjkt9eo377jv6p1n0oc01k9.apps.googleusercontent.com>',
    androidClientId: '<396349567792-05su8olhheurq96qspv0vu4dubkqo03b.apps.googleusercontent.com>',
    webClientId: '396349567792-gfg556v4e4jb22qa29nhsf3kltp6tan0.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  return { accessToken, promptAsync };
};