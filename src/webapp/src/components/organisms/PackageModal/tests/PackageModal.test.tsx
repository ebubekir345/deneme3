import { Modal, ThemeProvider } from '@oplog/express';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl-redux';
import Skeleton from 'react-loading-skeleton';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { GridType } from '../../../../models';
import { mockStoreWithState } from '../../../../store/configure.mock';
import { initialState, StoreState } from '../../../../store/initState';
import theme from '../../../../theme';
import { locale } from '../../../../utils/testUtils';
import ModalFancyHeader from '../../../molecules/ModalFancyHeader';
import { IPackageModal, PackageModal } from '../PackageModal';

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

let mockLocation: any = {
  pathname: '/receiving/:view/packages',
  hash: '',
  search:
    '?dqb=%7B%22appliedFilters%22%3A%5B%5D%2C%22pagination%22%3A%7B%22offset%22%3A0%2C%22count%22%3A25%7D%2C%22query%22%3A%22%26offset%3D0%26count%3D25%22%7D',
  state: undefined,
  key: 'e1cgk3',
};
let mockProps: IPackageModal;

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
  useHistory: () => ({
    push: jest.fn(),
  }),
  useLocation: jest.fn().mockReturnValue(mockLocation),
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

describe('PackageModal', () => {
  beforeEach(() => {
    ReactDOM.createPortal = jest.fn(element => {
      return element;
    }) as any;
    mockProps = {
      label: 'MK-SEPETI-1',
      isOpen: true,
      onClose: jest.fn(),
    };
  });

  test('calls onClose callback on close button click', () => {
    const component = createWithReduxIntl(<PackageModal {...mockProps} />);
    component.root.findByType(Modal).props.onClose();
    expect(mockProps.onClose).toHaveBeenCalled();
    component.root.findByType(ModalFancyHeader).props.onClose();
    expect(mockProps.onClose).toHaveBeenCalledTimes(2);
  });

  test('pass resource and grid data to components correctly', () => {
    const component = createWithReduxIntl(<PackageModal {...mockProps} />, {
      resources: {
        ...initialState.resources,
        packageDetails: {
          isBusy: false,
          data: {
            inboundBoxLabel: 'MK-SEPETI-1',
            operationImageUrl: 'https://maestrointst.blob.core.windows.net/operation-logos/rossmann.png',
            operationName: 'Rossmann',
            purchaseOrderReferenceNumber: 'PO-13',
            waybillReferenceNumber: 'Waybill-8',
          },
        },
      },
      grid: {
        ...initialState.grid,
        [GridType.PackageGridDetails]: {
          ...initialState.grid[GridType.PackageGridDetails],
          isBusy: false,
          data: [
            {
              barcodes: 'Barcode-1',
              productImageUrl: 'http://placeimg.com/150/150/tech',
              productName: 'Handcrafted Granite Hat',
              productSKU: 'SKU-1',
              quarantineAmount: 1,
              receivedAmount: 2,
              totalAmount: 3,
            } as any,
          ],
        },
      },
    });
    expect(component.root.findByType(ModalFancyHeader).props.title).toBe('MK-SEPETI-1');
    expect(component.root.findByType(ModalFancyHeader).props.isBusy).toBe(false);
    expect(component.root.findByType(ModalFancyHeader).props.content.length).toBe(3);
  });

  test('it displays skeleton for data when request is isBusy', () => {
    const component = createWithReduxIntl(<PackageModal {...mockProps} />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        packageDetails: {
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Skeleton).length).toBe(3);
  });
});
