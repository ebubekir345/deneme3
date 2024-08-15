import React from 'react';
import { Problems, IProblemsProps } from '../Problems';
import { screen } from '@testing-library/dom';
import { renderWithRedux, createWithRedux } from '../../../../../utils/testUtils';
import { Status } from '../ProblemColumn';
import { Box, Icon } from '@oplog/express';
import { ProblemType } from '../../../../molecules/TouchScreen/ProblemScanStatusColumn';

let props: IProblemsProps;
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

describe('Problems', () => {
  beforeEach(() => {
    props = {
      solveStatus: Status.NotSolved,
      problems: [{ id: 'mockId', referenceNumber: 'mockRef', problemType: 'CargoCarrierPreferenceProblem' }],
      type: ProblemType.SalesOrderProblem,
    };
  });

  test('it shows grey box color and correct icon if it is on notSolved problems column', () => {
    const component = createWithRedux(<Problems {...props} />);
    expect(component.root.findAllByType(Box)[1].props.bg).toBe('palette.snow_darker');
    expect(component.root.findAllByType(Icon)[0].props.name).toBe('fal fa-clock');
  });
  test('it shows blue box color if it is on inProcess problems column', () => {
    props = { ...props, solveStatus: Status.InSolvingProcess };
    const component = createWithRedux(<Problems {...props} />);
    expect(component.root.findAllByType(Box)[1].props.bg).toBe('#9dbff9');
    expect(component.root.findAllByType(Icon)[0].props.name).toBe('fal fa-phone');
  });
  test('it shows green box color if it is on solved problems column', () => {
    props = { ...props, solveStatus: Status.Solved };
    const component = createWithRedux(<Problems {...props} />);
    expect(component.root.findAllByType(Box)[1].props.bg).toBe('palette.hardGreen');
    expect(component.root.findAllByType(Icon)[0].props.name).toBe('fal fa-check');
  });
  test('it shows correct ref number and problem type according to props', () => {
    renderWithRedux(<Problems {...props} />);
    expect(screen.getByText('Enum.CargoCarrierPreferenceProblem')).toBeTruthy();
    expect(screen.getByText('mockRef')).toBeTruthy();
  });
});
