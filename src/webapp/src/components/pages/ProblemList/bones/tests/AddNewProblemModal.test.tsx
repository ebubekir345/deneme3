import React from 'react';
import { AddNewProblemModal, IAddNewProblemModalProps } from '../AddNewProblemModal';
import { fireEvent, screen } from '@testing-library/dom';
import { intl, renderWithRedux } from '../../../../../utils/testUtils';

let props: IAddNewProblemModalProps;

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
let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as object),
  useDispatch: jest.fn(() => mockDispatch),
}));

describe('AddNewProblemModal', () => {
  beforeEach(() => {
    props = {
      isOpen: true,
      onClose: jest.fn(),
      salesOrderId: 'sales-order',
    };
  });

  test('it will be mounted if isOpen is true', () => {
    renderWithRedux(<AddNewProblemModal {...props} />);
    expect(screen.getByTestId('add-problem-modal')).toBeTruthy();
  });

  test('it opens add problem dropdown', () => {
    renderWithRedux(<AddNewProblemModal {...props} />);
    fireEvent.click(screen.getByTestId('dropdown-initial'));
    expect(screen.getByText(`Enum.MissingSLAMLabelProblem`)).toBeTruthy();
  });
});
