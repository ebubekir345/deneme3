import { gridActions } from '@oplog/data-grid';
import { ActionBar, Box, Button, Dialog, DialogTypes, Flex, LayoutContent, Panel, Select, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { GridType, ResourceType } from '../../../models';
import {
  WallToWallStockCountingCountsOutputDTO,
  WallToWallStockCountingPlanOutputDTO,
  WallToWallStockCountingPlansOutputDTO,
} from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import useRouteProps from '../../../utils/useRouteProps';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import AddToCountPlanModal from './bones/AddToCountPlanModal';
import Analytics from './bones/Analytics';
import CreateW2WPlanGrid from './bones/CreateW2WPlanGrid';
import PreviewModal from './bones/PreviewModal';

const intlKey = 'CreateW2WPlan';
export const initialStockCountingPlanId = '00000000-0000-0000-0000-000000000000';

const CreateW2WPlan = () => {
  const { t } = useTranslation();
  const { id }: { id: any } = useParams();
  const history = useHistory();
  const routeProps = useRouteProps();
  const dispatch = useDispatch();
  const [createdStockCountingPlans, setCreatedStockCountingPlans] = useState<WallToWallStockCountingPlanOutputDTO[]>(
    []
  );
  const [unenteredPlanName, setUnenteredPlanName] = useState('');
  const [countingPlanName, setCountingPlanName] = useState('');
  const [isInvalidNameVisible, setIsInvalidNameVisible] = useState<boolean>(false);
  const [isAddToCountPlanModalOpen, setIsAddToCountPlanModalOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [selectedCellIds, setSelectedCellIds] = useState<string[]>([]);
  const [stockCountingPlanId, setStockCountingPlanId] = useState<string>(initialStockCountingPlanId);
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState<boolean>(false);
  const getAnalyticsResponse: Resource<WallToWallStockCountingCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWallToWallStockCountingCounts]
  );
  const getCreatedWallToWallStockCountingPlansResponse: Resource<WallToWallStockCountingPlansOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCreatedWallToWallStockCountingPlans]
  );
  const checkWallToWallStockCountingPlanNameIfAvailableResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CheckWallToWallStockCountingPlanNameIfAvailable]
  );
  const startWallToWallStockCountingPlanResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.StartWallToWallStockCountingPlan]
  );

  const handleRequest = (planId: string) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingCounts, {
        stockCountingPlanId: planId,
      })
    );
    dispatch(gridActions.gridFetchRequested(GridType.WallToWallStockCountingTasksQueryCells, [planId], history));
  };

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetCreatedWallToWallStockCountingPlans));
  }, []);

  useEffect(() => {
    getCreatedWallToWallStockCountingPlansResponse?.data?.wallToWallStockCountingPlans &&
      setCreatedStockCountingPlans(getCreatedWallToWallStockCountingPlansResponse.data.wallToWallStockCountingPlans);
  }, [getCreatedWallToWallStockCountingPlansResponse]);

  useEffect(() => {
    if (checkWallToWallStockCountingPlanNameIfAvailableResponse?.isSuccess) handleRequest(initialStockCountingPlanId);
    else if (checkWallToWallStockCountingPlanNameIfAvailableResponse?.error?.code === 409)
      setIsInvalidNameVisible(true);
  }, [checkWallToWallStockCountingPlanNameIfAvailableResponse]);

  useEffect(() => {
    if (startWallToWallStockCountingPlanResponse?.isSuccess) {
      setStockCountingPlanId(initialStockCountingPlanId);
      setSelectedCellIds([]);
      setCountingPlanName('');
      setIsDialogOpen(false);
      dispatch(gridActions.gridFiltersSubmitted(GridType.WallToWallStockCountingTasksQueryCells, [], []));
      handleRequest(initialStockCountingPlanId);
    }
  }, [startWallToWallStockCountingPlanResponse]);

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
        pb={16}
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        minHeight={300}
      >
        <Flex flexDirection="column">
          <Button
            onClick={() => setIsAddToCountPlanModalOpen(true)}
            disabled={!selectedCellIds.length}
            variant="alternative"
            fontWeight={700}
            mb={8}
          >
            {t(`${intlKey}.Buttons.AddToCountPlan`)}
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={!getAnalyticsResponse?.data?.stockCountingListCount}
            variant="alternative"
            fontWeight={700}
            mb={8}
          >
            {t(`${intlKey}.Buttons.StartCountPlan`)}
          </Button>
          <Button
            onClick={() => setIsPreviewModalOpen(true)}
            variant="alternative"
            fontWeight={700}
            disabled={stockCountingPlanId === initialStockCountingPlanId}
          >
            {t(`${intlKey}.Buttons.Preview`)}
          </Button>
        </Flex>
        <Flex flexBasis="100%" flexDirection="column" position="absolute" top={100}>
          <Select
            options={
              createdStockCountingPlans.length
                ? createdStockCountingPlans.map(plan => ({
                    value: plan.name,
                    label: <Text>{plan.name}</Text>,
                  }))
                : []
            }
            placeholder={t(`${intlKey}.Placeholder`)}
            value={createdStockCountingPlans.filter(plan => plan.id === id)[0]?.name || ''}
            onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
              const selectedPlan = createdStockCountingPlans.filter(plan => plan.name === e.currentTarget.value)[0];
              if (selectedPlan) {
                setStockCountingPlanId(selectedPlan.id as string);
                setCountingPlanName(selectedPlan.name as string);
                handleRequest(selectedPlan.id as string);
              } else {
                setStockCountingPlanId(initialStockCountingPlanId);
                setCountingPlanName(unenteredPlanName);
                dispatch(
                  resourceActions.resourceRequested(ResourceType.CheckWallToWallStockCountingPlanNameIfAvailable, {
                    payload: { stockCountingPlanName: unenteredPlanName },
                  })
                );
              }
              routeProps.history.push(
                location.pathname.replace(
                  location.pathname.split('/')[2],
                  selectedPlan?.id || initialStockCountingPlanId
                )
              );
            }}
            autoFocus
            onFocus={() => setIsInvalidNameVisible(false)}
            onMenuOpen={() => setIsInvalidNameVisible(false)}
            inputValue={unenteredPlanName}
            onInputChange={(newInputValue: string) => setUnenteredPlanName(newInputValue)}
            width={200}
            creatable
            isClearable={!createdStockCountingPlans.some(plan => plan.id === stockCountingPlanId)}
            formatCreateLabel={(inputValue: string) => `"${inputValue}"`}
            styles={{
              container: (base: any) => ({
                ...base,
                pointerEvents: 'unset',
                width: 400,
                marginLeft: 16,
              }),
            }}
          />
          {isInvalidNameVisible && (
            <Box color="palette.red" mt={8} ml={22} fontWeight={600}>
              {t(`${intlKey}.ThatNameIsAlreadyTaken`)}
            </Box>
          )}
          <Analytics stockCountingPlanId={stockCountingPlanId} />
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel>
          <CreateW2WPlanGrid
            selectedCellIds={selectedCellIds}
            setSelectedCellIds={setSelectedCellIds}
            stockCountingPlanId={stockCountingPlanId}
          />
        </Panel>
      </LayoutContent>
      <AddToCountPlanModal
        isOpen={isAddToCountPlanModalOpen}
        setIsOpen={setIsAddToCountPlanModalOpen}
        selectedCellIds={selectedCellIds}
        stockCountingPlanId={stockCountingPlanId}
        setStockCountingPlanId={setStockCountingPlanId}
        setSelectedCellIds={setSelectedCellIds}
        countingPlanName={countingPlanName}
        setIsGenericErrorModalOpen={setIsGenericErrorModalOpen}
      />
      <PreviewModal
        isOpen={isPreviewModalOpen}
        setIsOpen={setIsPreviewModalOpen}
        stockCountingPlanId={stockCountingPlanId}
        setIsGenericErrorModalOpen={setIsGenericErrorModalOpen}
      />
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
      <Dialog
        message={
          <>
            <Text fontWeight={500} lineHeight="small" color="palette.black">
              <Trans
                i18nKey={`${intlKey}.CountingPlanWillStart`}
                values={{
                  listNumber: getAnalyticsResponse?.data?.stockCountingListCount,
                  addressNumber: getAnalyticsResponse?.data?.cellCount,
                }}
              />
            </Text>
            <Box mb={16} />
            <Text fontWeight={500} lineHeight="small" color="palette.black">
              {t(`${intlKey}.Approve`)}
            </Text>
          </>
        }
        isOpen={isDialogOpen}
        isLoading={startWallToWallStockCountingPlanResponse?.isBusy}
        onApprove={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.StartWallToWallStockCountingPlan, {
              payload: { stockCountingPlanId },
            })
          )
        }
        onCancel={() => setIsDialogOpen(false)}
        type={DialogTypes.Information}
        text={{
          approve: t(`${intlKey}.Start`),
          cancel: t(`${intlKey}.Return`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
      />
    </>
  );
};

export default CreateW2WPlan;
