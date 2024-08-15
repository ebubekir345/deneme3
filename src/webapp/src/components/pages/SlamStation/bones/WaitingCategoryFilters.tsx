import { Box, Flex, Icon, Image } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { WaitingForSLAMCargoPackagesCountOutputDTO } from '../../../../services/swagger';
import useSlamStationStore from '../../../../store/global/slamStationStore';
import FilterButton from './FilterButton';

enum WaitingStatusCategoryFilter {
  Total = 'total',
  WaitingToProcess = 'waitingToProcess',
  InProcess = 'inProcess',
  Cancelled = 'cancelled',
}

const iconColorSwitcher = (status: WaitingStatusCategoryFilter): string => {
  switch (status) {
    case WaitingStatusCategoryFilter.Total:
      return '#4a90e2';
    case WaitingStatusCategoryFilter.WaitingToProcess:
      return 'palette.softBlue_light';
    case WaitingStatusCategoryFilter.InProcess:
      return 'palette.hardGreen';
    case WaitingStatusCategoryFilter.Cancelled:
      return 'palette.red_darker';
    default:
      return '#4a90e2';
  }
};

const intlKey = 'TouchScreen.SlamStation.CategoryFilter';

export const WaitingCategoryFilters: React.FC = () => {
  const { t } = useTranslation();
  const [{ waitingCategoryFilter }, { setWaitingCategoryFilter }] = useSlamStationStore();
  const waitingForSLAMCargoPackagesCount: Resource<WaitingForSLAMCargoPackagesCountOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWaitingForSLAMCargoPackagesCount]
  );
  const isWaitingCargoPackagesBusy = useSelector(
    (state: StoreState) => state.resources[ResourceType.WaitingForSLAMCargoPackages]?.isBusy
  );

  return (
    <Flex flexDirection="column" alignItems="center" pt={36} pr={12} overflow="auto">
      {Object.keys(WaitingStatusCategoryFilter).map(status => (
        <FilterButton
          key={status}
          isSelected={waitingCategoryFilter === status}
          icon={
            <Icon name="fas fa-circle" fontSize={20} color={iconColorSwitcher(WaitingStatusCategoryFilter[status])} />
          }
          title={t(`${intlKey}.${status}`)}
          count={
            waitingForSLAMCargoPackagesCount?.data &&
            waitingForSLAMCargoPackagesCount?.data[WaitingStatusCategoryFilter[status]]
          }
          onSelect={() => setWaitingCategoryFilter(status)}
          isDisabled={isWaitingCargoPackagesBusy}
        />
      ))}
      <Box mt={4} mb={8} height={1} width={1} bg="palette.grey_light" />
      <Box width={1} overflow="auto">
        {waitingForSLAMCargoPackagesCount?.isBusy ? (
          <>
            <Skeleton width={258} height={100} />
          </>
        ) : (
          waitingForSLAMCargoPackagesCount?.data?.byOperation?.map(operation => (
            <FilterButton
              key={operation.id}
              isSelected={waitingCategoryFilter === operation.id}
              icon={<Image src={operation.imageUrl} width="36px" height="36px" borderRadius="md" />}
              title={operation.name as string}
              count={operation.count as number}
              onSelect={() => setWaitingCategoryFilter(operation.id || '')}
              isDisabled={isWaitingCargoPackagesBusy}
            />
          ))
        )}
      </Box>
    </Flex>
  );
};

export default WaitingCategoryFilters;
