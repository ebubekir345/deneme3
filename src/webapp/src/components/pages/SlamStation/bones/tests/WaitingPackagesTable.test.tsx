import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SortDirection } from 'dynamic-query-builder-client';
import { WaitingPackagesTable } from '../WaitingPackagesTable';
import { createWithRedux, setupIntersectionObserverMock } from '../../../../../utils/testUtils';
import { GridTable } from '../../../../molecules/TouchScreen';
import { SLAMQueryCargoState } from '../../../../../services/swagger';
import { initialSlamStationState } from '../../../../../store/global/slamStationStore';
import { WaitingStatusFilter } from '../../../../../typings/globalStore/enums';
import { initialState } from '../../../../../store/initState';

let mockSlamStationState: ISlamStationStore;
let mockSlamStationActions: any;
jest.mock('../../../../../store/global/slamStationStore', () => {
  return jest.fn(() => [mockSlamStationState, mockSlamStationActions]);
});

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

let component;

describe('WaitingPackagesTable', () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    mockSlamStationState = {
      ...initialSlamStationState,
      waitingSort: {
        key: 'salesOrderCreatedAt',
        direction: SortDirection.ASC,
      },
      waitingCategoryFilter: WaitingStatusFilter.Total,
      waitingPackages: [],
    };
    mockSlamStationActions = { setWaitingSort: jest.fn() };
  });

  it('displays skelatons on isBusy', () => {
    component = createWithRedux(<WaitingPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        waitingForSLAMCargoPackages: {
          ...initialState.resources.waitingForSLAMCargoPackages,
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Skeleton)[0]).toBeTruthy();
  });

  it('pass table rows and activeSort to GridTable correctly', () => {
    mockSlamStationState.waitingPackages = [
      {
        state: SLAMQueryCargoState.InProcess,
        salesOrderCreatedAt: new Date(),
        salesOrderReferenceNumber: 'Order-0',
        cargoPackageLabel: 'Test',
        salesChannel: 'Web',
        shipmentAddressFullName: 'TestName',
        shipmentAddressCity: 'Ankara',
      },
    ];
    component = createWithRedux(<WaitingPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        waitingForSLAMCargoPackages: {
          ...initialState.resources.waitingForSLAMCargoPackages,
          isBusy: false,
        },
      },
    });
    expect(component.root.findAllByType(GridTable)[0].props.rows.length).toBe(
      mockSlamStationState.waitingPackages.length
    );
    expect(component.root.findByType(GridTable).props.activeSort).toBe(mockSlamStationState.waitingSort);
  });

  it('trigger onSort with the callback from GridTable', () => {
    component = createWithRedux(<WaitingPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        waitingForSLAMCargoPackages: {
          ...initialState.resources.waitingForSLAMCargoPackages,
          isBusy: false,
        },
      },
    });
    component.root.findByType(GridTable).props.onSort({ key: 'salesOrderCreatedAt', direction: SortDirection.ASC });
    expect(mockSlamStationActions.setWaitingSort).toHaveBeenCalledWith({
      key: 'salesOrderCreatedAt',
      direction: SortDirection.ASC,
    });
  });

  it('pass isBusy from resource to GridTable', () => {
    component = createWithRedux(<WaitingPackagesTable />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        waitingForSLAMCargoPackages: {
          ...initialState.resources.waitingForSLAMCargoPackages,
          isBusy: true,
        },
      },
    });
    expect(component.root.findByType(GridTable).props.isBusy).toBe(true);
  });
});
