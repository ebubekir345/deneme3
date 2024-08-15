import React, { useEffect, useRef } from 'react';
import { Box, Flex, Text } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Pagination, QueryBuilder, SortField, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import Skeleton from 'react-loading-skeleton';
import useSlamStationStore from '../../../../store/global/slamStationStore';
import ReadyToShipCargoPackages from './ReadyToShipCargoPackages';
import WaitingCargoPackages from './WaitingCargoPackages';
import { StoreState } from '../../../../store/initState';
import {
  PrintCargoPackageCarrierLabelOutputDTO,
  ReadyToShipCargoPackagesCountOutputDTO,
  ReadyToShipCargoPackagesOutputDTODynamicQueryOutputDTO,
  SLAMQueryCargoState,
  SLAMQueryCompletedCargoState,
  WaitingForSLAMCargoPackageOutputDTODynamicQueryOutputDTO,
  WaitingForSLAMCargoPackagesCountOutputDTO,
} from '../../../../services/swagger';
import { ResourceType } from '../../../../models';
import { ReadyToShipStatusFilter, WaitingStatusFilter } from '../../../../typings/globalStore/enums';

const intlKey = 'TouchScreen.SlamStation.PackageStatus';

export const PackagesStatusColumn: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [
    {
      activeTab,
      readyToShipCategoryFilter,
      waitingCategoryFilter,
      waitingSort,
      readyToShipSort,
      readyToShipPackages,
      waitingPackages,
    },
    { setActiveTab, setWaitingPackages, setReadyToShipPackages },
  ] = useSlamStationStore();
  const isReadyToShipCargoPackagesEffectFirstRun = useRef(true);
  const isWaitingForSLAMCargoPackagesEffectFirstRun = useRef(true);

  const waitingForSLAMCargoPackagesCount: Resource<WaitingForSLAMCargoPackagesCountOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWaitingForSLAMCargoPackagesCount]
  );
  const readyToShipCargoPackagesCount: Resource<ReadyToShipCargoPackagesCountOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetReadyToShipCargoPackagesCount]
  );
  const readyToShipCargoPackages: Resource<ReadyToShipCargoPackagesOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ReadyToShipCargoPackages]
  );
  const waitingForSLAMCargoPackages: Resource<WaitingForSLAMCargoPackageOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.WaitingForSLAMCargoPackages]
  );
  const printCargoPackageCarrierLabelResponse: Resource<PrintCargoPackageCarrierLabelOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PrintCargoPackageCarrierLabel]
  );

  const getCounts = () => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetWaitingForSLAMCargoPackagesCount));
    dispatch(resourceActions.resourceRequested(ResourceType.GetReadyToShipCargoPackagesCount));
  };
  const getReadyToShipCargoPackages = () => {
    const property = Object.keys(SLAMQueryCompletedCargoState).includes(readyToShipCategoryFilter)
      ? 'state'
      : 'cargoCarrier';
    const filters: StringFilter[] = [];
    if (property === 'cargoCarrier') {
      filters.push(
        new StringFilter({
          property: 'state',
          value: ReadyToShipStatusFilter.Total,
          op: StringFilterOperation.Equals,
        }),
        new StringFilter({
          property: 'cargoCarrier',
          value: readyToShipCategoryFilter,
          op: StringFilterOperation.Equals,
        })
      );
    }

    if (property === 'state') {
      if (readyToShipCategoryFilter !== ReadyToShipStatusFilter.Total) {
        filters.push(
          new StringFilter({
            property,
            value: readyToShipCategoryFilter,
            op: StringFilterOperation.Equals,
          })
        );
      }
    }
    const builder = new QueryBuilder({
      filters,
      pagination: new Pagination({ offset: 0, count: 20 }),
      sortBy: new SortField({
        property: readyToShipSort.key,
        by: readyToShipSort.direction,
      }),
    });
    const query = builder.build();
    dispatch(resourceActions.resourceRequested(ResourceType.ReadyToShipCargoPackages, { query }));
  };
  const getWaitingForSLAMCargoPackages = () => {
    const property = Object.keys(SLAMQueryCargoState).includes(waitingCategoryFilter) ? 'state' : 'operation.id';
    const filters: StringFilter[] = [];
    if (waitingCategoryFilter !== WaitingStatusFilter.Total) {
      if (waitingCategoryFilter === WaitingStatusFilter.WaitingToProcess) {
        filters.push(
          new StringFilter({
            property,
            value: WaitingStatusFilter.InProcess,
            op: StringFilterOperation.NotEqual,
          })
        );
      } else {
        filters.push(
          new StringFilter({
            property,
            value: waitingCategoryFilter,
            op: StringFilterOperation.Equals,
          })
        );
      }
    }

    const builder = new QueryBuilder({
      filters,
      pagination: new Pagination({ offset: 0, count: 20 }),
      sortBy: new SortField({
        property: waitingSort.key,
        by: waitingSort.direction,
      }),
    });
    const query = builder.build();
    dispatch(resourceActions.resourceRequested(ResourceType.WaitingForSLAMCargoPackages, { query }));
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetWaitingForSLAMCargoPackagesCount));
      dispatch(resourceActions.resourceInit(ResourceType.GetReadyToShipCargoPackagesCount));
      dispatch(resourceActions.resourceInit(ResourceType.WaitingForSLAMCargoPackages));
      dispatch(resourceActions.resourceInit(ResourceType.ReadyToShipCargoPackages));
    };
  }, []);

  useEffect(() => {
    getCounts();
    getReadyToShipCargoPackages();
    getWaitingForSLAMCargoPackages();
    setReadyToShipPackages([]);
    setWaitingPackages([]);
  }, [readyToShipCategoryFilter, waitingCategoryFilter, readyToShipSort, waitingSort]);

  useEffect(() => {
    if (printCargoPackageCarrierLabelResponse?.isSuccess) {
      getCounts();
      getReadyToShipCargoPackages();
      getWaitingForSLAMCargoPackages();
      setReadyToShipPackages([]);
      setWaitingPackages([]);
    }
  }, [printCargoPackageCarrierLabelResponse]);

  useEffect(() => {
    if (isReadyToShipCargoPackagesEffectFirstRun.current) {
      isReadyToShipCargoPackagesEffectFirstRun.current = false;
      return;
    }
    if (readyToShipCargoPackages?.isSuccess) {
      const modifiedCargoPackages =
        readyToShipPackages.length !== 0
          ? [...readyToShipPackages, ...(readyToShipCargoPackages?.data?.data as any)]
          : (readyToShipCargoPackages?.data?.data as any);
      setReadyToShipPackages(modifiedCargoPackages);
    }
  }, [readyToShipCargoPackages]);

  useEffect(() => {
    if (isWaitingForSLAMCargoPackagesEffectFirstRun.current) {
      isWaitingForSLAMCargoPackagesEffectFirstRun.current = false;
      return;
    }
    if (waitingForSLAMCargoPackages?.isSuccess) {
      const modifiedCargoPackages =
        waitingPackages.length !== 0
          ? [...waitingPackages, ...(waitingForSLAMCargoPackages?.data?.data as any)]
          : (waitingForSLAMCargoPackages?.data?.data as any);
      setWaitingPackages(modifiedCargoPackages);
    }
  }, [waitingForSLAMCargoPackages]);

  const tabContent = [
    {
      id: 0,
      count: readyToShipCargoPackagesCount?.data?.total || 0,
      title: t(`${intlKey}.ReadyToShip`),
      component: <ReadyToShipCargoPackages />,
    },
    {
      id: 1,
      count: waitingForSLAMCargoPackagesCount?.data?.total,
      title: t(`${intlKey}.WaitingToBeProcessed`),
      component: <WaitingCargoPackages />,
    },
  ];

  return (
    <Flex width={1} bg="palette.softGrey" flexDirection="column" alignItems="center" padding={32} overflow="auto">
      <Flex width={1} height={56} fontSize="18px" borderBottom="xs" borderColor="palette.grey_light" fontWeight={500} mb={18}>
        {tabContent.map((tab, i) => (
          <Flex
            key={i.toString()}
            px={32}
            py={14}
            borderBottom={activeTab === tab.id ? '2px solid #5b8def' : 'none'}
            color={activeTab === tab.id ? 'palette.softBlue' : 'palette.grey_light'}
            onClick={() => setActiveTab(tab.id)}
            alignItems="center"
            position="relative"
            t={1}
            cursor="pointer"
            data-testid="tab-button"
          >
            <Box mr={12} px={6} py={1} borderRadius={12} bg="palette.slate_lighter">
              {waitingForSLAMCargoPackagesCount?.isBusy || readyToShipCargoPackagesCount?.isBusy ? (
                <Skeleton height={18} width={16} />
              ) : (
                <Text data-testid="tab-count">{tab.count}</Text>
              )}
            </Box>
            <Box>{tab.title}</Box>
          </Flex>
        ))}
      </Flex>
      {tabContent[activeTab].component}
    </Flex>
  );
};

export default PackagesStatusColumn;
