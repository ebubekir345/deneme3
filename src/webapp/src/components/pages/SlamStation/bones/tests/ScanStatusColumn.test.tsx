import React from 'react';
import { screen } from '@testing-library/react';
import { ScanStatusColumn } from '../ScanStatusColumn';
import { renderWithRedux } from '../../../../../utils/testUtils';
import '@testing-library/jest-dom';
import { CargoPackageSLAMState } from '../../../../../services/swagger';
import { initialState } from '../../../../../store/initState';
import { mocked } from 'ts-jest/utils';
import { useAuth0 } from '../../../../../auth/auth0';

let mockHistory: any;
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: () => mockHistory,
}));
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
jest.mock('use-resize-observer', () => () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
  ref: { current: 'Ref' },
}));

jest.mock('../../../../../auth/auth0');
const mockedUseAuth0: any = mocked(useAuth0, true);

const intlKey = 'TouchScreen.SlamStation.ScanBox';
const modalIntlKey = 'TouchScreen.SlamStation.Modals';

describe('ScanStatusColumn', () => {
  beforeEach(() => {
    mockHistory = {
      push: jest.fn(),
    };
    mockedUseAuth0.mockReturnValue({
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
    });
  });
  test('it shows loading when isBusy', () => {
    renderWithRedux(<ScanStatusColumn />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        printCargoPackageCarrierLabel: {
          ...initialState.resources.printCargoPackageCarrierLabel,
          isBusy: true,
        },
        listCarriers: {
          isBusy: false,
        },
      },
    });

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  test('it shows MoreActionScreenButton', () => {
    renderWithRedux(<ScanStatusColumn />);
    expect(screen.getByTestId('moreActionButton')).toBeInTheDocument();
  });
  test('it displays correct UI on state change', () => {
    renderWithRedux(<ScanStatusColumn />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        printCargoPackageCarrierLabel: {
          ...initialState.resources.printCargoPackageCarrierLabel,
          data: {
            state: CargoPackageSLAMState.ReadyToShip,
          },
          isSuccess: true,
        },
        listCarriers: {
          isBusy: false,
        },
      },
    });
    expect(screen.getByText(`${intlKey}.ScanSuccess`)).toBeInTheDocument();
    renderWithRedux(<ScanStatusColumn />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        printCargoPackageCarrierLabel: {
          isSuccess: true,
          isBusy: false,
          data: {
            salesOrderReferenceNumber: 'string',
            cargoPackageLabel: 'string',
            cargoCarrier: 'string',
            state: CargoPackageSLAMState.ShipmentFailure,
          },
        },
        listCarriers: {
          isBusy: false,
        },
      },
    });
    expect(screen.getByText(`${intlKey}.OrderProblematicSubtext`)).toBeInTheDocument();
  });
});
