import React from 'react';
import { AddNewProblem, IAddNewProblemProps } from '../AddNewProblem';
import { renderWithRedux } from '../../../../../utils/testUtils';
import { fireEvent, screen } from '@testing-library/dom';

let props: IAddNewProblemProps;

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
describe('AddNewProblem', () => {
  beforeEach(() => {
    props = { salesOrderId: 'sales-order' };
  });

  test('it opens a modal where you can add a new problem', () => {
    renderWithRedux(<AddNewProblem {...props} />);
    fireEvent.click(screen.getByTestId('new-problem-button'));
    expect(screen.getByTestId('add-problem-modal')).toBeTruthy();
  });
});
