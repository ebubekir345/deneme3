import { LayoutContent, Panel } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { StockCountingListDetailsOutputDTO, StockCountingListState } from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import CountingListDetailsGrid from './bones/CountingListDetailsGrid';
import ActionBar from '../../organisms/ActionBar';
import InfoPanel from './bones/InfoPanel';

const intlKey = 'CountingListDetails';

const CountingListDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const CountingListDetails: Resource<StockCountingListDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.StockCountingListDetails]
  );
  let { id, referenceNumber }: { id:any, referenceNumber: any } = useParams();

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.StockCountingListDetails, { referenceNumber }));
  }, []);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.otherCountings },
    { title: `${t(`${intlKey}.Title`)}` },
  ];

  const firstRow = [
    {
      title: t(`${intlKey}.InfoPanel.StockCountingType`),
      key: CountingListDetails?.data?.stockCountingType,
    },
    { title: t(`${intlKey}.InfoPanel.CreatedByFullName`), key: CountingListDetails?.data?.createdByFullName },
    { title: t(`${intlKey}.InfoPanel.State`), key: t(`Enum.${CountingListDetails?.data?.state}`) },
  ];

  const secondRow = [
    {
      title: t(`${intlKey}.InfoPanel.TotalBeforeStockCountingAmount`),
      key: CountingListDetails?.data?.beforeStockCountingTotalAmount,
    },
    {
      title: t(`${intlKey}.InfoPanel.TotalAfterStockCountingAmount`),
      key:
        CountingListDetails?.data?.state !== StockCountingListState.Completed
          ? '-'
          : CountingListDetails?.data?.afterStockCountingTotalAmount,
    },
    {
      title: t(`${intlKey}.InfoPanel.TotalDifferenceInAmount`),
      key:
        CountingListDetails?.data?.totalDifferenceInAmount && CountingListDetails?.data?.totalDifferenceInAmount > 0
          ? `+${CountingListDetails?.data?.totalDifferenceInAmount}`
          : CountingListDetails?.data?.totalDifferenceInAmount &&
            CountingListDetails?.data?.totalDifferenceInAmount <= 0
          ? CountingListDetails?.data?.totalDifferenceInAmount
          : '-',
      color:
        CountingListDetails?.data?.totalDifferenceInAmount === 0 ||
        CountingListDetails?.data?.state !== StockCountingListState.Completed
          ? undefined
          : CountingListDetails?.data?.totalDifferenceInAmount && CountingListDetails?.data?.totalDifferenceInAmount > 0
          ? '#39D98A'
          : '#FF5C5C',
    },
  ];

  return (
    <>
      <ActionBar
        title={`${t(`${intlKey}.TitleDetail`)} ${CountingListDetails?.data?.referenceNumber?.toString() || 'N/A'}`}
        isLoading={CountingListDetails?.isBusy}
        breadcrumb={breadcrumb}
      ></ActionBar>
      <InfoPanel firstRow={firstRow} secondRow={secondRow} isBusy={CountingListDetails?.isBusy} />
      <LayoutContent>
        <Panel title={t(`${intlKey}.CountingDetail`)}>
          <CountingListDetailsGrid
            stockCountingListId={id}
            stockCountingType={CountingListDetails?.data?.stockCountingType}
          />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default CountingListDetails;
