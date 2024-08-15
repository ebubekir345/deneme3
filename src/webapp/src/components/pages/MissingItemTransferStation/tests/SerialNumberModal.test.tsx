import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { mockStoreWithState } from '../../../../store/configure.mock';
import {
  IMissingItemTransferStore,
  initialMissingItemTransferState,
} from '../../../../store/global/missingItemTransferStore';
import initialState from '../../../../store/initState';
import { MissingItemTransferModals } from '../../../../typings/globalStore/enums';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { SerialNumberModal } from '../bones';

const intlKey = 'TouchScreen';

const MockSerialNumberModal = (mockProps?: any) => {
  let store = mockStoreWithState({
    ...initialState,
    ...mockProps,
  });
  return (
    <Provider store={store}>
      <SerialNumberModal />
    </Provider>
  );
};

let mockMissingItemTransferStationState: IMissingItemTransferStore;
let mockMissingItemTransferStationActions: any;
jest.mock('../../../../store/global/missingItemTransferStore', () => {
  return jest.fn(() => [mockMissingItemTransferStationState, mockMissingItemTransferStationActions]);
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

jest.mock('use-resize-observer', () => () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
  ref: { current: 'Ref' },
}));

describe('Serial Number Modal', () => {
  beforeEach(() => {
    mockMissingItemTransferStationState = {
      ...initialMissingItemTransferState,
      modals: {
        Logout: false,
        CompleteMissingItemTransfer: false,
        OrderStatus: false,
        MissingItem: false,
        SerialNumber: true,
      },
      orderItems: [
        {
          productId: '077dc518-d486-48db-99a5-9369a2b2c988',
          productName: 'Small Fresh Fish',
          sku: 'SN-SKU-13',
          barcodes: ['SN-Barcode-13'],
          imageUrl: 'http://placeimg.com/150/150/tech',
          amountInOrder: 1,
          boxedCount: 0,
        },
      ],
      barcodeData: 'SN-Barcode-13',
      boxItems: [],
      pickingToteContainedItemSerialNumbers: { '077dc518-d486-48db-99a5-9369a2b2c988': [] },
    };
    mockMissingItemTransferStationActions = {
      callInfoMessageBox: jest.fn(),
      setBoxItems: jest.fn(),
      toggleModalState: jest.fn(),
    };
  });

  it("should give the 'ScannedSerialNumber' error message", () => {
    mockMissingItemTransferStationState = {
      ...mockMissingItemTransferStationState,
      boxItems: [
        { key: 0, title: 'Box-1', selected: true, content: [{ serialNumbers: ['HFLWN1EGWV'], sku: 'SN-SKU-13' }] },
      ],
    };
    render(<MockSerialNumberModal />);
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'HFLWN1EGWV' } });
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`));

    expect(mockMissingItemTransferStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.ReturnStation.Error.ScannedSerialNumber`,
      timer: 6,
    });
  });

  it("should give the 'QuarantineWrongSerialNumber' error message", () => {
    mockMissingItemTransferStationState = {
      ...mockMissingItemTransferStationState,
      isCancelled: true,
    };
    render(<MockSerialNumberModal />);
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'HFLWN1EGWV' } });
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`));

    expect(mockMissingItemTransferStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.MissingItemTransferStation.Error.QuarantineWrongSerialNumber`,
      timer: 6,
    });
  });

  it('should close the modal', () => {
    mockMissingItemTransferStationState = {
      ...mockMissingItemTransferStationState,
      pickingToteContainedItemSerialNumbers: { '077dc518-d486-48db-99a5-9369a2b2c988': ['HFLWN1EGWV'] },
    };
    render(<MockSerialNumberModal />);
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'HFLWN1EGWV' } });
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`));

    expect(mockMissingItemTransferStationActions.toggleModalState).toHaveBeenCalledWith(
      MissingItemTransferModals.SerialNumber,
      false
    );
    expect(mockMissingItemTransferStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Success,
      text: `${intlKey}.SingleItemPackingStation.MiddleBar.SuccessProduct`,
    });
  });
});
