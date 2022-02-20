import React from 'react';
import {render} from 'test-utils';
import AppHeader from './index';

import '@testing-library/jest-native/extend-expect';

describe('components/AppHeader', () => {
  test('render component', () => {
    const {getByTestId} = render(
      <AppHeader title="H1 Title" description="Description" />,
    );

    const AppHeaderContainer = getByTestId('AppHeader');
    const AppHeaderNavigation = getByTestId('AppHeader-navigation');
    const AppHeaderTitle = getByTestId('AppHeader-title');
    const AppHeaderDescription = getByTestId('AppHeader-description');

    expect(AppHeaderContainer).toBeTruthy();
    expect(AppHeaderTitle).toBeTruthy();
    expect(AppHeaderDescription).toBeTruthy();
    expect(AppHeaderNavigation).toBeTruthy();
  });

  describe('render title', () => {
    test('h1', () => {
      const {getByTestId} = render(<AppHeader title="H1 Title" />);

      const AppHeaderTitle = getByTestId('AppHeader-title');
      expect(AppHeaderTitle).toHaveTextContent('H1 Title');
      expect(AppHeaderTitle).toHaveStyle({
        fontSize: 36,
        fontWeight: '800',
      });
    });

    test('h2', () => {
      const {getByTestId} = render(<AppHeader level={2} title="H2 Title" />);

      const AppHeaderTitle = getByTestId('AppHeader-title');
      expect(AppHeaderTitle).toHaveTextContent('H2 Title');
    });
  });

  // test('render AppHeader and press left action', () => {
  //   const onPressLeftAction = jest.fn();

  //   const {getByTestId} = render(
  //     <AppHeader leftAction="close" title="H1 Title" />,
  //   );

  //   const AppHeaderLeftAction = getByTestId('AppHeaderLeftAction');
  //   fireEvent.press(AppHeaderLeftAction);

  //   expect(onPressLeftAction).toHaveBeenCalled();
  // });
});
