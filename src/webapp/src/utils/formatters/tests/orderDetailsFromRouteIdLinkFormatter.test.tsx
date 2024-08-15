import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormatterProps } from '@oplog/data-grid';
import { create } from 'react-test-renderer';
import { Text } from '@oplog/express';
import history from '../../../history';
import { orderDetailsFromRouteIdLinkFormatter } from '../orderDetailsFromRouteIdLinkFormatter';

let props: FormatterProps;

describe('orderDetailsFromRouteIdLinkFormatter', () => {
  beforeEach(() => {
    props = {
      value: 'mock',
      dependentValues: { id: 'order-2' },
    };
  });
  test('it navigates to order details page via given id', () => {
    history.push = jest.fn();
    render(orderDetailsFromRouteIdLinkFormatter(props));
    fireEvent.click(screen.getByText(props.value));
    expect(history.push).toBeCalledWith(`/order-details/${props.dependentValues.id}/:tab?`);
  });
  test('it does not navigate to order details page if id is not given', () => {
    props = { ...props, dependentValues: {} };
    history.push = jest.fn();
    render(orderDetailsFromRouteIdLinkFormatter(props));
    fireEvent.click(screen.getByText(props.value));
    expect(history.push).not.toBeCalled();
  });
  test('it displays blue link if id is given', () => {
    const component = create(orderDetailsFromRouteIdLinkFormatter(props));
    expect(component.root.findAllByType(Text)[0].props.color).toBe(`text.link`);
  });
  test('it displays grey text if id is not given', () => {
    props = { ...props, dependentValues: {} };
    const component = create(orderDetailsFromRouteIdLinkFormatter(props));
    expect(component.root.findAllByType(Text)[0].props.color).toBe(`palette.grey`);
  });
  test('it shows cursor as pointer if id is given', () => {
    const component = create(orderDetailsFromRouteIdLinkFormatter(props));
    expect(component.root.findAllByType(Text)[0].props.cursor).toBe(`pointer`);
  });
  test('it does not show cursor as pointer if id is not given', () => {
    props = { ...props, dependentValues: {} };
    const component = create(orderDetailsFromRouteIdLinkFormatter(props));
    expect(component.root.findAllByType(Text)[0].props.cursor).toBe(undefined);
  });
});
