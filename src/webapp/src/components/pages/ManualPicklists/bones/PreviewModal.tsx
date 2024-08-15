import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Button, Flex, Icon, Input, ModalContent, Text, useToast } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import {
  PickingFlowTagPicklistDetailsOutputDTO,
  PickingFlowTagPicklistTypeDetailsOutputDTO,
  UnassignableOrders,
} from '../../../../services/swagger';
import useCommonStore from '../../../../store/global/commonStore';
import { StoreState } from '../../../../store/initState';
import { ModalBox } from '../../../molecules/TouchScreen';
import AssignmentFailedOrdersModal from './AssignmentFailedOrdersModal';

const intlKey = 'ManualPicklists';

const PreviewModal: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [{ selectedSalesOrderIds }, { setSelectedSalesOrderIds }] = useCommonStore();
  const [pickListName, setPickListName] = useState<string>('');
  const [maxSalesOrdersPerBatch, setMaxSalesOrdersPerBatch] = useState<null | number>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isAssignmentFailedOrdersModalOpen, setIsAssignmentFailedOrdersModalOpen] = useState<boolean>(false);
  const [unassignableOrders, setUnassignableOrders] = useState<UnassignableOrders[]>([]);
  const previewManualPicklistResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.PreviewManualPicklist]
  );
  const createManualPicklistResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateManualPicklist]
  );
  const appliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(GridType.ManualPicklists, state.grid)
  );
  const pickListCount: number = previewManualPicklistResponse?.data?.picklistTypeDetails.reduce(
    (accumulator: number, pickList: PickingFlowTagPicklistTypeDetailsOutputDTO) =>
      accumulator + (pickList?.totalPicklistCount || 0),
    0
  );
  let decreaser: number = pickListCount;

  const handleAddOrdersToBatch = () => {
    const count =
      selectedSalesOrderIds?.length -
      createManualPicklistResponse?.data?.assignmentFailedOrders.unassignableOrders.length;
    count
      ? toast({
          position: 'bottom-left',
          variant: 'success',
          title: t(`${intlKey}.Toast.SuccessTitle`),
          description: t(`${intlKey}.Toast.SuccessDescription`, {
            count: count,
          }),
          duration: 5000,
          icon: { name: 'fas fa-check-circle' },
        })
      : toast({
          position: 'bottom-left',
          variant: 'danger',
          title: t(`${intlKey}.Toast.FailTitle`),
          description: t(`${intlKey}.Toast.FailDescription`),
          duration: 5000,
          icon: { name: 'fas fa-times-circle' },
        });
    setSelectedSalesOrderIds([]);
    dispatch(
      gridActions.gridFiltersSubmitted(
        GridType.ManualPicklists,
        appliedFilters.filter(filter => filter.property !== 'id'),
        []
      )
    );
    dispatch(gridActions.gridFetchRequested(GridType.ManualPicklists, []));
    dispatch(resourceActions.resourceInit(ResourceType.CreateManualPicklist));
    setUnassignableOrders([]);
    setPickListName('');
    setMaxSalesOrdersPerBatch(null);
    setIsPreviewModalOpen(false);
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.PreviewManualPicklist));
      dispatch(resourceActions.resourceInit(ResourceType.CreateManualPicklist));
    };
  }, []);

  useEffect(() => {
    if (previewManualPicklistResponse?.isSuccess) {
      if (
        previewManualPicklistResponse?.data.picklistTypeDetails.length &&
        !previewManualPicklistResponse.data.assignmentFailedOrders.unassignableOrders.length
      )
        setIsPreviewModalOpen(true);
      else {
        setUnassignableOrders(previewManualPicklistResponse.data.assignmentFailedOrders.unassignableOrders);
        setIsAssignmentFailedOrdersModalOpen(true);
      }
    }
  }, [previewManualPicklistResponse]);

  useEffect(() => {
    if (createManualPicklistResponse?.isSuccess) {
      dispatch(resourceActions.resourceInit(ResourceType.PreviewManualPicklist));
      if (createManualPicklistResponse?.data?.assignmentFailedOrders.unassignableOrders.length) {
        setPickListName('');
        setIsPreviewModalOpen(false);
        setUnassignableOrders(createManualPicklistResponse?.data?.assignmentFailedOrders.unassignableOrders);
        setIsAssignmentFailedOrdersModalOpen(true);
      } else handleAddOrdersToBatch();
    }
  }, [createManualPicklistResponse]);

  return (
    <>
      <ModalBox
        showOverlay
        disableEscapeButtonClose
        disableOutsideMouseEvents
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        width={1400}
        maxHeight="95vh"
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.6,
        }}
        subHeaderText={
          <Text fontSize="14" fontWeight={700}>
            {t(`${intlKey}.PreviewModalInfo`)}
          </Text>
        }
        icon={<Icon name="fas fa-info-circle" mt={32} fontSize="48" color="palette.softBlue_light" />}
        contentBoxProps={{
          overflow: 'hidden',
        }}
      >
        <ModalContent display="flex" flexDirection="column" px={0} overflow="auto" maxHeight="75vh">
          <Flex mb={32} mx="auto" width={3 / 4} fontWeight={700} fontSize={22} textAlign="left" alignItems="center" justifyContent="space-between">
            <Text color="palette.softBlue" width={1 / 3}>
              {t(`${intlKey}.BatchName`)}
            </Text>
            <Input
              fontSize={22}
              pl={22}
              width={580}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => setPickListName(e.currentTarget.value)}
              value={pickListName}
              maxLength={50}
              data-testid="input-box"
              autoFocus
            />
          </Flex>
          <Flex mb={64} mx="auto" width={3 / 4} fontWeight={700} fontSize={22} textAlign="left" alignItems="center" justifyContent="space-between">
            <Text color="palette.softBlue" width={1 / 2}>
              {t(`${intlKey}.MaxOrderCountPerList`)}
            </Text>
            <Input
              fontSize={22}
              pl={22}
              width={200}
              type="number"
              min={1}
              max={
                selectedSalesOrderIds?.length -
                createManualPicklistResponse?.data?.assignmentFailedOrders.unassignableOrders.length
              }
              onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                if (e.currentTarget.value.trim() !== '0')
                  e.currentTarget.value = e.currentTarget.value.replace(/^0+/, '');
                parseInt(e.currentTarget.value) <=
                  selectedSalesOrderIds?.length -
                    previewManualPicklistResponse.data.assignmentFailedOrders.unassignableOrders.length &&
                  setMaxSalesOrdersPerBatch(parseInt(e.currentTarget.value));
              }}
              value={maxSalesOrdersPerBatch}
              maxLength={50}
              data-testid="input-box-1"
            />
          </Flex>
          <Flex justifyContent="space-evenly">
            {previewManualPicklistResponse?.data?.picklistTypeDetails.map(
              (pickList: PickingFlowTagPicklistTypeDetailsOutputDTO, index: number) => (
                <Flex
                  key={index.toString()}
                  flexDirection="column"
                  textAlign="left"
                  border="sm"
                  boxShadow="small"
                  borderColor="palette.snow_lighter"
                  bg="palette.snow_lighter"
                  borderRadius="lg"
                  p={16}
                >
                  <Box
                    mb="14"
                    fontSize={22}
                    fontWeight={700}
                    color="palette.lapis"
                    textDecoration="underline"
                    textAlign="center"
                  >
                    {t(`Enum.${pickList.pickingFlowType}`)}
                  </Box>
                  <Flex fontSize="18" flexDirection="column" alignItems="center">
                    <Box>
                      {pickList.totalPicklistCount}
                      {'  '}
                      {t(`${intlKey}.PickListCount`)}
                    </Box>
                    <Box mt="4" mb="22">
                      {pickList.totalOrdersCount} {t(`${intlKey}.OrderAmount`)}
                    </Box>
                    <Flex fontSize="14" flexDirection="column">
                      {pickList.picklistDetails?.map(
                        (detail: PickingFlowTagPicklistDetailsOutputDTO, index: number) => {
                          --decreaser;
                          return (
                            <Box key={index.toString()}>
                              <Box mb={8} fontSize={16} fontWeight={700} color="palette.blue_dark">
                                {t(`${intlKey}.PickListCount`)} {pickListCount - decreaser}
                              </Box>
                              <Box mb={4}>
                                {' * '} {detail.salesOrdersCount} {t(`${intlKey}.OrderAmount`)}
                              </Box>
                              <Box mb={4}>
                                {' * '} {detail.vehicleVariation} {t(`${intlKey}.Vehicle`)}
                              </Box>
                              <Box mb={16}>
                                {' * '} {t(`${intlKey}.Zone`)} {detail.zoneName}
                              </Box>
                            </Box>
                          );
                        }
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              )
            )}
          </Flex>
          <Flex justifyContent="space-between" my={32} width={1 / 3} mx="auto">
            <Button
              onClick={() => {
                setIsPreviewModalOpen(false);
                setPickListName('');
              }}
              disabled={createManualPicklistResponse?.isBusy}
              variant="alternative"
              fontWeight={700}
            >
              {t(`TouchScreen.ActionButtons.Return`)}
            </Button>
            <Button
              onClick={() => {
                setSelectedSalesOrderIds(
                  selectedSalesOrderIds.filter(
                    salesOrderId =>
                      !previewManualPicklistResponse?.data.assignmentFailedOrders.unassignableOrders.some(
                        (order: UnassignableOrders) => order.salesOrderId === salesOrderId
                      )
                  )
                );
                dispatch(
                  resourceActions.resourceRequested(ResourceType.CreateManualPicklist, {
                    payload: {
                      salesOrderIds: selectedSalesOrderIds.filter(
                        salesOrderId =>
                          !previewManualPicklistResponse?.data.assignmentFailedOrders.unassignableOrders.some(
                            (order: UnassignableOrders) => order.salesOrderId === salesOrderId
                          )
                      ),
                      picklistRequestName: pickListName,
                      ...(maxSalesOrdersPerBatch ? { maxSalesOrdersPerBatch: maxSalesOrdersPerBatch } : null),
                    },
                  })
                );
              }}
              isLoading={createManualPicklistResponse?.isBusy}
              disabled={createManualPicklistResponse?.isBusy}
              variant="alternative"
              fontWeight={700}
            >
              {t(`${intlKey}.Create`)}
            </Button>
          </Flex>
        </ModalContent>
      </ModalBox>
      <AssignmentFailedOrdersModal
        isAssignmentFailedOrdersModalOpen={isAssignmentFailedOrdersModalOpen}
        setIsAssignmentFailedOrdersModalOpen={setIsAssignmentFailedOrdersModalOpen}
        orders={unassignableOrders}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
        handleAddOrdersToBatch={handleAddOrdersToBatch}
      />
    </>
  );
};

export default PreviewModal;
