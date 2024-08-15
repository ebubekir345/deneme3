import React from 'react';
import { Widget } from '@oplog/express';
import { InfoPanels } from '../InfoPanels';
import { createWithRedux } from '../../../../../utils/testUtils';
import { initialState } from '../../../../../store/initState';

let component;

jest.mock('use-resize-observer', () => () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
  ref: { current: 'Ref' },
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ id: '123' }),
}));

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
describe('InfoPanels', () => {
  it('displays no data status in the infoboxes when no data fetched', () => {
    component = createWithRedux(<InfoPanels />);
    expect(component.root.findAllByType(Widget.Two)[0].props.title.props.children).toEqual('');
    expect(component.root.findAllByType(Widget.Two)[1].props.title.props.children).toEqual('');

    expect(component.root.findAllByType(Widget.Two)[2].props.title.props.children[0].props.children).toEqual('');
    expect(component.root.findAllByType(Widget.Two)[2].props.title.props.children[4].props.children).toEqual('');

    expect(component.root.findAllByType(Widget.Two)[3].props.title.props.children[1].props.children).toEqual('');
    expect(component.root.findAllByType(Widget.Two)[3].props.title.props.children[1].props.children).toEqual('');
    expect(component.root.findAllByType(Widget.Two)[3].props.iconName).toBe(undefined);
    expect(component.root.findAllByType(Widget.Two)[3].props.icon.props.name).toBe('fal fa-hand-holding-box');
  });

  it('displays infoboxes with correct forms with the resource data', () => {
    component = createWithRedux(<InfoPanels />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        shipmentDetails: {
          ...initialState.resources.shipmentDetails,
          isSuccess: true,
          data: {
            carrierName: 'UPS',
            trackingId: 'test-tracking-id',
            carrierImageUrl: 'test-url',
            shippingMethod: 'SenderPays',
          },
        },
        recipientAddressDetails: {
          ...initialState.resources.recipientAddressDetails,
          isSuccess: true,
          data: {
            salesOrderReferenceNumber: 'order-1',
            customerFullName: 'Test Customer',
            recipientFullName: 'Test Recipient',
            recipientFullAddress: 'Test Adress',
          },
        },
      },
    });
    expect(component.root.findAllByType(Widget.Two)[0].props.title.props.children).toEqual(`#order-1`);
    expect(component.root.findAllByType(Widget.Two)[1].props.title.props.children).toEqual('Test Customer');

    expect(component.root.findAllByType(Widget.Two)[2].props.title.props.children[0].props.children).toEqual(
      'Test Recipient'
    );
    expect(component.root.findAllByType(Widget.Two)[2].props.title.props.children[4].props.children).toEqual(
      'Test Adress'
    );

    expect(component.root.findAllByType(Widget.Two)[3].props.title.props.children[0].props.children).toEqual(
      'OrderDetails.ShippingMethod.SenderPays'
    );
    expect(component.root.findAllByType(Widget.Two)[3].props.title.props.children[1].props.children).toEqual(
      'test-tracking-id'
    );
    expect(component.root.findAllByType(Widget.Two)[3].props.iconName).toBe(undefined);
    expect(component.root.findAllByType(Widget.Two)[3].props.icon.props.src).toBe('test-url');
  });

  it('displays suspention error message', () => {
    component = createWithRedux(<InfoPanels />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        shipmentDetails: {
          ...initialState.resources.shipmentDetails,
          isSuccess: true,
          data: {
            carrierName: 'UPS',
            suspentionErrorMessage: 'Test suspention error',
          },
        },
      },
    });

    expect(component.root.findAllByType(Widget.Two)[3].props.title.props.children[1].props.children).toEqual(
      'Test suspention error'
    );
    expect(component.root.findAllByType(Widget.Two)[3].props.icon.props.name).toBe('fal fa-hand-holding-box');
  });

  it('displays "has no cargo carrier" suspention error message', () => {
    component = createWithRedux(<InfoPanels />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        shipmentDetails: {
          ...initialState.resources.shipmentDetails,
          isSuccess: true,
          data: {
            carrierName: 'UPS',
            suspentionErrorMessage: 'Operation lacks available carrier preference',
          },
        },
      },
    });
    expect(component.root.findAllByType(Widget.Two)[3].props.title.props.children[1].props.children).toEqual(
      'OrderDetails.NoCarrierPreference'
    );
    expect(component.root.findAllByType(Widget.Two)[3].props.icon.props.name).toBe('fal fa-question-circle');
  });

  it('passes loading status to Widget.Two', () => {
    component = createWithRedux(<InfoPanels />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        shipmentDetails: {
          ...initialState.resources.shipmentDetails,
          isBusy: false,
        },
        recipientAddressDetails: {
          ...initialState.resources.recipientAddressDetails,
          isBusy: false,
        },
      },
    });
    expect(component.root.findAllByType(Widget.Two)[0].props.isLoading).toEqual(false);
    expect(component.root.findAllByType(Widget.Two)[1].props.isLoading).toEqual(false);
    expect(component.root.findAllByType(Widget.Two)[2].props.isLoading).toEqual(false);
    expect(component.root.findAllByType(Widget.Two)[3].props.isLoading).toEqual(false);

    component = createWithRedux(<InfoPanels />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        shipmentDetails: {
          ...initialState.resources.shipmentDetails,
          isBusy: true,
        },
        recipientAddressDetails: {
          ...initialState.resources.recipientAddressDetails,
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Widget.Two)[0].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[1].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[2].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[3].props.isLoading).toEqual(true);

    component = createWithRedux(<InfoPanels />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        shipmentDetails: {
          ...initialState.resources.shipmentDetails,
          isBusy: false,
        },
        recipientAddressDetails: {
          ...initialState.resources.recipientAddressDetails,
          isBusy: true,
        },
      },
    });
    expect(component.root.findAllByType(Widget.Two)[0].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[1].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[2].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[3].props.isLoading).toEqual(true);

    component = createWithRedux(<InfoPanels />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        shipmentDetails: {
          ...initialState.resources.shipmentDetails,
          isBusy: true,
        },
        recipientAddressDetails: {
          ...initialState.resources.recipientAddressDetails,
          isBusy: false,
        },
      },
    });
    expect(component.root.findAllByType(Widget.Two)[0].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[1].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[2].props.isLoading).toEqual(true);
    expect(component.root.findAllByType(Widget.Two)[3].props.isLoading).toEqual(true);
  });
});
