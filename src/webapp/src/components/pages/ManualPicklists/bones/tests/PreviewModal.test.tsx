import { gridActions } from '@oplog/data-grid';
import { resourceActions } from '@oplog/resource-redux';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { GridType, ResourceType } from '../../../../../models';
import { PickingFlowTag, UnassignableOrders } from '../../../../../services/swagger';
import { mockStoreWithState } from '../../../../../store/configure.mock';
import initialState from '../../../../../store/initState';
import PreviewModal from '../PreviewModal';

const intlKey = 'ManualPicklists';

const MockPreviewModal = (mockProps?: any) => {
  let store = mockStoreWithState({
    ...initialState,
    ...mockProps,
  });
  return (
    <Provider store={store}>
      <PreviewModal />
    </Provider>
  );
};

let selectedSalesOrderIds: string[];
let setSelectedSalesOrderIds: Function;
jest.mock('../../../../../store/global/commonStore', () =>
  jest.fn(() => [{ selectedSalesOrderIds }, { setSelectedSalesOrderIds }])
);
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
  useDispatch: () => mockDispatch,
}));
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  Link: jest.fn().mockImplementation(({ to, children }) => <a href={to}>{children}</a>),
}));

let mockResponse = {
  resources: {
    [ResourceType.PreviewManualPicklist]: {
      isSuccess: true,
      data: {
        picklistTypeDetails: [
          {
            pickingFlowType: PickingFlowTag.Heavy,
            totalPicklistCount: 2,
            totalOrdersCount: 2,
            picklistDetails: [
              {
                pickingFlow: PickingFlowTag.Heavy,
                salesOrdersCount: 1,
                vehicleVariation: 'SingleItem',
                zoneName: 'FAST-MOVING-ZONE-01',
              },
              {
                pickingFlow: PickingFlowTag.Heavy,
                salesOrdersCount: 1,
                vehicleVariation: 'M',
                zoneName: 'FAST-MOVING-ZONE-02',
              },
            ],
          },
        ],
        assignmentFailedOrders: {
          unassignableOrders: [],
        },
      },
    },
  },
};
selectedSalesOrderIds = [];
setSelectedSalesOrderIds = jest.fn();

describe('PreviewModal', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders the component', () => {
    // render(<MockPreviewModal {...mockResponse} />);

    // expect(screen.getByText(`Enum.${PickingFlowTag.Heavy}`)).toBeInTheDocument();
    // expect(screen.getByText(`${intlKey}.PickListCount 1`)).toBeInTheDocument();
    // expect(screen.getByText(`${intlKey}.PickListCount 2`)).toBeInTheDocument();
    // expect(screen.getAllByText(text => text.endsWith(`${intlKey}.OrderAmount`)).length).toBe(3);
  });

  // it('shold create the manual picklist with no name', () => {
  //   render(<MockPreviewModal {...mockResponse} />);
  //   fireEvent.click(screen.getByText(`${intlKey}.Create`));

  //   expect(setSelectedSalesOrderIds).toHaveBeenCalledWith(
  //     selectedSalesOrderIds.filter(
  //       salesOrderId =>
  //         !mockResponse.resources[
  //           ResourceType.PreviewManualPicklist
  //         ].data.assignmentFailedOrders.unassignableOrders.some(
  //           (order: UnassignableOrders) => order.salesOrderId === salesOrderId
  //         )
  //     )
  //   );
  //   expect(mockDispatch).toHaveBeenCalledWith(
  //     resourceActions.resourceRequested(ResourceType.CreateManualPicklist, {
  //       payload: {
  //         salesOrderIds: selectedSalesOrderIds.filter(
  //           salesOrderId =>
  //             !mockResponse.resources[
  //               ResourceType.PreviewManualPicklist
  //             ].data.assignmentFailedOrders.unassignableOrders.some(
  //               (order: UnassignableOrders) => order.salesOrderId === salesOrderId
  //             )
  //         ),
  //         picklistRequestName: '',
  //       },
  //     })
  //   );
  //   expect(mockDispatch).toHaveBeenCalledWith(resourceActions.resourceInit(ResourceType.PreviewManualPicklist));
  // });

  // it('shold close the modal and initialize the responses', () => {
  //   jest
  //     .spyOn(React, 'useState')
  //     .mockReturnValueOnce(['', () => null])
  //     .mockReturnValueOnce([true, () => null]);
  //   render(<MockPreviewModal {...mockResponse} />);
  //   fireEvent.click(screen.getByText(`TouchScreen.ActionButtons.Return`));

  //   expect(jest.spyOn(React, 'useState')).toBeCalledWith(false);
  //   expect(jest.spyOn(React, 'useState')).toBeCalledWith('');
  //   expect(mockDispatch).toBeCalledWith(resourceActions.resourceInit(ResourceType.PreviewManualPicklist));
  //   expect(mockDispatch).toBeCalledWith(resourceActions.resourceInit(ResourceType.CreateManualPicklist));
  // });

  // it('shold create the manual picklist with a name', () => {
  //   render(<MockPreviewModal {...mockResponse} />);
  //   fireEvent.change(screen.getByTestId('input-box'), { target: { value: 'Test' } });
  //   fireEvent.click(screen.getByText(`${intlKey}.Create`));

  //   expect(mockDispatch).toHaveBeenCalledWith(
  //     resourceActions.resourceRequested(ResourceType.CreateManualPicklist, {
  //       payload: {
  //         salesOrderIds: selectedSalesOrderIds.filter(
  //           salesOrderId =>
  //             !mockResponse.resources[
  //               ResourceType.PreviewManualPicklist
  //             ].data.assignmentFailedOrders.unassignableOrders.some(
  //               (order: UnassignableOrders) => order.salesOrderId === salesOrderId
  //             )
  //         ),
  //         picklistRequestName: 'Test',
  //       },
  //     })
  //   );
  // });

  // it('shold call handleAddToSelectedOrders function', () => {
  //   jest.useFakeTimers();
  //   selectedSalesOrderIds = ['Test1', 'Test2'];
  //   render(
  //     <MockPreviewModal
  //       {...{
  //         resources: {
  //           ...mockResponse.resources,
  //           [ResourceType.CreateManualPicklist]: {
  //             isSuccess: true,
  //             data: {
  //               assignmentFailedOrders: {
  //                 unassignableOrders: [],
  //               },
  //             },
  //           },
  //         },
  //       }}
  //     />
  //   );

  //   expect(setSelectedSalesOrderIds).toHaveBeenCalledWith([]);
  //   expect(screen.getByText(`${intlKey}.Toast.SuccessDescription`)).toBeInTheDocument();
  //   jest.advanceTimersByTime(500);
  //   expect(mockDispatch).toBeCalledWith(gridActions.gridFetchRequested(GridType.ManualPicklists, []));
  //   expect(mockDispatch).toBeCalledWith(resourceActions.resourceInit(ResourceType.CreateManualPicklist));

  //   jest.useRealTimers();
  // });
});
