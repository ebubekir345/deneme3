import { LayoutContent, Panel } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { GetStockCountingPlanDetailsOutputDTO } from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import CountingPlanDetailsGrid from './bones/CountingPlanDetailsGrid';
import ActionBar from '../../organisms/ActionBar';
import InfoPanel from './bones/InfoPanel';

const intlKey = 'CountingPlanDetails';

const CountingPlanDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const CountingPlanDetails: Resource<GetStockCountingPlanDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetStockCountingPlanDetails]
  );
  let { id }: { id: any } = useParams();

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetStockCountingPlanDetails, { referenceId: id }));
  }, []);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.otherCountings },
    { title: `${t(`${intlKey}.Title`)}` },
  ];

  const firstRow = [
    { title: t(`${intlKey}.InfoPanel.ReferenceNumber`), key: CountingPlanDetails?.data?.referenceNumber },
    {
      title: t(`${intlKey}.InfoPanel.StockCountingType`),
      key: t(`Enum.${CountingPlanDetails?.data?.stockCountingType}`),
    },
    { title: t(`${intlKey}.InfoPanel.CreatedByFullName`), key: CountingPlanDetails?.data?.createdByFullName },
    { title: t(`${intlKey}.InfoPanel.State`), key: t(`Enum.${CountingPlanDetails?.data?.state}`) },
  ];

  const secondRow = [
    {
      title: t(`${intlKey}.InfoPanel.TotalBeforeStockCountingAmount`),
      key: CountingPlanDetails?.data?.totalBeforeStockCountingAmount,
    },
    {
      title: t(`${intlKey}.InfoPanel.TotalAfterStockCountingAmount`),
      key:
        CountingPlanDetails?.data?.totalAfterStockCountingAmount ||
        CountingPlanDetails?.data?.totalAfterStockCountingAmount === 0
          ? CountingPlanDetails?.data?.totalAfterStockCountingAmount
          : '-',
    },
    {
      title: t(`${intlKey}.InfoPanel.TotalDifferenceInAmount`),
      key:
        CountingPlanDetails?.data?.totalDifferenceInAmount && CountingPlanDetails?.data?.totalDifferenceInAmount > 0
          ? `+${CountingPlanDetails?.data?.totalDifferenceInAmount}`
          : CountingPlanDetails?.data?.totalDifferenceInAmount &&
            CountingPlanDetails?.data?.totalDifferenceInAmount <= 0
          ? CountingPlanDetails?.data?.totalDifferenceInAmount
          : '-',
      color:
        CountingPlanDetails?.data?.totalDifferenceInAmount === 0 || !CountingPlanDetails?.data?.totalDifferenceInAmount
          ? undefined
          : CountingPlanDetails?.data?.totalDifferenceInAmount && CountingPlanDetails?.data?.totalDifferenceInAmount > 0
          ? '#39D98A'
          : '#FF5C5C',
    },
  ];

  return (
    <>
      <ActionBar
        title={CountingPlanDetails?.data?.name || 'N/A'}
        isLoading={CountingPlanDetails?.isBusy}
        breadcrumb={breadcrumb}
      ></ActionBar>
      <InfoPanel firstRow={firstRow} secondRow={secondRow} isBusy={CountingPlanDetails?.isBusy} />
      <LayoutContent>
        <Panel title={t(`${intlKey}.CountingDetail`)}>
          <CountingPlanDetailsGrid referenceId={id} stockCountingType={CountingPlanDetails?.data?.stockCountingType} />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default CountingPlanDetails;
