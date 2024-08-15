import React from 'react';
import { fireEvent, screen } from '@testing-library/dom';
import ReturnDialogModal from '../../../../molecules/ReturnDialogModal/ReturnDialogModal';
import { initialSlamStationState } from '../../../../../store/global/slamStationStore';
import { SlamStationModals } from '../../../../../typings/globalStore/enums';
import { renderWithContext } from '../../../../../utils/testUtils';
import { useAuth0 } from '../../../../../auth/auth0';
import { mocked } from 'ts-jest/utils';

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

jest.mock('../../../../../auth/auth0');
const mockedUseAuth0: any = mocked(useAuth0, true);

describe('ReturnDialogModal', () => {
  beforeEach(() => {
    mockSlamStationState = { ...initialSlamStationState, modals: { Logout: false } };
    mockSlamStationActions = { toggleModalState: jest.fn() };
    mockedUseAuth0.mockReturnValue({
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenSilently: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithPopup: jest.fn(),
    });
  });

  it('hides modal when modal status is false', () => {
    renderWithContext(<ReturnDialogModal modals={mockSlamStationState.modals} toggleModalState={mockSlamStationActions} type={`TouchScreen.LogoutModal.Types.CargoLabeling`} />);
    expect(screen.queryAllByTestId('return-dialog-modal')).toHaveLength(0);
  });
});
