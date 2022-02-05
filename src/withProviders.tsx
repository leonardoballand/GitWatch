import React, {ElementType, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

import environment from 'graphql/environment';
import UserDataProvider from './hooks/useUserData';

const linking = {
  prefixes: ['gitwatch://'],
  config: {
    screens: {
      Login: 'oauth/:code?',
    },
  },
};

const withProviders = (Component: ElementType) => {
  return function WrappedComponent(props: any) {
    const [loadingApp, setLoadingApp] = useState(true);

    return (
      <>
        <IconRegistry icons={EvaIconsPack} />

        <ApplicationProvider {...eva} theme={eva.light}>
          <UserDataProvider
            restoreOnMount
            sessionName="user_data"
            onError={error => console.warn(error)}
            onLoadEnd={() => setLoadingApp(false)}>
            <RelayEnvironmentProvider environment={environment}>
              <NavigationContainer linking={linking}>
                <SafeAreaProvider>
                  <Component {...props} loading={loadingApp} />
                </SafeAreaProvider>
              </NavigationContainer>
            </RelayEnvironmentProvider>
          </UserDataProvider>
        </ApplicationProvider>
      </>
    );
  };
};

export default withProviders;
