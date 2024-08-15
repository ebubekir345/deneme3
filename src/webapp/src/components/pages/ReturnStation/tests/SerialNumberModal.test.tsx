import { resourceActions } from '@oplog/resource-redux';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { ResourceType } from '../../../../models';
import { mockStoreWithState } from '../../../../store/configure.mock';
import { initialReturnState, IReturnStore } from '../../../../store/global/returnStore';
import initialState from '../../../../store/initState';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import SerialNumberModal, { ReturnModals } from '../bones/SerialNumberModal';

let mockReturnStationState: IReturnStore;
let mockReturnStationActions: any;
jest.mock('../../../../store/global/returnStore', () => {
  return jest.fn(() => [mockReturnStationState, mockReturnStationActions]);
});

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
    mockReturnStationState = {
      ...initialReturnState,
      modals: {
        Logout: false,
        CompleteReturn: false,
        GenericError: false,
        Error: false,
        SerialNumber: true,
      },
      orderItems: [
        {
          productId: 'be94c5e6-2bd8-4825-8d11-2988a1819cad',
          productName: 'Ergonomic Cotton Chips',
          sku: 'SN-SKU-5',
          barcodes: ['SN-Barcode-5'],
          imageUrl: 'http://placeimg.com/150/150/tech',
          amountInOrder: 2,
          boxedCount: 0,
        },
      ],
      boxItems: [],
      barcodeData: 'SN-Barcode-5',
      salesOrderId: 'fbfd5a65-a9c7-4ff8-89bf-4dbc98018638',
    };
    mockReturnStationActions = {
      callInfoMessageBox: jest.fn(),
      setPreviousBoxItems: jest.fn(),
      setBoxItems: jest.fn(),
      toggleModalState: jest.fn(),
    };
  });

  it("should give the 'ScannedSerialNumber' error message", () => {
    mockReturnStationState = {
      ...mockReturnStationState,
      orderItems: [
        {
          ...mockReturnStationState.orderItems[0],
          boxedCount: 1,
        },
      ],
      boxItems: [
        { key: 0, title: 'Box-1', selected: true, content: [{ serialNumbers: ['5QX93YAIEX'], sku: 'SN-SKU-5' }] },
      ],
    };
    jest.spyOn(React, 'useState').mockImplementationOnce(() => ['5QX93YAIEX', () => null]).mockImplementationOnce(() => [false, () => null])
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkReturnItemSerialNumber: {
              isSuccess: true,
              data: {},
            },
          },
        }}
      />
    );
    expect(mockReturnStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.ReturnStation.Error.ScannedSerialNumber`,
    });

    mockReturnStationState.boxItems[0] = {
      key: 0,
      title: 'Box-1',
      selected: true,
      content: [{ simpleSerialNumbers: ['5QX93YAIEX'], sku: 'SN-SKU-5' }],
    };
    expect(mockReturnStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.ReturnStation.Error.ScannedSerialNumber`,
    });
  });

  it('should give the "SelectControlTote" error message', () => {
    mockReturnStationState.orderItems[0].isTrackSimpleSerialNumber = true;
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkReturnItemSerialNumber: {
              isSuccess: true,
              data: { isExistInSalesOrderSimpleSerialNumberItems: false },
            },
          },
        }}
      />
    );

    expect(mockReturnStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.ReturnStation.Error.SelectControlTote`,
    });
  });

  it('should set box items', () => {
    mockReturnStationState.orderItems[0].isTrackSimpleSerialNumber = true;
    jest.spyOn(React, 'useState').mockImplementationOnce(() => ['5QX93YAIEX', () => null]).mockImplementationOnce(() => [false, () => null])
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkReturnItemSerialNumber: {
              isSuccess: true,
              data: { isExistInSalesOrderSimpleSerialNumberItems: true },
            },
          },
        }}
      />
    );

    expect(
      mockReturnStationActions.setBoxItems([
        { key: 0, title: 'Box-1', selected: true, content: [{ simpleSerialNumbers: ['5QX93YAIEX'], sku: 'SN-SKU-5' }] },
      ])
    );
    expect(jest.spyOn(React, 'useState')).toHaveBeenCalledWith('');
  });

  it('should close the modal', () => {
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkReturnItemSerialNumber: {
              isSuccess: true,
              data: { isExistInCurrentSalesOrder: true, isExistOnOtherItems: false },
            },
          },
        }}
      />
    );

    expect(mockReturnStationActions.toggleModalState).toHaveBeenCalledWith(ReturnModals.SerialNumber, false);
  });

  it("should give the 'DuplicateSerialNumber' error message", () => {
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkReturnItemSerialNumber: {
              isSuccess: true,
              data: { isExistInCurrentSalesOrder: true, isExistOnOtherItems: true },
            },
          },
        }}
      />
    );
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: '5QX93YAIEX' } });
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.HovAddProductModal.OkayButton`));

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.CheckReturnItemSerialNumber, {
        SalesOrderId: mockReturnStationState.salesOrderId,
        ProductId: mockReturnStationState.orderItems[0].productId,
        SerialNumber: '5QX93YAIEX',
      })
    );
    expect(mockReturnStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.ReturnStation.Error.DuplicateSerialNumber`,
    });
  });
});
