import { resourceActions } from '@oplog/resource-redux';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { ResourceType } from '../../../../../models';
import { mockStoreWithState } from '../../../../../store/configure.mock';
import { initialPackingState, IPackingStore } from '../../../../../store/global/packingStore';
import initialState from '../../../../../store/initState';
import { InfoMessageBoxState } from '../../../../molecules/InfoMessageBox/InfoMessageBox';
import SerialNumberAddModal, { PackingModals } from '../SerialNumberAddModal';

const intlKey = 'TouchScreen';

const MockSerialNumberModal = (mockProps?: any) => {
  let store = mockStoreWithState({
    ...initialState,
    ...mockProps,
  });
  return (
    <Provider store={store}>
      <SerialNumberAddModal />
    </Provider>
  );
};

let mockPackingStationState: IPackingStore;
let mockPackingStationActions: any;
jest.mock('../../../../../store/global/packingStore', () => {
  return jest.fn(() => [mockPackingStationState, mockPackingStationActions]);
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
    mockPackingStationState = {
      ...initialPackingState,
      modals: {
        Logout: false,
        OrderStatus: false,
        CompleteQuarantine: false,
        MissingItem: false,
        CargoPackagePick: false,
        QuarantineAreaScan: false,
        AddSerialNumber: true,
      },
      orderItems: [
        {
          productId: '077dc518-d486-48db-99a5-9369a2b2c988',
          productName: 'Small Fresh Fish',
          sku: 'SSN-SKU-16',
          barcodes: ['SSN-Barcode-16'],
          imageUrl: 'http://placeimg.com/150/150/tech',
          amountInOrder: 1,
          boxedCount: 0,
        },
      ],
      operation: { id: '4ddc9bdd-acca-4e3a-8d61-57725ab319cf', name: '', imageUrl: '' },
      barcodeData: 'SSN-Barcode-16',
      productSerialNo: '',
      boxItems: [{ key: 0, title: 'Box-1', selected: true, cargoPackageIndex: 0, content: [] }]
    };
    mockPackingStationActions = {
      toggleModalState: jest.fn(),
      callInfoMessageBox: jest.fn(),
      setProductSerialNo: jest.fn(),
    };
  });

  it('should set the serial number', () => {
    render(<MockSerialNumberModal />);
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'SerialNumber' } });
    expect(mockPackingStationActions.setProductSerialNo).toHaveBeenCalledWith('');
    expect(mockPackingStationActions.setProductSerialNo).toHaveBeenCalledWith('SerialNumber');
    
    fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'SimpleSerialNumber' } });
    expect(mockPackingStationActions.setProductSerialNo).toHaveBeenCalledWith('');
    expect(mockPackingStationActions.setProductSerialNo).toHaveBeenCalledWith('SimpleSerialNumber');
  });

  it('should trim and check the simple serial number', () => {
    mockPackingStationState.orderItems[0].isTrackSimpleSerialNumber = true;
    mockPackingStationState.productSerialNo = ' SimpleSerialNumber ';
    render(<MockSerialNumberModal />);
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`));

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.CheckSimpleSerialNumber, {
        payload: {
          simpleSerialNumber: 'SimpleSerialNumber',
          sku: 'SSN-SKU-16',
          operationId: '4ddc9bdd-acca-4e3a-8d61-57725ab319cf',
        },
      })
    );
  });

  it('should queue item into cargo package, close the modal and initialize the response', () => {
    mockPackingStationState.productSerialNo = ' SimpleSerialNumber ';
    render(
      <MockSerialNumberModal
        {...{
          resources: {
            ...initialState.resources,
            checkSimpleSerialNumber: {
              isSuccess: true,
              data: {},
            },
          },
        }}
      />
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.QueueItemIntoCargoPackage, {
        params: {
          packingProcessId: mockPackingStationState.processId,
          productId: mockPackingStationState.orderItems[0].productId,
          packageIndex: mockPackingStationState.boxItems[0].cargoPackageIndex,
          simpleSerialNumber: mockPackingStationState.productSerialNo.trim(),
          toteLabel: mockPackingStationState.orderBasket
        },
      })
    );
    expect(mockPackingStationActions.toggleModalState).toHaveBeenCalledWith(PackingModals.AddSerialNumber, false);
    expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceInit(ResourceType.CheckSimpleSerialNumber));
  });

  it("should queue item into quarantine tote", () => {
    mockPackingStationState.orderItems[0].serialNumbers = ["Z3AIWCPXK8"]
    mockPackingStationState.productSerialNo = ' Z3AIWCPXK8 ';
    mockPackingStationState.isMissing = true
    render(<MockSerialNumberModal />);
    fireEvent.keyDown(screen.getByTestId('input-box'), {key: 'ENTER', code: 'Enter'});

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.QueueItemIntoQuarantineTote, {
        params: {
          packingQuarantineProcessId: mockPackingStationState.processId,
          productId: mockPackingStationState.orderItems[0].productId,
          quarantineToteLabel: mockPackingStationState.boxItems[0].title,
          serialNumber: mockPackingStationState.productSerialNo.trim(),
        },
      })
    )
  })

  it("should give the 'TargetSerialNoErr' error message", () => {
    mockPackingStationState.productSerialNo = 'Test';
    render(<MockSerialNumberModal />);
    fireEvent.click(screen.getByText(`${intlKey}.HOVPackingStation.AddSerialNumberModal.OkayButton`));

    expect(mockPackingStationActions.callInfoMessageBox).toHaveBeenCalledWith({
      state: InfoMessageBoxState.Error,
      text: `${intlKey}.HOVPackingStation.Error.TargetSerialNoErr`,
    });
  })
});
