import React from 'react';
import { ProblemColumn, IProblemColumnProps, Status } from '../ProblemColumn';
import { screen } from '@testing-library/dom';
import { renderWithRedux } from '../../../../../utils/testUtils';
import { ProblemType } from '../../../../molecules/TouchScreen/ProblemScanStatusColumn';

let props: IProblemColumnProps;

let mockHistory: any;
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useParams: () => ({
    id: 'mock',
    sourceType: 'mock1',
  }),
  useHistory: () => mockHistory,
}));
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

describe('ProblemColumn', () => {
  beforeEach(() => {
    props = {
      problems: undefined,
      solveStatus: Status.Solved,
      title: 'mockTitle',
      type: ProblemType.SalesOrderProblem,
    };
  });

  test('it will show the correct column title', () => {
    renderWithRedux(<ProblemColumn {...props} />);
    expect(screen.getByText('mockTitle')).toBeTruthy();
  });
});
