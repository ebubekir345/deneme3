import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { QueryReservedProductManagementCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'ProductFeedManagement';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<QueryReservedProductManagementCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ReservedProductManagementCounts]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.ReservedProductManagementCounts));
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfProductsAwaitingFeeding`),
      count: getAnalyticsResponse?.data?.reservedProductCount,
      iconName: 'fal fa-box-full',
    },
  ];

  return (
    <Flex fontFamily="heading" pl={8}>
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 4 }).map((_, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxContent={boxContent} />
      )}
    </Flex>
  );
};

export default Analytics;
