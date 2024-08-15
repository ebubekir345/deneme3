import { Text, Flex, Image, Icon, formatUtcToLocal, DATE_FORMAT_NO_TIME } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Pagination, QueryBuilder, SortField, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import {
  ListCarriersOutputDTO,
  ReadyToShipCargoPackagesOutputDTODynamicQueryOutputDTO,
  SLAMQueryCompletedCargoState,
} from '../../../../services/swagger';
import useSlamStationStore from '../../../../store/global/slamStationStore';
import { ReadyToShipStatusFilter } from '../../../../typings/globalStore/enums';
import GridTable, { ISort } from '../../../molecules/TouchScreen/GridTable';

const iconColorSwitcher = (status: string): string => {
  switch (status) {
    case SLAMQueryCompletedCargoState.ShipmentFailure:
      return 'palette.orange_darker';
    case SLAMQueryCompletedCargoState.Cancelled:
      return 'palette.red_darker';
    default:
      return 'palette.orange_darker';
  }
};

const intlKey = 'TouchScreen.SlamStation.ReadyToShipPackagesTable';

export const ReadyToShipPackagesTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [
    { readyToShipSort, readyToShipCategoryFilter, readyToShipPackages },
    { setReadyToShipSort },
  ] = useSlamStationStore();
  const [previousCount, setPreviousCount] = useState(20);
  const readyToShipCargoPackages: Resource<ReadyToShipCargoPackagesOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ReadyToShipCargoPackages]
  );
  const listCarriersResponse: Resource<ListCarriersOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ListCarriers]
  );

  useEffect(() => {
    if (readyToShipPackages.length === 0) {
      setPreviousCount(20);
    } else {
      setPreviousCount(Math.ceil(readyToShipPackages.length / 20) * 20);
    }
  }, [readyToShipPackages]);

  const getCargoCarrierLogoWithName = (name: string) => {
    return listCarriersResponse.data?.carriers?.filter(carrier => carrier.name === name)[0]?.enabledLogoUrl || '';
  };

  const tableColumns = [
    { key: 'cargoCarrier', title: t(`${intlKey}.Columns.CargoCarrier`), sortable: true },
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

  const tableRows = readyToShipPackages.map(cargoPackage => {
    const cargoCarrier = (
      <Flex height="100%" justifyContent="center" alignItems="center">
        {cargoPackage.state === SLAMQueryCompletedCargoState.Total ? (
          <Image src={getCargoCarrierLogoWithName(cargoPackage?.cargoCarrier || '')} width={36} height={36} />
        ) : (
          <Icon name="fas fa-circle" fontSize={24} color={iconColorSwitcher(cargoPackage.state)} />
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
      cargoCarrier,
      operation,
      salesOrderCreatedAt,
      salesOrderReferenceNumber,
      cargoPackageLabel,
      salesChannel,
      customerInfo,
    ];
  });

  const onSort = (activeSort: ISort) => {
    setReadyToShipSort(activeSort);
  };

  const increasePreviousCount = () => {
    const increasedCount = previousCount + 20;
    setPreviousCount(increasedCount);
  };

  const onLoadMore = () => {
    const maxCount = readyToShipCargoPackages?.data?.count || 20;
    if (maxCount > previousCount) {
      const property = Object.keys(SLAMQueryCompletedCargoState).includes(readyToShipCategoryFilter)
        ? 'state'
        : 'cargoCarrier';
      const filters =
        readyToShipCategoryFilter !== ReadyToShipStatusFilter.Total
          ? [
              new StringFilter({
                property,
                value: readyToShipCategoryFilter,
                op: StringFilterOperation.Equals,
              }),
            ]
          : [];
      const builder = new QueryBuilder({
        filters,
        pagination: new Pagination({ offset: previousCount, count: 20 }),
        sortBy: new SortField({
          property: readyToShipSort.key,
          by: readyToShipSort.direction,
        }),
      });
      const query = builder.build();
      dispatch(resourceActions.resourceRequested(ResourceType.ReadyToShipCargoPackages, { query }));

      increasePreviousCount();
    }
  };

  return (
    <Flex flexGrow={1} flexDirection="column" overflow="auto" pl={12} borderLeft="xs" borderColor="palette.grey_light">
      <GridTable
        columns={tableColumns}
        rows={tableRows}
        activeSort={readyToShipSort}
        onSort={onSort}
        loadMore={onLoadMore}
        isBusy={readyToShipCargoPackages?.isBusy}
      />
    </Flex>
  );
};

export default ReadyToShipPackagesTable;
