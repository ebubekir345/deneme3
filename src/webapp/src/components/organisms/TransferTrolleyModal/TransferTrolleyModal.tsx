/* eslint-disable import/no-named-as-default */
import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Flex, Icon, Modal, ModalContent, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Pagination, SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import { TransferTrolleyDetailsOutputDTO } from '../../../services/swagger';
import Grid from '../../atoms/Grid';
import { ProgressBar } from '../../atoms/TouchScreen';
import DqbPaginationFooter, { IFooterPagination } from '../../molecules/DqbPaginationFooter';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import ToteBox from './bones/ToteBox';

const intlKey = 'Problems.PickingProblems.TransferTrolleyModal';

export interface ITransferTrolleyModal {
  trolleyLabel: string;
  isOpen: boolean;
  isLinked?: boolean;
  onClose: () => void;
}

export const TransferTrolleyModal: React.FC<ITransferTrolleyModal> = ({
  trolleyLabel,
  isOpen,
  onClose,
  isLinked = true,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const transferTrolleyDetails: Resource<TransferTrolleyDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetTransferTrolleyDetails]
  );
  const transferTrolleyPickingTotes: any = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.TransferTrolleyPickingTotes, state.grid)
  );
  
  const isPickingTotesBusy = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.TransferTrolleyPickingTotes, state.grid)
  );
  const footerPagination: IFooterPagination = useSelector(
    (state: StoreState) =>
      gridSelectors.getGridFooterPagination(GridType.TransferTrolleyPickingTotes, state.grid) || {
        pageCount: 0,
        rowCount: 0,
        pagination: new Pagination({ offset: 0, count: 0 }),
      }
  );

  const getPickingTrolleyDetails = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetTransferTrolleyDetails, params));
  };
  const queryTransferTrolleyPickingTotes = (trolleyLabel: string) => {
    dispatch(
      gridActions.gridSortChanged(
        GridType.TransferTrolleyPickingTotes,
        new SortField({
          property: 'label',
          by: SortDirection.ASC,
        })
      )
    );
    dispatch(
      gridActions.gridPaginationChanged(GridType.TransferTrolleyPickingTotes, new Pagination({ offset: 0, count: 20 }))
    );
    dispatch(gridActions.gridFetchRequested(GridType.TransferTrolleyPickingTotes, [trolleyLabel]));
  };
  const onPaginationChange = (pagination: Pagination, trolleyLabel: string) => {
    dispatch(gridActions.gridPaginationChanged(GridType.TransferTrolleyPickingTotes, pagination));
    dispatch(gridActions.gridFetchRequested(GridType.TransferTrolleyPickingTotes, [trolleyLabel]));
  };
  const clearState = () => {
    dispatch(gridActions.gridStateCleared(GridType.TransferTrolleyPickingTotes));
  };

  useEffect(() => {
    if (isOpen) {
      getPickingTrolleyDetails({ trolleyLabel });
      queryTransferTrolleyPickingTotes(trolleyLabel);
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
          {transferTrolleyDetails?.data?.totalToteCount ? transferTrolleyDetails?.data?.totalToteCount : '-'}
        </Text>
      </Flex>
    );
    const address = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-location-arrow" fontSize={16} />
        <Text ml={16}>{transferTrolleyDetails?.data?.lastSeenAddress}</Text>
      </Flex>
    );
    const percentage = (
      <Flex color="palette.grey" alignItems="center">
        <Text mr={16}>{t(`${intlKey}.Percentage`)}</Text>
        <Text mr={16}>
          %{transferTrolleyDetails?.data?.percentage ? transferTrolleyDetails?.data?.percentage.toFixed(0) : 0}
        </Text>
        <ProgressBar
          label={false}
          current={transferTrolleyDetails?.data?.percentage ? transferTrolleyDetails?.data?.percentage : 0}
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
    transferTrolleyDetails?.data?.lastSeenAddress && contentArr.push(address);
    contentArr.push(percentage);

    return contentArr;
  };

  return (
    <Modal
      showOverlay
      showCloseButton={false}
      maxWidth={1300}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_light"
      boxShadow="none"
    >
      <ModalContent p={24} display="flex" flexDirection="column">
        <ModalFancyHeader
          title={transferTrolleyDetails?.data?.transferTrolleyLabel || 'N/A'}
          content={headerContent()}
          onClose={() => onClose()}
          isBusy={transferTrolleyDetails?.isBusy}
        />
        <Box my={24} width={1} height={1} bg="palette.grey_lighter" />
        <Grid gridTemplateColumns="repeat(5, 1fr)" style={{ gap: '24px' }}>
          {isPickingTotesBusy
            ? [...Array(20)].map(each => <Skeleton width="100%" height={112} />)
            : transferTrolleyPickingTotes.map(tote => (
                <ToteBox
                  key={tote?.label}
                  title={tote?.label || ''}
                  current={tote?.toteTotalItemAmount || 0}
                  total={tote?.toteSalesOrderLineItemAmount || 0}
                  orderId={tote?.salesOrderId || ''}
                  orderName={tote?.salesOrderReferenceNumber || ''}
                  isLinked={isLinked}
                  transferTrolleyToteStatus={tote?.transferTrolleyToteStatus}
                  operationName={tote?.salesOrderOperationName}
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

export default TransferTrolleyModal;
