import { resourceActions } from '@oplog/resource-redux';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { ResourceType } from '../../../../models';
import { InternalErrorNumber } from '../../../../services/swagger';
import { mockStoreWithState } from '../../../../store/configure.mock';
import {
  initialSingleItemPackingState,
  ISingleItemPackingStore,
} from '../../../../store/global/singleItemPackingStore';
import initialState from '../../../../store/initState';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import SerialNumberModal, { SingleItemPackingModals } from '../bones/SerialNumberModal';

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

let mockSingleItemPackingStationState: ISingleItemPackingStore;
let mockSingleItemPackingStationActions: any;
jest.mock('../../../../store/global/singleItemPackingStore', () => {
  return jest.fn(() => [mockSingleItemPackingStationState, mockSingleItemPackingStationActions]);
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

let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as object),
  useDispatch: () => mockDispatch,
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
    mockSingleItemPackingStationState = {
      ...initialSingleItemPackingState,
      modals: {
        Logout: false,
        OrderStatus: false,
        DropTote: false,
        CargoPackagePick: false,
        ParkAreaScan: false,
        SerialNumber: true,
      },
      product: [
        {
          productName: 'Small Fresh Fish',
          sku: 'SN-SKU-13',
          barcodes: 'SN-Barcode-13',
          productImageURL: 'http://placeimg.com/150/150/tech',
          isSerialNumberTrackRequiredProduct: false,
          isSimpleSerialNumberTrackRequiredProduct: false,
        },
      ],
      toteLabel: 'OPS-SEPET-002',
      barcodeData: 'SN-Barcode-8',
    };
    mockSingleItemPackingStationActions = {
      toggleModalState: jest.fn(),
      callInfoMessageBox: jest.fn(),
      setSimpleSerialNumber: jest.fn(),
    };
  });

  it('should check the simple serial number', () => {
    mockSingleItemPackingStationState.product[0] = {
      ...mockSingleItemPackingStationState.product[0],
      isSimpleSerialNumberTrackRequiredProduct: true,
      operationId: '4ddc9bdd-acca-4e3a-8d61-57725ab319cf',
    };
    render(<MockSerialNumberModal />);
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'SimpleSerialNumber' } });
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`));

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.CheckSimpleSerialNumberForSinglePacking, {
        payload: {
          operationId: '4ddc9bdd-acca-4e3a-8d61-57725ab319cf',
          sku: 'SN-SKU-13',
          simpleSerialNumber: 'SimpleSerialNumber',
        },
      })
    );
  });

  it('should set simpleSerialNumber and initialize the response', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce(['SimpleSerialNumber', () => null]);
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkSimpleSerialNumberForSinglePacking: {
              isSuccess: true,
              data: {},
            },
          },
        }}
      />
    );

    expect(mockSingleItemPackingStationActions.setSimpleSerialNumber).toHaveBeenCalledWith('SimpleSerialNumber');
    expect(jest.spyOn(React, 'useState')).toHaveBeenCalledWith('');
    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceInit(ResourceType.CheckSimpleSerialNumberForSinglePacking)
    );
  });

  it('should throw error when simpleSerialNumber is used for another sales order', () => {
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkSimpleSerialNumberForSinglePacking: {
              error: {
                internalErrorNumber: InternalErrorNumber.SimpleSerialNumberIsUsedForAnotherSaleOrder,
              },
            },
          },
        }}
      />
    );

    expect(mockSingleItemPackingStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.HOVPackingStation.Error.SerialNumberScanned`,
    });
  });

  it('should close the modal', () => {
    mockSingleItemPackingStationState.product[0] = {
      ...mockSingleItemPackingStationState.product[0],
      totePickingItemsSerialNumbers: ['15-25ddss1653-21adasd30131'],
    };
    render(<MockSerialNumberModal />);
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: '15-25ddss1653-21adasd30131' } });
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`));

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetSingleItemSalesOrderState, {
        toteLabel: mockSingleItemPackingStationState.toteLabel,
        productBarcode: mockSingleItemPackingStationState.barcodeData,
        serialNumber: '15-25ddss1653-21adasd30131',
      })
    );
    expect(mockSingleItemPackingStationActions.toggleModalState).toHaveBeenCalledWith(
      SingleItemPackingModals.SerialNumber,
      false
    );
  });

  it("should give the 'WrongSerialNumber' error message", () => {
    render(<MockSerialNumberModal />);
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: '15-25ddss1653-21adasd30131' } });
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`));

    expect(mockSingleItemPackingStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.HOVPackingStation.HovAddProductModal.WrongSerialNumber`,
      timer: 6,
    });
  });
});
