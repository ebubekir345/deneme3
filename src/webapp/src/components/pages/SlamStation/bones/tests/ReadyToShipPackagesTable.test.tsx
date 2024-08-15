import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SortDirection } from 'dynamic-query-builder-client';
import { ReadyToShipPackagesTable } from '../ReadyToShipPackagesTable';
import { createWithRedux, setupIntersectionObserverMock } from '../../../../../utils/testUtils';
import { GridTable } from '../../../../molecules/TouchScreen';
import { SLAMQueryCompletedCargoState } from '../../../../../services/swagger';
import { initialSlamStationState } from '../../../../../store/global/slamStationStore';
import { ReadyToShipStatusFilter } from '../../../../../typings/globalStore/enums';
import { initialState } from '../../../../../store/initState';

let mockSlamStationState: ISlamStationStore;
let mockSlamStationActions: any;
jest.mock('../../../../../store/global/slamStationStore', () => {
  return jest.fn(() => [mockSlamStationState, mockSlamStationActions]);
});

let component;

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

describe('ReadyToShipPackagesTable', () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    mockSlamStationState = {
      ...initialSlamStationState,
      readyToShipSort: {
        key: 'salesOrderCreatedAt',
        direction: SortDirection.ASC,
      },
      readyToShipCategoryFilter: ReadyToShipStatusFilter.Total,
      readyToShipPackages: [],
    };
    mockSlamStationActions = { setReadyToShipSort: jest.fn() };
  });

  it('displays skelatons on isBusy', () => {
    component = createWithRedux(<ReadyToShipPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        readyToShipCargoPackages: {
          ...initialState.resources.readyToShipCargoPackages,
          isBusy: true,
        },
        listCarriers: {
          isBusy: false,
        },
      },
    });

    expect(component.root.findAllByType(Skeleton)[0]).toBeTruthy();
  });

  it('pass table rows and activeSort to GridTable correctly', () => {
    mockSlamStationState.readyToShipPackages = [
      {
        state: SLAMQueryCompletedCargoState.ShipmentFailure,
        cargoCarrier: 'Aras',
        salesOrderCreatedAt: new Date(),
        salesOrderReferenceNumber: 'Order-0',
        cargoPackageLabel: 'Test',
        salesChannel: 'Pazaryeri',
        shipmentAddressFullName: 'TestName',
        shipmentAddressCity: 'Ankara',
      },
    ];
    component = createWithRedux(<ReadyToShipPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        readyToShipCargoPackages: {
          isBusy: false,
        },
        listCarriers: {
          isBusy: false,
        },
      },
    });
    expect(component.root.findByType(GridTable).props.rows.length).toBe(
      mockSlamStationState.readyToShipPackages.length
    );
    expect(component.root.findByType(GridTable).props.activeSort).toBe(mockSlamStationState.readyToShipSort);
  });

  it('trigger onSort with the callback from GridTable', () => {
    component = createWithRedux(<ReadyToShipPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        readyToShipCargoPackages: {
          isBusy: false,
        },
        listCarriers: {
          isBusy: false,
        },
      },
    });
    component.root.findByType(GridTable).props.onSort({ key: 'salesOrderCreatedAt', direction: SortDirection.ASC });
    expect(mockSlamStationActions.setReadyToShipSort).toHaveBeenCalledWith({
      key: 'salesOrderCreatedAt',
      direction: SortDirection.ASC,
    });
  });

  it('pass isBusy from resource to GridTable', () => {
    component = component = createWithRedux(<ReadyToShipPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        readyToShipCargoPackages: {
          isBusy: true,
        },
        listCarriers: {
          isBusy: false,
        },
      },
    });
    expect(component.root.findByType(GridTable).props.isBusy).toBe(true);
  });
});
