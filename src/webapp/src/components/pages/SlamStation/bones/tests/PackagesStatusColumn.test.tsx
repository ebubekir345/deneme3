import React from 'react';
import { SortDirection } from 'dynamic-query-builder-client';
import { fireEvent, screen } from '@testing-library/react';
import { PackagesStatusColumn } from '../PackagesStatusColumn';
import { renderWithRedux, setupIntersectionObserverMock } from '../../../../../utils/testUtils';
import { initialSlamStationState } from '../../../../../store/global/slamStationStore';
import { ReadyToShipStatusFilter, WaitingStatusFilter } from '../../../../../typings/globalStore/enums';
import { initialState } from '../../../../../store/initState';
import { resourceActions } from '@oplog/resource-redux';
import { ResourceType } from '../../../../../models';

let mockSlamStationState: ISlamStationStore;
let mockSlamStationActions: any;
jest.mock('../../../../../store/global/slamStationStore', () => {
  return jest.fn(() => [mockSlamStationState, mockSlamStationActions]);
});
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
}));let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as object),
  useDispatch: jest.fn(() => mockDispatch),
}));

describe('PackagesStatusColumn', () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    mockSlamStationState = {
      ...initialSlamStationState,
      activeTab: 1,
      readyToShipCategoryFilter: ReadyToShipStatusFilter.Total,
      waitingCategoryFilter: WaitingStatusFilter.Total,
      waitingSort: {
        key: 'salesOrderCreatedAt',
        direction: SortDirection.ASC,
      },
      readyToShipSort: {
        key: 'salesOrderCreatedAt',
        direction: SortDirection.ASC,
      },
      readyToShipPackages: [],
      waitingPackages: [],
    };
    mockSlamStationActions = {
      setActiveTab: jest.fn(),
      setWaitingPackages: jest.fn(),
      setReadyToShipPackages: jest.fn(),
    };
  });

  it('hides count when resource isBusy', () => {
    renderWithRedux(<PackagesStatusColumn />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getWaitingForSLAMCargoPackagesCount: {
          ...initialState.resources.getWaitingForSLAMCargoPackagesCount,
          isBusy: true,
        },
      },
    });
    expect(screen.queryByTestId('tab-count')).toBeNull();
  });

  it('receives and display count info correctly', () => {
    renderWithRedux(<PackagesStatusColumn />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getReadyToShipCargoPackagesCount: {
          ...initialState.resources.getReadyToShipCargoPackagesCount,
          data: { total: 25 },
        },
      },
    });
    expect(screen.getAllByTestId('tab-count')[0].textContent).toBe('25');
  });

  it('calls setActiveTab on tab click', () => {
    renderWithRedux(<PackagesStatusColumn />);
    fireEvent.click(screen.getAllByTestId('tab-button')[0]);
    expect(mockSlamStationActions.setActiveTab).toHaveBeenCalledWith(0);
  });

  it('executes side effects on filter or sort changing', () => {
    mockSlamStationState.waitingCategoryFilter = WaitingStatusFilter.InProcess;
    mockSlamStationState.readyToShipCategoryFilter = ReadyToShipStatusFilter.ShipmentFailure;
    mockSlamStationState.waitingSort = {
      key: 'status',
      direction: SortDirection.DESC,
    };
    mockSlamStationState.readyToShipSort = {
      key: 'status',
      direction: SortDirection.ASC,
    };
    renderWithRedux(<PackagesStatusColumn />);

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetWaitingForSLAMCargoPackagesCount)
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetReadyToShipCargoPackagesCount)
    );
  });
});
