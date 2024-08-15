import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, ErrorPanel } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { SalesOrderReturnPackageOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { ResourceType } from '../../../../models';
import PackageBox, { PackageBoxType } from './PackageBox';
import NoItemDataDisplay from '../../../molecules/NoItemDataDisplay/NoItemDataDisplay';

export const ReturnPackages: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: any }>();
  const listReturnPackages: Resource<SalesOrderReturnPackageOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ListReturnPackages]
  );
  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.ListReturnPackages, {
        salesOrderId: id,
      })
    );
  }, []);

  return (
    <>
      <Flex gutter={16} flexWrap="wrap">
        {listReturnPackages?.data?.length ? (
          listReturnPackages?.data?.map((packageItem, i) => (
            <Box key={i.toString()}>
              <PackageBox type={PackageBoxType.return} item={packageItem} />
            </Box>
          ))
        ) : (
          <NoItemDataDisplay isLoaded={listReturnPackages?.isSuccess} />
        )}
      </Flex>
      {listReturnPackages?.isBusy && <Skeleton height="210px" width="436px" />}
      {listReturnPackages?.error && (
        <ErrorPanel title={t('ErrorPanel.ErrorMessage')} message={t('ErrorPanel.ReloadMessage')} />
      )}
    </>
  );
};

export default ReturnPackages;
