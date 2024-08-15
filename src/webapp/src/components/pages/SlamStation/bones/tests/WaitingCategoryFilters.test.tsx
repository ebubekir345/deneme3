import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WaitingCategoryFilters } from '../WaitingCategoryFilters';
import { createWithRedux, renderWithRedux } from '../../../../../utils/testUtils';
import { initialSlamStationState } from '../../../../../store/global/slamStationStore';
import { WaitingStatusFilter } from '../../../../../typings/globalStore/enums';
import { initialState } from '../../../../../store/initState';

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
}));
let component;

describe('WaitingCategoryFilters', () => {
  beforeEach(() => {
    mockSlamStationState = {
      ...initialSlamStationState,
      readyToShipCategoryFilter: WaitingStatusFilter.Total,
    };
    mockSlamStationActions = { setWaitingCategoryFilter: jest.fn() };
  });

  it('displays skeletons on isBusy', () => {
    component = createWithRedux(<WaitingCategoryFilters />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getWaitingForSLAMCargoPackagesCount: {
          ...initialState.resources.getWaitingForSLAMCargoPackagesCount,
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Skeleton)[0]).toBeTruthy();
  });

  test('it receives the correct props and displays them correctly', () => {
    renderWithRedux(<WaitingCategoryFilters />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getWaitingForSLAMCargoPackagesCount: {
          isBusy: false,
          data: { byOperation: [], cancelled: 11, total: 22, inProcess: 33, waitingToProcess: 44 },
          error: undefined,
        },
      },
    });
    expect(screen.getByText(/11/)).toBeInTheDocument();
    expect(screen.getByText(/22/)).toBeInTheDocument();
    expect(screen.getByText(/33/)).toBeInTheDocument();
    expect(screen.getByText(/44/)).toBeInTheDocument();
    // using getByText here is okay since texts will be provided by mock props.
  });

  it('cannot calls setWaitingCategoryFilter on FilterButton click when resource is busy', () => {
    renderWithRedux(<WaitingCategoryFilters />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        waitingForSLAMCargoPackages: {
          ...initialState.resources.waitingForSLAMCargoPackages,
          isBusy: true,
        },
      },
    });
    fireEvent.click(screen.queryAllByTestId('category-filter-button')[0]);
    expect(mockSlamStationActions.setWaitingCategoryFilter).not.toHaveBeenCalled();
  });
});
