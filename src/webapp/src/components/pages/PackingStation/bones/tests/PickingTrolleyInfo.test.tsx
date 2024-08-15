import { ThemeProvider } from '@oplog/express';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { act, create } from 'react-test-renderer';
import { PickingTrolleySalesOrderState } from '../../../../../services/swagger';
import { mockStoreWithState } from '../../../../../store/configure.mock';
import { initialState, StoreState } from '../../../../../store/initState';
import theme from '../../../../../theme';
import { createWithRedux, locale } from '../../../../../utils/testUtils';
import { ActionButton, ProgressBar } from '../../../../atoms/TouchScreen';
import { TrolleyModal } from '../../../../organisms/TrolleyModal';
import { PickingTrolleyInfo } from '../PickingTrolleyInfo';

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

let component;

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
describe('PickingTrolleyInfo', () => {
  beforeEach(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    }) as any;
  });

  it('displays no label and 0 percentage when there is no pickingTrolleyDetails data', () => {
    component = createWithRedux(<PickingTrolleyInfo />);
    expect(component.root.findAllByType('span')[1].props.children).toEqual('');
    expect(component.root.findByType(ProgressBar).props.current).toBe(0);
    expect(component.root.findByType(TrolleyModal).props.trolleyLabel).toBe('');
  });

  it('passes pickingTrolleyDetails data when is available', () => {
    component = createWithRedux(<PickingTrolleyInfo />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getPickingTrolleyDetails: {
          ...initialState.resources.getPickingTrolleyDetails,
          isSuccess: true,
          data: {
            label: 'Test-Trolley',
            percentage: 50,
            operatorName: 'test-operator',
            lastSeenAddress: 'PAKETLEME-ALANI',
            state: PickingTrolleySalesOrderState.Packing,
            totalToteCount: 20,
          },
        },
      },
    });
    expect(component.root.findAllByType('span')[1].props.children).toEqual('Test-Trolley');
    expect(component.root.findByType(ProgressBar).props.current).toBe(50);
    expect(component.root.findByType(TrolleyModal).props.trolleyLabel).toBe('Test-Trolley');
  });

  it('opens trolley modal on button click and closes it when onClose callback called from TrolleyModal', () => {
    component = createWithReduxIntl(<PickingTrolleyInfo />);
    expect(component.root.findByType(TrolleyModal).props.isOpen).toBe(false);
    act(() => {
      component.root.findByType(ActionButton).props.onClick();
    });
    expect(component.root.findByType(TrolleyModal).props.isOpen).toBe(true);
    act(() => {
      component.root.findByType(TrolleyModal).props.onClose();
    });
    expect(component.root.findByType(TrolleyModal).props.isOpen).toBe(false);
  });
});
