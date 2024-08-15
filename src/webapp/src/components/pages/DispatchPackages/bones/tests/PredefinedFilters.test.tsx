import { resourceActions } from '@oplog/resource-redux';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ResourceType } from '../../../../../models';
import { initialState } from '../../../../../store/initState';
import { createWithRedux, renderWithRedux } from '../../../../../utils/testUtils';
import PredefinedFilters from '../PredefinedFilters';

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

describe('PredefinedFilters', () => {
  test('it shows skeleton if countsResponse is busy', () => {
    const component = createWithRedux(<PredefinedFilters />, {
      resources: {
        ...initialState.resources,
        dispatchPackagesCounts: {
          ...initialState.resources.dispatchPackagesCounts,
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Skeleton)[0]).toBeTruthy();
  });
  test('it calls getCounts action on mount', () => {
    renderWithRedux(<PredefinedFilters />);
    expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceRequested(ResourceType.DispatchPackagesCounts));
  });
});
