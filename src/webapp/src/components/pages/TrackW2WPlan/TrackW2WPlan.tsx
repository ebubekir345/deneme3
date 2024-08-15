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
  WallToWallStockCountingCountsOutputDTO,
  WallToWallStockCountingPlanOutputDTO,
} from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import WarningModal from '../../molecules/WarningModal/WarningModal';
import AddNewAddressModal from './bones/AddNewAddressModal';
import Analytics from './bones/Analytics';
import CreateCountingForIncorrectAddressesModal from './bones/CreateCountingForIncorrectAddressesModal';
import StationEffectTrigger from './bones/StationEffectTrigger';
import TrackW2WPlanCountingAddressesGrid from './bones/TrackW2WPlanCountingAddressesGrid';
import TrackW2WPlanCountingListsGrid from './bones/TrackW2WPlanCountingListsGrid';
import TrackW2WPlanDamagedProductsGrid from './bones/TrackW2WPlanDamagedProductsGrid';

const intlKey = 'TrackW2WPlan';

export enum TrackW2WPlanTabs {
  CountingLists = 'counting-lists',
  CountingAddresses = 'counting-addresses',
  DamagedProducts = 'damaged-products',
}

const TrackW2WPlan: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let { id, tab }: { id: any; tab: any } = useParams();
  id = id === ':id' ? '' : id;
  const routeProps = useRouteProps();
  const [isAddNewAddressModalOpen, setIsAddNewAddressModalOpen] = useState<boolean>(false);
  const [isCreateCountingForIncorrectAddressesModalOpen, setIsCreateCountingForIncorrectAddressesModalOpen] = useState<
    boolean
  >(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [isRefreshButtonClickable, setIsRefreshButtonClickable] = useState(true);
  const [stockCountingPlans, setStockCountingPlans] = useState<WallToWallStockCountingPlanOutputDTO[]>([]);
  const [stockCountingPlanId, setStockCountingPlanId] = useState<string>('');
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState<boolean>(false);

  const finishWallToWallStockCountingPlanResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.FinishWallToWallStockCountingPlan]
  );
  const getAnalyticsResponse: Resource<WallToWallStockCountingCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWallToWallStockCountingCounts]
  );

  const tabs = [
    {
      id: TrackW2WPlanTabs.CountingLists,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.CountingLists`)}</Text>
        </Flex>
      ),
      component: <TrackW2WPlanCountingListsGrid stockCountingPlanId={id} />,
    },
    {
      id: TrackW2WPlanTabs.CountingAddresses,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.CountingAddresses`)}</Text>
        </Flex>
      ),
      component: <TrackW2WPlanCountingAddressesGrid stockCountingPlanId={id} />,
    },
    {
      id: TrackW2WPlanTabs.DamagedProducts,
      title: (
        <Flex justifyContent="center" width={215}>
          <Text>{t(`${intlKey}.Titles.DamagedProducts`)}</Text>
        </Flex>
      ),
      component: <TrackW2WPlanDamagedProductsGrid stockCountingPlanId={id} />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(TrackW2WPlanTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  const getCurrentData = (gridTab: string) => {
    setIsRefreshButtonClickable(false);
    if (gridTab === TrackW2WPlanTabs.CountingLists || gridTab === ':tab')
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingLists,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    if (gridTab === TrackW2WPlanTabs.CountingAddresses)
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingAddresses,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    if (gridTab === TrackW2WPlanTabs.DamagedProducts)
      dispatch(
        gridActions.gridFetchRequested(
          GridType.QueryWallToWallStockCountingDamagedItems,
          [stockCountingPlanId],
          routeProps.history
        )
      );
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingTrackingCounts, { stockCountingPlanId })
    );
    dispatch(resourceActions.resourceRequested(ResourceType.GetActiveWallToWallStockCountingPlans));
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
        pb={64}
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        minHeight={420}
      >
        <Flex flexDirection="column">
          <Button
            onClick={() => setIsCreateCountingForIncorrectAddressesModalOpen(true)}
            disabled={!stockCountingPlanId}
            variant="alternative"
            fontWeight={700}
            mb={8}
          >
            {t(`${intlKey}.Buttons.CountWrongAddresses`)}
          </Button>
          <Button
            onClick={() => setIsAddNewAddressModalOpen(true)}
            disabled={!stockCountingPlanId}
            variant="alternative"
            fontWeight={700}
            mb={8}
          >
            {t(`${intlKey}.Buttons.AddNewAddress`)}
          </Button>
          <Button
            onClick={() => getCurrentData(tab)}
            disabled={!isRefreshButtonClickable || !stockCountingPlanId}
            variant="alternative"
            fontWeight={700}
            mb={8}
          >
            {t(`${intlKey}.Buttons.Refresh`)}
          </Button>
          <Button
            onClick={() =>
              dispatch(
                resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingCounts, {
                  stockCountingPlanId,
                })
              )
            }
            disabled={!stockCountingPlans.find(plan => plan.id === stockCountingPlanId)?.readyToComplete}
            variant="alternative"
            fontWeight={700}
          >
            {t(`${intlKey}.Buttons.EndCounting`)}
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
              placeholder={t(`${intlKey}.SelectStockCountingPlanName`)}
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
                {t(`${intlKey}.YouDidntSelect`)}
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
          />{' '}
        </Panel>
      </LayoutContent>
      <AddNewAddressModal
        isOpen={isAddNewAddressModalOpen}
        setIsOpen={setIsAddNewAddressModalOpen}
        stockCountingPlanId={stockCountingPlanId}
        getCurrentData={getCurrentData}
      />
      <CreateCountingForIncorrectAddressesModal
        isOpen={isCreateCountingForIncorrectAddressesModalOpen}
        onClose={() => setIsCreateCountingForIncorrectAddressesModalOpen(false)}
        stockCountingPlanId={stockCountingPlanId}
        getCurrentData={getCurrentData}
        setIsGenericErrorModalOpen={setIsGenericErrorModalOpen}
      />
      <Dialog
        message={
          <Text fontWeight={500} lineHeight="small" color="palette.black">
            <Trans
              i18nKey={`${intlKey}.CountingSummary`}
              values={{
                listNumber: getAnalyticsResponse?.data?.stockCountingListCount,
                addressNumber: getAnalyticsResponse?.data?.cellCount,
              }}
            />
          </Text>
        }
        isOpen={isDialogOpen}
        isLoading={finishWallToWallStockCountingPlanResponse?.isBusy}
        onApprove={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.FinishWallToWallStockCountingPlan, {
              payload: { stockCountingPlanId },
            })
          )
        }
        onCancel={() => setIsDialogOpen(false)}
        type={DialogTypes.Information}
        text={{
          approve: t(`${intlKey}.FinishCount`),
          cancel: t(`${intlKey}.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
      />
      <WarningModal
        isOpen={isWarningModalOpen}
        setModal={setIsWarningModalOpen}
        header={t(`${intlKey}.CountingNotCompleted`)}
      />
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
      <StationEffectTrigger
        setStockCountingPlans={setStockCountingPlans}
        setIsDialogOpen={setIsDialogOpen}
        setStockCountingPlanId={setStockCountingPlanId}
        setIsRefreshButtonClickable={setIsRefreshButtonClickable}
        setIsWarningModalOpen={setIsWarningModalOpen}
        isRefreshButtonClickable={isRefreshButtonClickable}
        stockCountingPlanId={stockCountingPlanId}
        tabs={tabs}
        getCurrentData={getCurrentData}
      />
    </>
  );
};

export default TrackW2WPlan;
