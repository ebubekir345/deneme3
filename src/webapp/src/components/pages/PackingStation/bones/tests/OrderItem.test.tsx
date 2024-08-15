import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { create } from 'react-test-renderer';
import { Box } from '@oplog/express';
import OrderItem from '../OrderItem';
import { initialPackingState, IPackingStore } from '../../../../../store/global/packingStore';
import { ProgressBar } from '../../../../atoms/TouchScreen';

let mockPackingState: IPackingStore;
jest.mock('../../../../../store/global/packingStore', () => {
  return jest.fn(() => [mockPackingState]);
});
let mockProduct: any;

jest.mock('use-resize-observer', () => () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
  ref: { current: 'Ref' },
}));

describe('OrderItem', () => {
  beforeEach(() => {
    mockPackingState = { ...initialPackingState };
    mockProduct = {
      productId: '111',
      productName: 'MaestroProduct',
      sku: 'SKU-1',
      barcodes: ['Barcode-1', 'Barcode-2'],
      imageUrl: 'http://image.url',
      amountInOrder: 5,
      boxedCount: 3,
    };
  });

  it('sends props to progress bar correctly', () => {
    const component = create(<OrderItem product={mockProduct} onImageClicked={() => null} />);
    const instance = component.root;
    expect(instance.findByType(ProgressBar).props.current).toBe(mockProduct.boxedCount);
    expect(instance.findByType(ProgressBar).props.total).toBe(mockProduct.amountInOrder);
  });

  it('hides progress bar when left bar is expanded', () => {
    mockPackingState.isLeftBarExpanded = true;
    render(<OrderItem product={mockProduct} onImageClicked={() => null} />);
    expect(screen.queryByText(mockProduct.barcodes.join())).toEqual(null);
  });

  it('sets opacity level according to product boxed count', () => {
    render(<OrderItem product={mockProduct} onImageClicked={() => null} />);
    const component = create(<OrderItem product={mockProduct} onImageClicked={() => null} />);
    const instance = component.root;
    expect(instance.findAllByType(Box)[0].props.opacity).toBe(1);
    mockProduct.boxedCount = 5;
    component.update(<OrderItem product={mockProduct} onImageClicked={() => null} />);
    expect(instance.findAllByType(Box)[0].props.opacity).toBe(0.5);
  });

  it('calls onImageClick prop on image click', () => {
    const onImageClicked = jest.fn();
    render(<OrderItem product={mockProduct} onImageClicked={onImageClicked} />);

    fireEvent.click(screen.getByRole('img'));
    expect(onImageClicked).toHaveBeenCalled();
  });

  it('displays product current status', () => {
    render(<OrderItem product={mockProduct} onImageClicked={() => null} />);
    expect(screen.getByText(`${mockProduct.boxedCount} / ${mockProduct.amountInOrder}`)).toBeTruthy();
  });
});
