import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormatterProps } from '@oplog/data-grid';
import { appendImageToTextFieldFormatter } from '../appendImageToTextFieldFormatter';

let props: FormatterProps;

describe('appendImageToTextFieldFormatter ', () => {
  beforeEach(() => {
    props = {
      value: '',
      dependentValues: { imageProperty: 'operationImage' },
    };
  });
  test('it displays an image on a datagrid text field', () => {
    render(appendImageToTextFieldFormatter(props, 'imageProperty'));
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });
});
