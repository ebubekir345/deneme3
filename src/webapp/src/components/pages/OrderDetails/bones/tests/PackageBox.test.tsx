import React from 'react';
import { Image } from '@oplog/express';
import { PackageBox, PackageBoxType } from '../PackageBox';
import { createWithRedux } from '../../../../../utils/testUtils';
import { Badge } from '../../../../atoms/TouchScreen';
import { ReturnPackageLineItemState } from '../../../../../services/swagger';

let props;
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
describe('PackageBox', () => {
  beforeEach(() => {
    props = {
      type: PackageBoxType.cargo,
      item: { containedItems: [], label: 'test-label', volumetricWeight: '10', state: 'WaitingForSLAM' },
    };
  });

  it('displays packageBox item with no contained Items', () => {
    component = createWithRedux(<PackageBox {...props} />);
    expect(component.root.findByProps({ mr: 12 }).props.children).toEqual(props.item.label);
    expect(component.root.findAllByType(Badge)[2].props.children).toEqual('OrderDetails.Packages.WaitingForSLAM');
    expect(component.root.findAllByType(Image)[0]).toBeFalsy();
    expect(component.root.findByProps({ color: 'palette.grey_lighter' }).props.children).toEqual(
      'OrderDetails.Packages.Empty'
    );
  });

  it('displays cargo packageBox item with contained Items', () => {
    props = {
      ...props,
      item: {
        ...props.item,
        containedItems: [
          {
            amount: 2,
            productImageUrl: 'test-product-image-url',
            productName: 'test-product-name',
            barcodes: 'test-barcode',
          },
          {
            amount: 1,
            productImageUrl: 'test-product-image-url-2',
            productName: 'test-product-name-2',
            barcodes: 'test-barcode-2',
          },
        ],
      },
    };
    component = createWithRedux(<PackageBox {...props} />);
    expect(component.root.findAllByType(Image)[0].props.src).toBe(props.item.containedItems[0].productImageUrl);
    expect(component.root.findAllByType(Image)[1].props.src).toBe(props.item.containedItems[1].productImageUrl);
    expect(component.root.findAllByProps({ textOverflow: 'ellipsis' })[0].props.children).toEqual(
      props.item.containedItems[0].productName
    );
    expect(component.root.findAllByProps({ maxWidth: 1000 })[0].props.children).toEqual(
      props.item.containedItems[0].barcodes
    );
    expect(component.root.findAllByProps({ textOverflow: 'ellipsis' })[2].props.children).toEqual(
      props.item.containedItems[1].productName
    );
    expect(component.root.findAllByProps({ maxWidth: 1000 })[1].props.children).toEqual(
      props.item.containedItems[1].barcodes
    );
    expect(component.root.findAllByProps({ fontFamily: 'SpaceMono' })[0].props.children).toEqual([
      'x',
      props.item.containedItems[0].amount,
    ]);
    expect(component.root.findAllByProps({ fontFamily: 'SpaceMono' })[3].props.children).toEqual([
      'x',
      props.item.containedItems[1].amount,
    ]);
    expect(component.root.findAllByProps({ color: 'palette.grey_lighter' })[0]).toBeFalsy();
  });
});
