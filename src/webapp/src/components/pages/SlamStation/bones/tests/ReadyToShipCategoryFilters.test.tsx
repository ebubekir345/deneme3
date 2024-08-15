import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { ReadyToShipCategoryFilters, ReadyToShipCategoryFilter } from '../ReadyToShipCategoryFilters';
import { renderWithRedux } from '../../../../../utils/testUtils';
import { initialSlamStationState } from '../../../../../store/global/slamStationStore';
import { ReadyToShipStatusFilter } from '../../../../../typings/globalStore/enums';
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
describe('ReadyToShipCategoryFilters', () => {
  beforeEach(() => {
    mockSlamStationState = {
      ...initialSlamStationState,
      readyToShipCategoryFilter: ReadyToShipStatusFilter.Total,
    };
    mockSlamStationActions = { setReadyToShipCategoryFilter: jest.fn() };
  });

  it('renders filter buttons as cargoCarriers + statuses', () => {
    renderWithRedux(<ReadyToShipCategoryFilters />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getReadyToShipCargoPackagesCount: {
          ...initialState.resources.getReadyToShipCargoPackagesCount,
          data: {
            total: 14,
            byCargoCarrier: [
              { cargoCarrier: 'Aras', count: 12 },
              { cargoCarrier: 'MNG', count: 2 },
            ],
          },
        },
        listCarriers: {
          isBusy: false,
          data: [],
        },
      },
    });
    const packageStatusCategoriesLength = Object.keys(ReadyToShipCategoryFilter).length;
    const expectedLength = packageStatusCategoriesLength + 2;
    expect(screen.queryAllByTestId('category-filter-button')).toHaveLength(expectedLength);
    expect(
      screen.queryAllByTestId('category-filter-button')[packageStatusCategoriesLength].childNodes[1].textContent
    ).toBe('12');
    expect(screen.queryAllByTestId('category-filter-button')[0].childNodes[1].textContent).toBe('14');
  });

  it('does not render cargoCarriers filter buttons when resource isBusy', () => {
    renderWithRedux(<ReadyToShipCategoryFilters />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getReadyToShipCargoPackagesCount: {
          ...initialState.resources.getReadyToShipCargoPackagesCount,
          isBusy: true,
          data: {
            byCargoCarrier: [{ cargoCarrier: 'Aras', count: 12 }],
          },
        },
        listCarriers: {
          isBusy: true,
        },
      },
    });
    const packageStatusCategoriesLength = Object.keys(ReadyToShipCategoryFilter).length;
    expect(screen.queryAllByTestId('category-filter-button')).toHaveLength(packageStatusCategoriesLength);
  });

  it('calls setReadyToShipCategoryFilter on FilterButton click', () => {
    renderWithRedux(<ReadyToShipCategoryFilters />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getReadyToShipCargoPackagesCount: {
          ...initialState.resources.getReadyToShipCargoPackagesCount,
          data: {
            byCargoCarrier: [{ cargoCarrier: 'Aras', count: 12 }],
          },
        },
        listCarriers: {
          isBusy: false,
          data: [],
        },
      },
    });
    const packageStatusCategoriesLength = Object.keys(ReadyToShipCategoryFilter).length;
    fireEvent.click(screen.queryAllByTestId('category-filter-button')[0]);
    expect(mockSlamStationActions.setReadyToShipCategoryFilter).toHaveBeenCalledWith(ReadyToShipStatusFilter.Total);
    fireEvent.click(screen.queryAllByTestId('category-filter-button')[packageStatusCategoriesLength]);
    expect(mockSlamStationActions.setReadyToShipCategoryFilter).toHaveBeenCalledWith('Aras');
  });

  it('cannot calls setReadyToShipCategoryFilter on FilterButton click when resource is busy', () => {
    renderWithRedux(<ReadyToShipCategoryFilters />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getReadyToShipCargoPackagesCount: {
          ...initialState.resources.getReadyToShipCargoPackagesCount,
          isBusy: false,
        },
        readyToShipCargoPackages: {
          isBusy: true,
        },
        listCarriers: {
          isBusy: false,
          data: [],
        },
      },
    });
    fireEvent.click(screen.queryAllByTestId('category-filter-button')[0]);
    expect(mockSlamStationActions.setReadyToShipCategoryFilter).not.toHaveBeenCalled();
  });
});
