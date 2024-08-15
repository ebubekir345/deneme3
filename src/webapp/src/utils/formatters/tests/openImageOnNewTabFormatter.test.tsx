import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormatterProps } from '@oplog/data-grid';
import { openImageOnNewTabFormatter } from '../openImageOnNewTabFormatter';

let props: FormatterProps;

describe('openImageOnNewTabFormatter', () => {
  beforeEach(() => {
    props = {
      value: 'imageUrl',
      dependentValues: {},
    };
  });
  test('it shows an small image and if image is clicked it will open a new tab with given image URL', () => {
    window.open = jest.fn();
    render(openImageOnNewTabFormatter(props));
    fireEvent.click(screen.getByRole('img'));
    expect(window.open).toBeCalledWith(props.value, '_blank');
  });
});
