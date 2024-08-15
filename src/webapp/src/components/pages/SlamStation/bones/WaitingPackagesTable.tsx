import { Text, Flex, Image, Icon, formatUtcToLocal, DATE_FORMAT_NO_TIME } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Pagination, QueryBuilder, SortField, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import {
  SLAMQueryCargoState,
  WaitingForSLAMCargoPackageOutputDTODynamicQueryOutputDTO,
  CargoPackageLabelUrlState,
} from '../../../../services/swagger';
import useSlamStationStore from '../../../../store/global/slamStationStore';
import { WaitingStatusFilter } from '../../../../typings/globalStore/enums';
import GridTable, { ISort } from '../../../molecules/TouchScreen/GridTable';

const iconColorSwitcher = (status: SLAMQueryCargoState): string => {
  switch (status) {
    case SLAMQueryCargoState.WaitingToProcess:
      return 'palette.softBlue_light';
    case SLAMQueryCargoState.InProcess:
      return 'palette.hardGreen';
    case SLAMQueryCargoState.Cancelled:
      return 'palette.red_darker';
    default:
      return 'palette.orange_darker';
  }
};

const intlKey = 'TouchScreen.SlamStation.WaitingPackagesTable';

export const WaitingPackagesTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ waitingSort, waitingCategoryFilter, waitingPackages }, { setWaitingSort }] = useSlamStationStore();
  const [previousCount, setPreviousCount] = useState(20);
  const waitingForSLAMCargoPackages: Resource<WaitingForSLAMCargoPackageOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.WaitingForSLAMCargoPackages]
  );

  useEffect(() => {
    if (waitingPackages.length === 0) {
      setPreviousCount(20);
    } else {
      setPreviousCount(Math.ceil(waitingPackages.length / 20) * 20);
    }
  }, [waitingPackages]);

  const tableColumns = [
    { key: 'state', title: t(`${intlKey}.Columns.Status`), sortable: true },
    { key: 'labelUrlState', title: t(`${intlKey}.Columns.IsCargoLabelAcquired`), sortable: true },
    { key: 'operation.id', title: t(`${intlKey}.Columns.Operation`), sortable: true },
    { key: 'salesOrderCreatedAt', title: t(`${intlKey}.Columns.SalesOrderCreatedAt`), sortable: true },
    {
      key: 'salesOrderReferenceNumber',
      title: t(`${intlKey}.Columns.SalesOrderReferenceNumber`),
      sortable: true,
    },
    { key: 'cargoPackageLabel', title: t(`${intlKey}.Columns.CargoPackageLabel`), sortable: true },
    { key: 'salesChannel', title: t(`${intlKey}.Columns.SalesChannel`), sortable: true },
    {
      key: 'shipmentAddressFullName',
      title: t(`${intlKey}.Columns.ShipmentAddressFullName`),
      sortable: true,
    },
  ];

  const tableRows = waitingPackages.map(cargoPackage => {
    const status = (
      <Flex height="100%" justifyContent="center" alignItems="center">
        <Icon name="fas fa-circle" fontSize={24} color={iconColorSwitcher(cargoPackage.state)} />
      </Flex>
    );
    const isCargoLabelAcquired = (
      <Flex height="100%" justifyContent="center" alignItems="center">
        {cargoPackage.labelUrlState === CargoPackageLabelUrlState.Acquired ? (
          <Icon name="far fa-check" fontSize={24} color="palette.hardGreen" />
        ) : (
          <Icon name="far fa-times" fontSize={24} color="palette.red_darker" />
        )}
      </Flex>
    );
    const operation = (
      <Flex height="100%" justifyContent="center" alignItems="center">
        <Image src={cargoPackage.operation?.imageUrl} width={24} height={24} />
      </Flex>
    );
    const salesOrderCreatedAt = (
      <Flex
        height="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        lineHeight="xLarge"
        fontSize={14}
      >
        <Text>{formatUtcToLocal(cargoPackage.salesOrderCreatedAt, DATE_FORMAT_NO_TIME)}</Text>
        <Text color="palette.blue_lighter">{formatUtcToLocal(cargoPackage.salesOrderCreatedAt, 'HH:mm')}</Text>
      </Flex>
    );
    const salesOrderReferenceNumber = (
      <Flex height="100%" justifyContent="center" alignItems="center">
        <Text fontSize={14}>{cargoPackage.salesOrderReferenceNumber}</Text>
      </Flex>
    );
    const cargoPackageLabel = (
      <Flex height="100%" justifyContent="center" alignItems="center">
        <Text fontSize={14}>{cargoPackage.cargoPackageLabel}</Text>
      </Flex>
    );
    const salesChannel = (
      <Flex height="100%" justifyContent="center" alignItems="center">
        <Text fontSize={14}>{t(`Enum.${cargoPackage.salesChannel}`)}</Text>
      </Flex>
    );
    const customerInfo = (
      <Flex height="100%" flexDirection="column" justifyContent="center" lineHeight="xLarge" alignItems="flex-end">
        <Text fontSize={14}>{cargoPackage.shipmentAddressFullName}</Text>
        <Text fontSize={14} color="palette.blue_lighter">
          {cargoPackage.shipmentAddressCity}
        </Text>
      </Flex>
    );
    return [
      status,
      isCargoLabelAcquired,
      operation,
      salesOrderCreatedAt,
      salesOrderReferenceNumber,
      cargoPackageLabel,
      salesChannel,
      customerInfo,
    ];
  });

  const onSort = (activeSort: ISort) => {
    setWaitingSort(activeSort);
  };

  const increasePreviousCount = () => {
    const increasedCount = previousCount + 20;
    setPreviousCount(increasedCount);
  };

  const onLoadMore = () => {
    const maxCount = waitingForSLAMCargoPackages?.data?.count || 20;
    if (maxCount > previousCount) {
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
        pagination: new Pagination({ offset: previousCount, count: 20 }),
        sortBy: new SortField({
          property: waitingSort.key,
          by: waitingSort.direction,
        }),
      });
      const query = builder.build();
      dispatch(resourceActions.resourceRequested(ResourceType.WaitingForSLAMCargoPackages, { query }));

      increasePreviousCount();
    }
  };

  return (
    <Flex flexGrow={1} flexDirection="column" overflow="auto" pl={12} borderLeft="xs" borderColor="palette.grey_light">
      <GridTable
        columns={tableColumns}
        rows={tableRows}
        activeSort={waitingSort}
        onSort={onSort}
        loadMore={onLoadMore}
        isBusy={waitingForSLAMCargoPackages?.isBusy}
      />
    </Flex>
  );
};

export default WaitingPackagesTable;
