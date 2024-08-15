import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Analytics } from '../Analytics';
import { createWithRedux, intl, renderWithRedux } from '../../../../../utils/testUtils';
import { initialState } from '../../../../../store/initState';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));
let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as object),
  useDispatch: jest.fn(() => mockDispatch),
}));

describe('Analytics', () => {
  test('it shows skeleton loading if getAnalyticsResponse is busy', () => {
    const component = createWithRedux(<Analytics />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getPickingManagementAnalytics: {
          ...initialState.resources.getPickingManagementAnalytics,
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Skeleton)[0]).toBeTruthy();
  });
  test('it calls onWillUnmount action when unmounted', () => {
    const { unmount } = renderWithRedux(<Analytics />);
    unmount();
    expect(mockDispatch).toBeCalled();
  });
});
