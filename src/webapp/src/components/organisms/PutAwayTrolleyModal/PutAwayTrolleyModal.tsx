/* eslint-disable import/no-named-as-default */
import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Flex, formatUtcToLocal, Icon, Modal, ModalContent, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Pagination, SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import { PutAwayTrolleyDetailsOutputDTO } from '../../../services/swagger';
import Grid from '../../atoms/Grid';
import { ProgressBar } from '../../atoms/TouchScreen';
import DqbPaginationFooter, { IFooterPagination } from '../../molecules/DqbPaginationFooter';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import ToteBox from './bones/ToteBox';

export interface IPutAwayTrolleyModal {
  trolleyLabel: string;
  isOpen: boolean;
  isLinked?: boolean;
  onClose: () => void;
}

export const PutAwayTrolleyModal: React.FC<IPutAwayTrolleyModal> = ({
  trolleyLabel,
  isOpen,
  onClose,
  isLinked = true,
}) => {
  const dispatch = useDispatch();

  const putAwayTrolleyDetails: Resource<PutAwayTrolleyDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPutAwayTrolleyDetails]
  );
  const putAwayTrolleyTotes: any = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PutAwayTrolleyTotes, state.grid)
  );
  const isPutAwayTotesBusy = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.PutAwayTrolleyTotes, state.grid)
  );
  const footerPagination: IFooterPagination = useSelector(
    (state: StoreState) =>
      gridSelectors.getGridFooterPagination(GridType.PutAwayTrolleyTotes, state.grid) || {
        pageCount: 0,
        rowCount: 0,
        pagination: new Pagination({ offset: 0, count: 0 }),
      }
  );

  const getPickingTrolleyDetails = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetPutAwayTrolleyDetails, params));
  };
  const queryPutAwayTrolleyTotes = (trolleyLabel: string) => {
    dispatch(
      gridActions.gridSortChanged(
        GridType.PutAwayTrolleyTotes,
        new SortField({
          property: 'label',
          by: SortDirection.ASC,
        })
      )
    );
    dispatch(gridActions.gridPaginationChanged(GridType.PutAwayTrolleyTotes, new Pagination({ offset: 0, count: 20 })));
    dispatch(gridActions.gridFetchRequested(GridType.PutAwayTrolleyTotes, [trolleyLabel]));
  };
  const onPaginationChange = (pagination: Pagination, trolleyLabel: string) => {
    dispatch(gridActions.gridPaginationChanged(GridType.PutAwayTrolleyTotes, pagination));
    dispatch(gridActions.gridFetchRequested(GridType.PutAwayTrolleyTotes, [trolleyLabel]));
  };
  const clearState = () => {
    dispatch(gridActions.gridStateCleared(GridType.PutAwayTrolleyTotes));
  };

  useEffect(() => {
    if (isOpen) {
      getPickingTrolleyDetails({ trolleyLabel });
      queryPutAwayTrolleyTotes(trolleyLabel);
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
          {putAwayTrolleyDetails?.data?.totalToteCount ? putAwayTrolleyDetails?.data?.totalToteCount : 'N/A'}
        </Text>
      </Flex>
    );
    const operatorAddress = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-user-alt" fontSize={16} />
        <Text ml={16}>{putAwayTrolleyDetails?.data?.operatorName}</Text>
      </Flex>
    );
    const createdAt = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-calendar-alt" fontSize={16} />
        <Text ml={16}>
          {putAwayTrolleyDetails?.data?.createdAt && formatUtcToLocal(putAwayTrolleyDetails?.data?.createdAt as any)}
        </Text>
      </Flex>
    );
    const percentage = (
      <Flex color="palette.grey" alignItems="center">
        <Text mr={16}>
          %{putAwayTrolleyDetails?.data?.percentage ? putAwayTrolleyDetails?.data?.percentage.toFixed(0) : 0}
        </Text>
        <ProgressBar
          label={false}
          current={putAwayTrolleyDetails?.data?.percentage ? putAwayTrolleyDetails?.data?.percentage : 0}
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
    (putAwayTrolleyDetails?.data?.operatorName || putAwayTrolleyDetails?.data?.lastSeenAddress) &&
      contentArr.push(operatorAddress);
    putAwayTrolleyDetails?.data?.createdAt && contentArr.push(createdAt);
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
          title={putAwayTrolleyDetails?.data?.label || 'N/A'}
          content={headerContent()}
          onClose={() => onClose()}
          isBusy={putAwayTrolleyDetails?.isBusy}
        />
        <Box my={24} width={1} height={1} bg="palette.grey_lighter" />
        <Grid gridTemplateColumns="repeat(5, 1fr)" style={{ gap: '24px' }}>
          {isPutAwayTotesBusy
            ? [...Array(20)].map(each => <Skeleton width="100%" height={112} />)
            : putAwayTrolleyTotes.map(tote => (
                <ToteBox
                  key={tote?.label}
                  title={tote?.label || ''}
                  current={tote?.totePutAwayItemsCount || 0}
                  total={tote?.toteTotalItemsCount || 0}
                  hasLostItem={tote?.hasLostItem}
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

export default PutAwayTrolleyModal;
