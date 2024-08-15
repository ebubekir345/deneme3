import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormatterProps } from '@oplog/data-grid';
import { cargoImageFormatterForDispatchManagement } from '../cargoImageFormatterForDispatchManagement';

let props: FormatterProps;

describe('cargoImageFormatterForDispatchManagement', () => {
  beforeEach(() => {
    props = {
      value: 'N/A',
      dependentValues: { totalCargoPackageCount: 0 },
    };
  });
  test('it displays question mark icon when there is no cargo carrier', () => {
    render(cargoImageFormatterForDispatchManagement(props));
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
  test('it displays dimmed cargo image when total cargo package count is 0', () => {
    props = { ...props, value: 'MNG' };
    render(cargoImageFormatterForDispatchManagement(props));
    expect(screen.getByRole('img')).toHaveStyle('filter: grayscale(100%);');
  });
  test('it displays dimmed cargo image if not all the packages of the order are slammed', () => {
    props = { value: 'MNG', dependentValues: { totalCargoPackageCount: 10, totalSLAMSuccessfulCargoPackageCount: 5 } };
    render(cargoImageFormatterForDispatchManagement(props));
    expect(screen.getByRole('img')).toHaveStyle('filter: grayscale(100%);');
  });
  test('it displays regular cargo image if all the packages of the order are slammed', () => {
    props = { value: 'MNG', dependentValues: { totalCargoPackageCount: 10, totalSLAMSuccessfulCargoPackageCount: 10 } };
    render(cargoImageFormatterForDispatchManagement(props));
    expect(screen.getByRole('img')).not.toHaveStyle('filter: grayscale(100%);');
  });
});
