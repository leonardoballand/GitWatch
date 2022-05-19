import React, {ElementType} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {RelayEnvironmentProvider} from 'react-relay/hooks';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import Toast from 'react-native-toast-message';

import environment from 'graphql/environment';

const linking = {
  prefixes: ['gitwatch://'],
  config: {
    screens: {
      Onboarding: 'oauth/:code?',
    },
  },
};

const withProviders = (Component: ElementType) => {
  return function WrappedComponent(props: any) {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />

        <ApplicationProvider {...eva} theme={eva.light}>
          <RelayEnvironmentProvider environment={environment}>
            <NavigationContainer linking={linking}>
              <SafeAreaProvider>
                <Component {...props} />
                <Toast />
              </SafeAreaProvider>
            </NavigationContainer>
          </RelayEnvironmentProvider>
        </ApplicationProvider>
      </>
    );
  };
};

export default withProviders;
