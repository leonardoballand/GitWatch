// test-utils.js
import {render} from '@testing-library/react-native';
import React, {ReactNode} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

const AllTheProviders = ({children}: {children: ReactNode}) => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
};

const customRender = (ui: any, options?: any) =>
  render(ui, {wrapper: AllTheProviders, ...options});

// re-export everything
export * from '@testing-library/react-native';

// override render method
export {customRender as render};
