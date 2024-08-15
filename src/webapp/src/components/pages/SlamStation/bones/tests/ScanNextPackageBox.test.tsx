import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import ScanNextPackageBox, { ScanNextPackageBoxInterface } from '../ScanNextPackageBox';
import '@testing-library/jest-dom';
import { renderWithRedux } from '../../../../../utils/testUtils';

let mockProps: ScanNextPackageBoxInterface;

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

describe('ScanNextPackageBox', () => {
  beforeEach(() => {
    mockProps = { getBarcodeDataFromScreenKeyboard: () => null };
  });
  test('it opens screen keyboard on button click', () => {
    renderWithRedux(<ScanNextPackageBox {...mockProps} />);
    fireEvent.click(screen.getByTestId('openCloseKeyboard'));
    expect(screen.getByText('Caps Lock')).toBeVisible();
    expect(screen.getByText('Backspace')).toBeVisible();
  });

  test('it does not show screen keyboard on initial render', () => {
    renderWithRedux(<ScanNextPackageBox {...mockProps} />);
    expect(screen.queryByText('Caps Lock')).toBeFalsy();
    expect(screen.queryByText('Backspace')).toBeFalsy();
  });
});
