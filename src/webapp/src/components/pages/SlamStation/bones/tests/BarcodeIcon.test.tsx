import React from 'react';
import { create } from 'react-test-renderer';
import { Icon } from '@oplog/express';
import BarcodeIcon, { StatusEnum } from '../BarcodeIcon';

let mockStatus;

describe('BarcodeIcon', () => {
  beforeEach(() => {
    mockStatus = StatusEnum.Success;
  });

  it('display correct barcode according to status', () => {
    const component = create(<BarcodeIcon status={mockStatus} />);
    const instance = component.root;
    expect(instance.findByType(Icon).props.name).toBe('fas fa-barcode-scan');
    mockStatus = StatusEnum.Cancelled;
    component.update(<BarcodeIcon status={mockStatus} />);
    expect(instance.findByType(Icon).props.name).toBe('far fa-times-circle');
  });
});
