import React from 'react';
import Skeleton from 'react-loading-skeleton';
import PredefinedFilters from '../PredefinedFilters';
import { createWithRedux, renderWithRedux } from '../../../../../utils/testUtils';
import { initialState } from '../../../../../store/initState';
import { useDispatch } from 'react-redux';
import { resourceActions } from '@oplog/resource-redux';
import { GridType, ResourceType } from '../../../../../models';
import { gridActions } from '@oplog/data-grid';

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
        dispatchManagementCounts: {
          ...initialState.resources.dispatchManagementCounts,
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Skeleton)[0]).toBeTruthy();
  });
  test('it calls getCounts action on mount', () => {
    renderWithRedux(<PredefinedFilters />);
    expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceRequested(ResourceType.DispatchManagementCounts));
  });
  test('it calls onWillUnmount action when unmounted', () => {
    const { unmount } = renderWithRedux(<PredefinedFilters />);
    unmount();
    expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceInit(ResourceType.DispatchManagementCounts));
    expect(mockDispatch).toHaveBeenCalledWith(gridActions.gridStateCleared(GridType.DispatchManagement));
  });
});
