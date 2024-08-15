import { Box, Flex, Icon, Image } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { ListCarriersOutputDTO, ReadyToShipCargoPackagesCountOutputDTO } from '../../../../services/swagger';
import useSlamStationStore from '../../../../store/global/slamStationStore';
import FilterButton from './FilterButton';

export enum ReadyToShipCategoryFilter {
  Total = 'total',
  ShipmentFailure = 'shipmentFailure',
  Cancelled = 'cancelled',
}

const iconColorSwitcher = (status: ReadyToShipCategoryFilter): string => {
  switch (status) {
    case ReadyToShipCategoryFilter.Total:
      return '#4a90e2';
    case ReadyToShipCategoryFilter.ShipmentFailure:
      return 'palette.orange_darker';
    case ReadyToShipCategoryFilter.Cancelled:
      return 'palette.red_darker';
    default:
      return '#4a90e2';
  }
};

const intlKey = 'TouchScreen.SlamStation.CategoryFilter';

export const ReadyToShipCategoryFilters: React.FC = () => {
  const { t } = useTranslation();
  const [{ readyToShipCategoryFilter }, { setReadyToShipCategoryFilter }] = useSlamStationStore();
  const readyToShipCargoPackagesCount: Resource<ReadyToShipCargoPackagesCountOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetReadyToShipCargoPackagesCount]
  );
  const isReadyToShipCargoPackagesBusy: boolean = useSelector(
    (state: StoreState) => state.resources[ResourceType.ReadyToShipCargoPackages]?.isBusy
  );
  const listCarriersResponse: Resource<ListCarriersOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ListCarriers]
  );

  const getCargoCarrierLogoWithName = (name: string) => {
    return listCarriersResponse.data?.carriers?.filter(carrier => carrier.name === name)[0]?.enabledLogoUrl || '';
  };

  return (
    <Flex flexDirection="column" alignItems="center" pt={36} pr={12} overflow="auto">
      {Object.keys(ReadyToShipCategoryFilter).map(status => (
        <FilterButton
          key={status}
          isSelected={readyToShipCategoryFilter === status}
          icon={
            <Icon name="fas fa-circle" fontSize={20} color={iconColorSwitcher(ReadyToShipCategoryFilter[status])} />
          }
          title={t(`${intlKey}.${status}`)}
          count={
            readyToShipCargoPackagesCount?.data
              ? readyToShipCargoPackagesCount?.data[ReadyToShipCategoryFilter[status]]
              : 0
          }
          onSelect={() => setReadyToShipCategoryFilter(status)}
          isDisabled={isReadyToShipCargoPackagesBusy}
        />
      ))}
      <Box mt={4} mb={8} height={1} width={1} bg="palette.grey_light" />
      <Box width={1} overflow="auto">
        {readyToShipCargoPackagesCount.isBusy || listCarriersResponse?.isBusy ? (
          <>
            <Skeleton width={258} height={100} />
          </>
        ) : (
          readyToShipCargoPackagesCount?.data?.byCargoCarrier?.map(carrier => (
            <FilterButton
              key={carrier.cargoCarrier}
              isSelected={readyToShipCategoryFilter === carrier.cargoCarrier}
              icon={
                <Image
                  src={getCargoCarrierLogoWithName(carrier?.cargoCarrier || '')}
                  width="36px"
                  height="36px"
                  borderRadius="md"
                />
              }
              title={carrier.cargoCarrier as any}
              count={carrier.count as any}
              onSelect={() => setReadyToShipCategoryFilter(carrier.cargoCarrier as any)}
              isDisabled={isReadyToShipCargoPackagesBusy}
            />
          ))
        )}
      </Box>
    </Flex>
  );
};

export default ReadyToShipCategoryFilters;
