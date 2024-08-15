import { gridActions } from '@oplog/data-grid';
import {
  ActionBar,
  Box,
  Button,
  Dialog,
  DialogTypes,
  Flex,
  LayoutContent,
  Panel,
  Select,
  Tab,
  Text,
} from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, SyntheticEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GridType, ResourceType } from '../../../models';
import {
  WallToWallStockCountingPlanOutputDTO,
  WallToWallStockCountingPlansOutputDTO,
  WallToWallStockCountingPlanStockApplyState,
} from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import WarningModal from '../../molecules/WarningModal/WarningModal';
import Analytics from './bones/Analytics';
import StationEffectTrigger from './bones/StationEffectTrigger';
import SummaryModal from './bones/SummaryModal';
import W2WPlanReportsAddressGrid from './bones/W2WPlanReportsAddressGrid';
import W2WPlanReportsDamagedItemsGrid from './bones/W2WPlanReportsDamagedItemsGrid';
import W2WPlanReportsListsGrid from './bones/W2WPlanReportsListsGrid';
import W2WPlanReportsOperationGrid from './bones/W2WPlanReportsOperationGrid';
import W2WPlanReportsSKUGrid from './bones/W2WPlanReportsSKUGrid';

const intlKey = 'W2WPlanReports';

export enum W2WPlanReportsTabs {
  Operation = 'operation',
  Address = 'address',
  SKU = 'sku',
  Lists = 'lists',
  DamagedItems = 'damaged-items',
}

const W2WPlanReports: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let { id }: { id: any } = useParams();
  id = id === ':id' ? '' : id;
  const routeProps = useRouteProps();
  const [stockCountingPlans, setStockCountingPlans] = useState<WallToWallStockCountingPlanOutputDTO[]>([]);
  const [stockCountingPlanId, setStockCountingPlanId] = useState<string>('');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);

  const getCompletedWallToWallStockCountingPlansResponse: Resource<WallToWallStockCountingPlansOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCompletedWallToWallStockCountingPlans]
  );
  const applyWallToWallStockCountingPlanToStockResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.ApplyWallToWallStockCountingPlanToStock]
  );

  const tabs = [
    {
      id: W2WPlanReportsTabs.Operation,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.Operation`)}</Text>
        </Flex>
      ),
      component: <W2WPlanReportsOperationGrid stockCountingPlanId={id} />,
    },
    {
      id: W2WPlanReportsTabs.Address,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.Address`)}</Text>
        </Flex>
      ),
      component: <W2WPlanReportsAddressGrid stockCountingPlanId={id} />,
    },
    {
      id: W2WPlanReportsTabs.SKU,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.SKU`)}</Text>
        </Flex>
      ),
      component: <W2WPlanReportsSKUGrid stockCountingPlanId={id} />,
    },
    {
      id: W2WPlanReportsTabs.Lists,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.Lists`)}</Text>
        </Flex>
      ),
      component: <W2WPlanReportsListsGrid stockCountingPlanId={id} />,
    },
    {
      id: W2WPlanReportsTabs.DamagedItems,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.DamagedItems`)}</Text>
        </Flex>
      ),
      component: <W2WPlanReportsDamagedItemsGrid stockCountingPlanId={id} />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(W2WPlanReportsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  const getCurrentData = (gridTab: string) => {
    if (gridTab === W2WPlanReportsTabs.Operation || gridTab === ':tab')
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingOperationsReport,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    if (gridTab === W2WPlanReportsTabs.Address)
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingAddressesReport,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    if (gridTab === W2WPlanReportsTabs.SKU)
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingProductsReport,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    if (gridTab === W2WPlanReportsTabs.Lists)
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingListsReport,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    if (gridTab === W2WPlanReportsTabs.DamagedItems)
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingDamagedItemsReport,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingReportCounts, { stockCountingPlanId })
    );
  };

  return (
    <>
      <ActionBar
        breadcrumb={[
          { title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) },
          { title: t(`${intlKey}.ActionBar.Breadcrumb.W2W`) },
        ]}
        title={t(`${intlKey}.Title`)}
        boxShadow="none"
        fontFamily="heading"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        minHeight={300}
      >
        <Flex flexDirection="column">
          <Button onClick={() => setIsSummaryModalOpen(true)} variant="alternative" fontWeight={700} mb={8}>
            {t(`${intlKey}.SummaryModal.Summary`)}
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={
              !stockCountingPlans.find(
                plan =>
                  plan.id === stockCountingPlanId &&
                  plan.updateState === WallToWallStockCountingPlanStockApplyState.Ready
              )
            }
            variant="alternative"
            fontWeight={700}
          >
            {t(`${intlKey}.Buttons.ApplyToStock`)}
          </Button>
        </Flex>
        <Flex flexBasis="100%" flexDirection="column" position="absolute" top={100}>
          <Box width={300} ml={16}>
            <Select
              options={stockCountingPlans.map(plan => ({
                value: plan.name,
                label: <Text>{plan.name}</Text>,
              }))}
              value={stockCountingPlans.find(plan => plan.id === id)?.name}
              placeholder={t(`TrackW2WPlan.SelectStockCountingPlanName`)}
              onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                setStockCountingPlanId(stockCountingPlans.find(plan => plan.name === e.currentTarget.value)?.id || '');
                routeProps.history.push(
                  location.pathname.replace(
                    location.pathname.split('/')[2],
                    stockCountingPlans.find(plan => plan.name === e.currentTarget.value)?.id || ''
                  )
                );
              }}
              autoFocus
              isInvalid={stockCountingPlanId === ':id'}
            />
            {stockCountingPlanId === ':id' && (
              <Box color="palette.red" mt={8} fontWeight={700}>
                {t(`TrackW2WPlan.YouDidntSelect`)}
              </Box>
            )}
          </Box>
          <Analytics stockCountingPlanId={id} />
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabs={tabs}
          />
        </Panel>
      </LayoutContent>
      <SummaryModal
        isOpen={isSummaryModalOpen}
        setIsOpen={setIsSummaryModalOpen}
        stockCountingPlanId={stockCountingPlanId}
      />
      <Dialog
        message={
          <Text fontWeight={500} lineHeight="small" color="palette.black">
            <Trans i18nKey={`${intlKey}.ApplyToStockDialogMessage`} />
          </Text>
        }
        isOpen={isDialogOpen}
        isLoading={applyWallToWallStockCountingPlanToStockResponse?.isBusy}
        onApprove={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.ApplyWallToWallStockCountingPlanToStock, {
              payload: { stockCountingPlanId },
            })
          )
        }
        onCancel={() => !getCompletedWallToWallStockCountingPlansResponse?.isBusy && setIsDialogOpen(false)}
        disableEscapeButtonClose
        disableOutsideMouseEvents
        type={DialogTypes.Information}
        text={{
          approve: t(`${intlKey}.Buttons.ApplyToStock`),
          cancel: t(`${intlKey}.Buttons.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
      />
      <WarningModal
        isOpen={isWarningModalOpen}
        setModal={setIsWarningModalOpen}
        header={t(`${intlKey}.CountingNotAppliedToStock`)}
      />
      <StationEffectTrigger
        setStockCountingPlans={setStockCountingPlans}
        setIsDialogOpen={setIsDialogOpen}
        setStockCountingPlanId={setStockCountingPlanId}
        setIsWarningModalOpen={setIsWarningModalOpen}
        setIsSummaryModalOpen={setIsSummaryModalOpen}
        stockCountingPlanId={stockCountingPlanId}
        tabs={tabs}
        getCurrentData={getCurrentData}
      />
    </>
  );
};

export default W2WPlanReports;
