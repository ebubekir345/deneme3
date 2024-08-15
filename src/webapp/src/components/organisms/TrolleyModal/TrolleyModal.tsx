/* eslint-disable import/no-named-as-default */
import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Flex, formatUtcToLocal, Icon, Modal, ModalContent, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Pagination, SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../models';
import {
  PickingTrolleyDetailsOutputDTO,
  PickingTrolleyPickingToteQueryOutputDTO,
  PickingTrolleySalesOrderState,
} from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import Grid from '../../atoms/Grid';
import { ProgressBar } from '../../atoms/TouchScreen';
import DqbPaginationFooter, { IFooterPagination } from '../../molecules/DqbPaginationFooter';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import ToteBox from './bones/ToteBox';

export interface ITrolleyModal {
  trolleyLabel: string;
  isOpen: boolean;
  isLinked?: boolean;
  onClose: () => void;
}

export const TrolleyModal: React.FC<ITrolleyModal> = ({ trolleyLabel, isOpen, onClose, isLinked = true }) => {
  const dispatch = useDispatch();

  const pickingTrolleyDetails: Resource<PickingTrolleyDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPickingTrolleyDetails]
  );
  const pickingTrolleyPickingTotes: any = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PickingTrolleyPickingTotes, state.grid)
  );
  const isPickingTotesBusy = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.PickingTrolleyPickingTotes, state.grid)
  );
  const footerPagination: IFooterPagination = useSelector(
    (state: StoreState) =>
      gridSelectors.getGridFooterPagination(GridType.PickingTrolleyPickingTotes, state.grid) || {
        pageCount: 0,
        rowCount: 0,
        pagination: new Pagination({ offset: 0, count: 0 }),
      }
  );

  const getPickingTrolleyDetails = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetPickingTrolleyDetails, params));
  };
  const queryPickingTrolleyPickingTotes = (trolleyLabel: string) => {
    dispatch(
      gridActions.gridSortChanged(
        GridType.PickingTrolleyPickingTotes,
        new SortField({
          property: 'label',
          by: SortDirection.ASC,
        })
      )
    );
    dispatch(
      gridActions.gridPaginationChanged(GridType.PickingTrolleyPickingTotes, new Pagination({ offset: 0, count: 20 }))
    );
    dispatch(gridActions.gridFetchRequested(GridType.PickingTrolleyPickingTotes, [trolleyLabel]));
  };
  const onPaginationChange = (pagination: Pagination, trolleyLabel: string) => {
    dispatch(gridActions.gridPaginationChanged(GridType.PickingTrolleyPickingTotes, pagination));
    dispatch(gridActions.gridFetchRequested(GridType.PickingTrolleyPickingTotes, [trolleyLabel]));
  };
  const clearState = () => {
    dispatch(gridActions.gridStateCleared(GridType.PickingTrolleyPickingTotes));
  };

  useEffect(() => {
    if (isOpen) {
      getPickingTrolleyDetails({ trolleyLabel });
      queryPickingTrolleyPickingTotes(trolleyLabel);
    } else {
      clearState();
    }
  }, [isOpen]);

  const handlePageNumberChange = (activePage: number) => {
    const pagination = new Pagination(footerPagination.pagination);
    const currentPage = activePage - 1;
    pagination.offset = currentPage * pagination.count;
    onPaginationChange(pagination, trolleyLabel);
  };

  const headerContent = () => {
    const toteCount = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-cubes" fontSize={16} />
        <Text ml={16}>
          {pickingTrolleyDetails?.data?.totalToteCount ? pickingTrolleyDetails?.data?.totalToteCount : '-'}
        </Text>
      </Flex>
    );
    const operatorAddress = (
      <Flex color="palette.grey" alignItems="center">
        <Icon
          name={
            pickingTrolleyDetails?.data?.state === PickingTrolleySalesOrderState.Picking
              ? 'fal fa-user-alt'
              : 'fal fa-box-alt'
          }
          fontSize={16}
        />
        <Text ml={16}>
          {pickingTrolleyDetails?.data?.state === PickingTrolleySalesOrderState.Picking
            ? pickingTrolleyDetails?.data?.operatorName
            : pickingTrolleyDetails?.data?.lastSeenAddress}
        </Text>
      </Flex>
    );
    const lastSeenAt = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-calendar-alt" fontSize={16} />
        <Text ml={16}>
          {pickingTrolleyDetails?.data?.lastSeenAt && formatUtcToLocal(pickingTrolleyDetails?.data?.lastSeenAt as any)}
        </Text>
      </Flex>
    );
    const percentage = (
      <Flex color="palette.grey" alignItems="center">
        <Text mr={16}>
          %{pickingTrolleyDetails?.data?.percentage ? pickingTrolleyDetails?.data?.percentage.toFixed(0) : 0}
        </Text>
        <ProgressBar
          label={false}
          current={pickingTrolleyDetails?.data?.percentage ? pickingTrolleyDetails?.data?.percentage : 0}
          total={100}
          barColor="palette.blue"
          containerColor="#e8e8e8"
          completeColor="palette.blue"
          borderRadius="lg"
          height="16px"
        />
      </Flex>
    );

    const contentArr: JSX.Element[] = [];
    contentArr.push(toteCount);
    (pickingTrolleyDetails?.data?.operatorName || pickingTrolleyDetails?.data?.lastSeenAddress) &&
      contentArr.push(operatorAddress);
    pickingTrolleyDetails?.data?.lastSeenAt && contentArr.push(lastSeenAt);
    contentArr.push(percentage);

    return contentArr;
  };

  return (
    <Modal
      showOverlay
      showCloseButton={false}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_light"
      boxShadow="none"
      maxWidth={1300}
    >
      <ModalContent p={24} display="flex" flexDirection="column">
        <ModalFancyHeader
          title={pickingTrolleyDetails?.data?.label || 'N/A'}
          content={headerContent()}
          onClose={() => onClose()}
          isBusy={pickingTrolleyDetails?.isBusy}
        />
        <Box my={24} width={1} height={1} bg="palette.grey_lighter" />
        <Grid gridTemplateColumns="repeat(5, 1fr)" style={{ gap: '24px' }}>
          {isPickingTotesBusy
            ? [...Array(20)].map((each, index) => <Skeleton width="100%" height={112} key={index} />)
            : pickingTrolleyPickingTotes.map((tote: PickingTrolleyPickingToteQueryOutputDTO) => (
                <ToteBox
                  key={tote?.label}
                  title={tote?.label || ''}
                  current={tote?.totalItemAmount || 0}
                  total={tote?.totalLineItemAmount || 0}
                  orderId={tote?.salesOrderId || ''}
                  orderName={tote?.salesOrderReferenceNumber || ''}
                  isLinked={isLinked}
                  operationName={tote?.salesOrderOperationName}
                  trolleyToteStatus={tote.pickingTrolleyState}
                  orderSalesChannel={tote.salesChannel}
                  orderDeliveryType={tote.deliveryType}
                />
              ))}
        </Grid>
        <Flex height={50} alignItems="center" bg="palette.white" borderRadius="lg" px={18} mt={26}>
          <DqbPaginationFooter footerPagination={footerPagination} handlePageNumberChange={handlePageNumberChange} />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default TrolleyModal;
