/* eslint-disable import/no-named-as-default */
import { Modal, ThemeProvider } from '@oplog/express';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl-redux';
import Skeleton from 'react-loading-skeleton';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { PickingTrolleySalesOrderState } from '../../../../services/swagger';
import { mockStoreWithState } from '../../../../store/configure.mock';
import { initialState, StoreState } from '../../../../store/initState';
import theme from '../../../../theme';
import { locale } from '../../../../utils/testUtils';
import { DqbPaginationFooter } from '../../../molecules/DqbPaginationFooter';
import ModalFancyHeader from '../../../molecules/ModalFancyHeader';
import ToteBox from '../bones/ToteBox';
import { ITrolleyModal, TrolleyModal } from '../TrolleyModal';

const createWithReduxIntl = (node: React.ReactNode, mockState?: Partial<StoreState>) => {
  let store = mockStoreWithState({ ...initialState, ...mockState });

  return create(
    <ThemeProvider customTheme={theme as any}>
      <Provider store={store}>
        <IntlProvider {...locale}>{node}</IntlProvider>
      </Provider>
    </ThemeProvider>
  );
};

let mockHistory: any;
let mockProps: ITrolleyModal;

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
  useDispatch: jest.fn(() => mockDispatch),
}));

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: () => mockHistory,
}));

describe('TrolleyModal', () => {
  beforeEach(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    }) as any;
    mockProps = {
      trolleyLabel: 'test-trl',
      isOpen: true,
      onClose: jest.fn(),
    };
  });

  test('calls on onClose callback on close button click', () => {
    const component = createWithReduxIntl(<TrolleyModal {...mockProps} />);
    component.root.findByType(Modal).props.onClose();
    expect(mockProps.onClose).toHaveBeenCalled();
    component.root.findByType(ModalFancyHeader).props.onClose();
    expect(mockProps.onClose).toHaveBeenCalledTimes(2);
  });

  test('pass resource data to component props correctly', () => {
    const component = createWithReduxIntl(<TrolleyModal {...mockProps} />, {
      resources: {
        ...initialState.resources,
        getPickingTrolleyDetails: {
          isBusy: false,
          data: {
            label: 'Test-Trl-1',
            percentage: 25,
            operatorName: 'Test Operator',
            lastSeenAddress: 'Test-Adress',
            state: PickingTrolleySalesOrderState.Picking,
            totalToteCount: 40,
          },
          error: undefined,
        },
      },
      grid: {
        ...initialState.grid,
        'Vehicles.queryPickingTrolleyPickingTotes': {
          ...initialState.grid['Vehicles.queryPickingTrolleyPickingTotes'],
          isBusy: false,
          data: [
            {
              label: 'Test-Tote-1',
              totalItemAmount: 3,
              totalLineItemAmount: 5,
              salesOrderId: 'order-id',
              salesOrderReferenceNumber: 'order-ref-number',
            } as any,
          ],
        },
      },
    });
    expect(component.root.findByType(ModalFancyHeader).props.title).toBe('Test-Trl-1');
    expect(component.root.findByType(ModalFancyHeader).props.isBusy).toBe(false);
    expect(component.root.findByType(ModalFancyHeader).props.content.length).toBe(3);
    expect(component.root.findAllByType(ToteBox)[0].props.title).toBe('Test-Tote-1');
    expect(component.root.findAllByType(ToteBox)[0].props.current).toBe(3);
    expect(component.root.findAllByType(ToteBox)[0].props.total).toBe(5);
    expect(component.root.findAllByType(ToteBox)[0].props.orderId).toBe('order-id');
    expect(component.root.findAllByType(ToteBox)[0].props.orderName).toBe('order-ref-number');
  });

  test('it displays skelaton for toteBoxes when resource isBusy', () => {
    const component = createWithReduxIntl(<TrolleyModal {...mockProps} />, {
      ...initialState,
      grid: {
        ...initialState.grid,
        'Vehicles.queryPickingTrolleyPickingTotes': {
          ...initialState.grid['Vehicles.queryPickingTrolleyPickingTotes'],
          isBusy: true,
          data: [],
        },
      },
    });
    expect(component.root.findAllByType(Skeleton).length).toBe(20);
    expect(component.root.findAllByType(ToteBox)[0]).toBeFalsy();

    const component2 = createWithReduxIntl(<TrolleyModal {...mockProps} />, {
      ...initialState,
      grid: {
        ...initialState.grid,
        'Vehicles.queryPickingTrolleyPickingTotes': {
          ...initialState.grid['Vehicles.queryPickingTrolleyPickingTotes'],
          isBusy: false,
          data: [
            {
              label: 'Test-Tote-1',
              totalItemAmount: 3,
              totalLineItemAmount: 5,
              salesOrderId: 'order-id',
              salesOrderReferenceNumber: 'order-ref-number',
            } as any,
          ],
        },
      },
    });
    expect(component2.root.findAllByType(Skeleton)[0]).toBeFalsy();
    expect(component2.root.findAllByType(ToteBox).length).toBe(1);
  });

  test('it calls onPaginationChange callback from footer prop callback', () => {
    const component = createWithReduxIntl(<TrolleyModal {...mockProps} />);
    component.root.findByType(DqbPaginationFooter).props.handlePageNumberChange(2);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
