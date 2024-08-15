import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { ResourceType } from '../../../../../models';
import { SalesOrderCreatedState, SalesOrderState } from '../../../../../services/swagger';
import { mockStoreWithState } from '../../../../../store/configure.mock';
import initialState from '../../../../../store/initState';
import AssignmentFailedOrdersModal, { IAssignmentFailedOrdersModal } from '../AssignmentFailedOrdersModal';

const MockAssignmentFailedOrdersModal = (mockModalProps: IAssignmentFailedOrdersModal, mockProps?: any) => {
  let store = mockStoreWithState({
    ...initialState,
    ...mockProps,
  });
  return (
    <Provider store={store}>
      <AssignmentFailedOrdersModal {...mockModalProps} />
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

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  Link: jest.fn().mockImplementation(({ to, children }) => <a href={to}>{children}</a>),
}));

const mockModalProps: IAssignmentFailedOrdersModal = {
  isAssignmentFailedOrdersModalOpen: true,
  setIsAssignmentFailedOrdersModalOpen: jest.fn(),
  setIsPreviewModalOpen: jest.fn(),
  handleAddOrdersToBatch: jest.fn(),
  orders: [
    {
      createdState: SalesOrderCreatedState.None,
      salesOrderId: 'aea22171-3405-4320-8890-ed502db4f113',
      referenceNumber: 'Order-146',
      operationImageUrl: 'https://maestrointst.blob.core.windows.net/operation-logos/rossmann.png',
      operationName: 'Rossmann',
      state: SalesOrderState.Cancelled,
    },
    {
      createdState: SalesOrderCreatedState.None,
      salesOrderId: 'cb931f55-51d8-4ce9-81c3-fbc358d8f1d2',
      referenceNumber: 'Order-145',
      operationImageUrl: 'https://maestrointst.blob.core.windows.net/operation-logos/rossmann.png',
      operationName: 'Rossmann',
      state: SalesOrderState.Cancelled,
    },
  ],
};

describe('Assignment Failed Orders Modal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the component', () => {
    render(<MockAssignmentFailedOrdersModal {...mockModalProps} />);

    expect(screen.getAllByText(`Enum.${mockModalProps.orders[0].state}`).length).toBe(2);
  });

  it('should not close the modal', () => {
    render(<MockAssignmentFailedOrdersModal {...mockModalProps} />);
    fireEvent.keyDown(window, { key: 'Escape', code: '27' });
    expect(mockModalProps.setIsAssignmentFailedOrdersModalOpen).not.toBeCalled();
    expect(mockModalProps.isAssignmentFailedOrdersModalOpen).toBeTruthy();

    fireEvent.click(document.body);
    expect(mockModalProps.setIsAssignmentFailedOrdersModalOpen).not.toBeCalled();
    expect(mockModalProps.isAssignmentFailedOrdersModalOpen).toBeTruthy();
  });

  it('should close the modal and call handleAddToSelectedOrders', () => {
    render(<MockAssignmentFailedOrdersModal {...mockModalProps} />);
    fireEvent.click(screen.getByText('Modal.Success.Okay'));

    expect(mockModalProps.setIsAssignmentFailedOrdersModalOpen).toBeCalledWith(false);
    expect(mockModalProps.setIsPreviewModalOpen).not.toBeCalled();
    expect(mockModalProps.handleAddOrdersToBatch).toBeCalled();
  });

  it('should call setIsPreviewModalOpen', () => {
    const component = MockAssignmentFailedOrdersModal(mockModalProps, {
      ...{
        resources: {
          ...initialState.resources,
          [ResourceType.PreviewManualPicklist]: {
            data: {},
          },
        },
      },
    });
    render(component);
    fireEvent.click(screen.getByText('Modal.Success.Okay'));

    expect(mockModalProps.setIsAssignmentFailedOrdersModalOpen).toBeCalledWith(false);
    expect(mockModalProps.setIsPreviewModalOpen).toBeCalledWith(true);
    expect(mockModalProps.handleAddOrdersToBatch).not.toBeCalled();
  });
});
