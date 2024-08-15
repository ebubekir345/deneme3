import { resourceActions } from '@oplog/resource-redux';
import { screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { ResourceType } from '../../../../../models';
import initialState from '../../../../../store/initState';
import { renderWithRedux } from '../../../../../utils/testUtils';
import { OrderProblemList } from '../OrderProblemList';

const intlKey = 'TouchScreen.ProblemSolver';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useParams: () => ({
    id: 'PRB-1',
  }),
}));
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
let mockHistory: any;
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useParams: () => ({
    id: 'PRB-1',
  }),
  useHistory: () => mockHistory,
}));
let mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as object),
  useDispatch: jest.fn(() => mockDispatch),
}));

describe('OrderProblemList', () => {
  test('it calls necessary actions on mount', () => {
    jest.useFakeTimers();
    renderWithRedux(<OrderProblemList />);
    act(() => {
      jest.runAllTimers();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetSalesOrderProblemDetails, { id: 'PRB-1' })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetCreatedProblems, { id: 'PRB-1' })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetInProgressProblems, { id: 'PRB-1' })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetResolvedProblems, { id: 'PRB-1' })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      resourceActions.resourceRequested(ResourceType.GetSalesOrderStateDetail, { id: 'PRB-1' })
    );
  });
  test('it calls onWillUnmount action when unmounted', () => {
    const { unmount } = renderWithRedux(<OrderProblemList />);
    unmount();
    expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceInit(ResourceType.GetSalesOrderProblemDetails));
  });
  test('it shows an error message if sales order details arent fetched properly', () => {
    renderWithRedux(<OrderProblemList />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getSalesOrderProblemDetails: {
          ...initialState.resources.getSalesOrderProblemDetails,
          error: true,
        },
      },
    });
    expect(screen.getByText(`${intlKey}.ProblemColumn.NotFound`)).toBeTruthy();
  });
});
