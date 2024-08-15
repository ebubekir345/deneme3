import { resourceActions } from '@oplog/resource-redux';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { ResourceType } from '../../../../../models';
import { InternalErrorNumber } from '../../../../../services/swagger';
import { mockStoreWithState } from '../../../../../store/configure.mock';
import { IHovPackingStore, initialHovPackingState } from '../../../../../store/global/hovPackingStore';
import initialState from '../../../../../store/initState';
import { InfoMessageBoxState } from '../../../../molecules/InfoMessageBox/InfoMessageBox';
import SimpleSerialNumberAddModal, { HovPackingModals } from '../SimpleSerialNumberAddModal';

const intlKey = 'TouchScreen';

const MockSerialNumberModal = (mockProps?: any) => {
  let store = mockStoreWithState({
    ...initialState,
    ...mockProps,
  });
  return (
    <Provider store={store}>
      <SimpleSerialNumberAddModal />
    </Provider>
  );
};

let mockHOVPackingStationState: IHovPackingStore;
let mockHOVPackingStationActions: any;
jest.mock('../../../../../store/global/hovPackingStore', () => {
  return jest.fn(() => [mockHOVPackingStationState, mockHOVPackingStationActions]);
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
    mockHOVPackingStationState = {
      ...initialHovPackingState,
      modals: {
        Logout: false,
        OrderStatus: false,
        CompleteQuarantine: false,
        MissingItem: false,
        CargoPackagePick: false,
        QuarantineAreaScan: false,
        HovAddProduct: false,
        AddSerialNumber: false,
        AddSimpleSerialNumber: true,
      },
      orderItems: [
        {
          productId: '077dc518-d486-48db-99a5-9369a2b2c988',
          productName: 'Small Fresh Fish',
          sku: 'SSN-SKU-16',
          barcodes: ['SSN-Barcode-16'],
          imageUrl: 'http://placeimg.com/150/150/tech',
          amountInOrder: 2,
          boxedCount: 0,
        },
      ],
      operation: { id: '4ddc9bdd-acca-4e3a-8d61-57725ab319cf', name: '', imageUrl: '' },
      barcodeData: 'SSN-Barcode-16',
      productSerialNo: '',
      hovItemCount: 1,
      boxItems: [{ key: 0, title: 'Box-1', selected: true, cargoPackageIndex: 0, content: [] }],
    };
    mockHOVPackingStationActions = {
      toggleModalState: jest.fn(),
      callInfoMessageBox: jest.fn(),
      setProductSerialNo: jest.fn(),
      setHovItemCount: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set the simple serial number and disable the button when input is empty or serial numbers are scanned', () => {
    render(<MockSerialNumberModal />);
    expect(screen.getAllByText(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`).length).toBe(1);

    fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'SimpleSerialNumber' } });
    expect(mockHOVPackingStationActions.setProductSerialNo).toHaveBeenCalledWith('');
    expect(mockHOVPackingStationActions.setProductSerialNo).toHaveBeenCalledWith('SimpleSerialNumber');

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], () => null]);
    mockHOVPackingStationState.productSerialNo = ' ';
    expect(
      screen.getByText(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`).closest('button')
    ).toBeDisabled();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [['Test'], () => null]);
    mockHOVPackingStationState.productSerialNo = 'Test';
    expect(
      screen.getByText(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`).closest('button')
    ).toBeDisabled();
  });

  it('should not add an item with the same simple serial number added before', () => {
    mockHOVPackingStationState.hovItemCount = 2;
    mockHOVPackingStationState.productSerialNo = ' Test ';
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([['Test'], () => {}])
      .mockReturnValueOnce(['', () => {}]);
    render(<MockSerialNumberModal />);
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`));

    expect(mockHOVPackingStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.HOVPackingStation.Error.AlreadyScannedSN`,
    });
  });

  it('should check the simple serial number', () => {
    mockHOVPackingStationState.productSerialNo = 'SimpleSerialNumber';
    render(<MockSerialNumberModal />);
    fireEvent.keyDown(screen.getByTestId('input-box'), { key: 'ENTER', code: 'Enter' });

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.CheckHOVSimpleSerialNumber, {
        payload: {
          simpleSerialNumber: 'SimpleSerialNumber',
          sku: 'SSN-SKU-16',
          operationId: '4ddc9bdd-acca-4e3a-8d61-57725ab319cf',
        },
      })
    );
  });

  it('should show multiple simple serial number input component', () => {
    mockHOVPackingStationState.itemCountThreshold = 2;
    mockHOVPackingStationState.orderItems[0].amountInOrder = 3;
    render(<MockSerialNumberModal />);

    expect(
      screen.getAllByRole('button', { name: `${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton` }).length
    ).toBe(2);
    expect(
      screen.getAllByRole('button', { name: `${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton` })[1]
    ).toBeDisabled();
    expect(screen.queryByTestId('search-result')).not.toBeInTheDocument();
  });

  it('should show one added simple serial number', () => {
    mockHOVPackingStationState.itemCountThreshold = 2;
    mockHOVPackingStationState.orderItems[0].amountInOrder = 3;
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([['SimpleSerialNumber'], () => null])
      .mockReturnValueOnce([['SimpleSerialNumber'], () => null])
      .mockReturnValueOnce(['', () => null]);
    render(<MockSerialNumberModal />);

    expect(screen.getByTestId('search-result')).toHaveTextContent('SimpleSerialNumber');
  });

  it('should not show any simple serial number', () => {
    mockHOVPackingStationState.itemCountThreshold = 2;
    mockHOVPackingStationState.orderItems[0].amountInOrder = 3;
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([['SimpleSerialNumber'], () => null])
      .mockReturnValueOnce([[], () => null])
      .mockReturnValueOnce(['Dimple', () => null]);
    render(<MockSerialNumberModal />);

    expect(screen.queryByTestId('search-result')).not.toBeInTheDocument();
  });

  it('should queue item into cargo package, close the modal and initialize the response', () => {
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            [ResourceType.CheckHOVSimpleSerialNumber]: {
              isSuccess: true,
            },
          },
        }}
      />
    );

    expect(mockHOVPackingStationActions.setHovItemCount).toHaveBeenCalledWith(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.QueueHovItemIntoCargoPackage, {
        params: {
          hovPackingProcessId: mockHOVPackingStationState.processId,
          productId: mockHOVPackingStationState.orderItems[0].productId,
          packageIndex: mockHOVPackingStationState.boxItems[0].cargoPackageIndex,
          amount: 1,
          simpleSerialNumbers: [mockHOVPackingStationState.productSerialNo.trim()],
          toteLabel: mockHOVPackingStationState.orderBasket,
        },
      })
    );
    expect(mockHOVPackingStationActions.toggleModalState).toHaveBeenCalledWith(
      HovPackingModals.AddSimpleSerialNumber,
      false
    );
    expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceInit(ResourceType.CheckHOVSimpleSerialNumber));
    expect(mockHOVPackingStationActions.setProductSerialNo).toHaveBeenCalledWith('');
  });

  it('should give the "SerialNumberScanned" error message', () => {
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            [ResourceType.CheckHOVSimpleSerialNumber]: {
              error: {
                internalErrorNumber: InternalErrorNumber.SimpleSerialNumberIsUsedForAnotherSaleOrder,
              },
            },
          },
        }}
      />
    );

    expect(mockHOVPackingStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.HOVPackingStation.Error.SerialNumberScanned`,
    });
  });

  it('should finish the multi simple serial number input process with button click', () => {
    mockHOVPackingStationState.itemCountThreshold = 2;
    mockHOVPackingStationState.orderItems[0].amountInOrder = 3;
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([['SimpleSerialNumber'], () => null])
      .mockReturnValueOnce([[], () => null]);
    render(<MockSerialNumberModal />);
    fireEvent.click(
      screen.getAllByRole('button', { name: `${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton` })[1]
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.QueueHovItemIntoCargoPackage, {
        params: {
          hovPackingProcessId: mockHOVPackingStationState.processId,
          productId: mockHOVPackingStationState.orderItems[0].productId,
          packageIndex: mockHOVPackingStationState.boxItems[0].cargoPackageIndex,
          amount: 1,
          simpleSerialNumbers: [mockHOVPackingStationState.productSerialNo],
          toteLabel: mockHOVPackingStationState.orderBasket,
        },
      })
    );
    expect(mockHOVPackingStationActions.toggleModalState).toHaveBeenCalledWith(
      HovPackingModals.AddSimpleSerialNumber,
      false
    );
    expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceInit(ResourceType.CheckHOVSimpleSerialNumber));
  });
});
