import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, ErrorPanel } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { CargoPackageListOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { ResourceType } from '../../../../models';
import PackageBox, { PackageBoxType } from './PackageBox';
import NoItemDataDisplay from '../../../molecules/NoItemDataDisplay/NoItemDataDisplay';

export const CargoPackages: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: any }>();
  const dispatch = useDispatch();
  const listCargoPackages: Resource<CargoPackageListOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ListCargoPackages]
  );
  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.ListCargoPackages, {
        salesOrderId: id,
      })
    );
  }, []);

  return (
    <>
      <Flex gutter={16} flexWrap="wrap">
        {listCargoPackages?.data?.length ? (
          listCargoPackages?.data?.map((packageItem, i) => (
            <Box key={i.toString()}>
              <PackageBox type={PackageBoxType.cargo} item={packageItem} />
            </Box>
          ))
        ) : (
          <NoItemDataDisplay isLoaded={listCargoPackages?.isSuccess} />
        )}
      </Flex>
      {listCargoPackages?.isBusy && <Skeleton height="210px" width="436px" />}
      {listCargoPackages?.error && (
        <ErrorPanel title={t('ErrorPanel.ErrorMessage')} message={t('ErrorPanel.ReloadMessage')} />
      )}
    </>
  );
};

export default CargoPackages;
