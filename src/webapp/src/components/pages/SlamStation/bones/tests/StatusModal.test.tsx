import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusModal, { StatusModalInterface } from '../StatusModal';
import { renderWithRedux } from '../../../../../utils/testUtils';

let mockProps: StatusModalInterface;

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
describe('StatusModal', () => {
  beforeEach(() => {
    mockProps = {
      isOpen: false,
      onClose: () => null,
      message: 'Message being sent correctly',
    };
  });
  test('it shows correct message when opened', () => {
    renderWithRedux(<StatusModal {...mockProps} isOpen />);
    expect(screen.getByText(/Message being sent correctly/)).toBeInTheDocument();
  });

  test('it opens and closes according to props', () => {
    const { rerender } = renderWithRedux(<StatusModal {...mockProps} isOpen />);
    expect(screen.queryByRole('button')).toBeInTheDocument();
    rerender(<StatusModal {...mockProps} isOpen={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
