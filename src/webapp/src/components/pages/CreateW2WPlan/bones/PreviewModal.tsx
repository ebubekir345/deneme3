import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Button, Dialog, DialogTypes, Flex, Icon, Modal, ModalContent, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import Analytics from './Analytics';

interface IPreviewModal {
  isOpen: boolean;
  setIsOpen: Function;
  stockCountingPlanId: string;
  setIsGenericErrorModalOpen: Function;
}

const intlKey = 'CreateW2WPlan.PreviewModal';

const PreviewModal: FC<IPreviewModal> = ({
  isOpen,
  setIsOpen,
  stockCountingPlanId,
  setIsGenericErrorModalOpen,
}): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [stockCountingListId, setStockCountingListId] = useState<string>('');
  const [isRemoveListClicked, setIsRemoveListClicked] = useState<boolean>(false);
  const [cellId, setCellId] = useState<number | undefined>();
  const previewWallToWallStockCountingPlanListsGridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PreviewWallToWallStockCountingPlanLists, state.grid)
  );
  const previewWallToWallStockCountingPlanItemsGridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PreviewWallToWallStockCountingPlanItems, state.grid)
  );
  const deleteWallToWallStockCountingListResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.DeleteWallToWallStockCountingList]
  );
  const deleteWallToWallStockCountingAddressResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.DeleteWallToWallStockCountingAddress]
  );

  const initializer = () => {
    setIsDialogOpen(false);
    setIsRemoveListClicked(false);
    dispatch(resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingCounts, { stockCountingPlanId }));
    dispatch(gridActions.gridStateCleared(GridType.PreviewWallToWallStockCountingPlanItems));
    dispatch(gridActions.gridFetchRequested(GridType.PreviewWallToWallStockCountingPlanLists, [stockCountingPlanId]));
  };

  useEffect(() => {
    isOpen &&
      dispatch(gridActions.gridFetchRequested(GridType.PreviewWallToWallStockCountingPlanLists, [stockCountingPlanId]));
  }, [isOpen]);

  useEffect(() => {
    stockCountingListId &&
      dispatch(gridActions.gridFetchRequested(GridType.PreviewWallToWallStockCountingPlanItems, [stockCountingListId]));
  }, [stockCountingListId]);

  useEffect(() => {
    if (deleteWallToWallStockCountingListResponse?.isSuccess) {
      setStockCountingListId('');
      initializer();
    } else if (deleteWallToWallStockCountingListResponse?.error) setIsGenericErrorModalOpen(true);
  }, [deleteWallToWallStockCountingListResponse]);

  useEffect(() => {
    if (deleteWallToWallStockCountingAddressResponse?.isSuccess) {
      setCellId(undefined);
      initializer();
    } else if (deleteWallToWallStockCountingAddressResponse?.error) setIsGenericErrorModalOpen(true);
  }, [deleteWallToWallStockCountingAddressResponse]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="6xl"
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.6,
        }}
        contentBoxProps={{
          overflow: 'hidden',
          px: '0',
        }}
        showCloseButton
        closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
      >
        <Box m="auto" mt={32}>
          <Analytics stockCountingPlanId={stockCountingPlanId} />
        </Box>
        <ModalContent flexDirection="column" m="auto" fontSize={22} px={0} overflow="auto">
          <Flex justifyContent="space-between" m="auto" mt={32} width={3 / 4}>
            <Box width={400}>
              <Box fontWeight={700} fontSize={32} mb={8} color="palette.grey_darker">
                {t(`${intlKey}.Lists`)}
              </Box>
              {previewWallToWallStockCountingPlanListsGridRawData.length ? (
                <Box border="sm" borderRadius="md" p={8}>
                  {previewWallToWallStockCountingPlanListsGridRawData.map((i, index, arr) => {
                    return (
                      <Flex
                        key={index.toString()}
                        onClick={() => setStockCountingListId(i.id)}
                        alignItems="center"
                        mb={index !== arr.length - 1 && 8}
                      >
                        <Button
                          variant={i.id === stockCountingListId ? 'alternative' : 'light'}
                          outline="none !important"
                        >
                          <Flex justifyContent="space-between" width={300} fontFamily="base">
                            <Box>{i['name']}</Box>
                            <Box>
                              {i['addressCount']} {t(`${intlKey}.Address`)}
                            </Box>
                          </Flex>
                        </Button>
                        <Icon
                          name="fas fa-trash-alt"
                          fontSize="26"
                          ml={8}
                          cursor="pointer"
                          color="palette.red"
                          onClick={() => {
                            setIsRemoveListClicked(true);
                            setIsDialogOpen(true);
                          }}
                        />
                      </Flex>
                    );
                  })}
                </Box>
              ) : null}
            </Box>

            <Box width={350}>
              <Box fontWeight={700} fontSize={32} mb={8} color="palette.grey_darker">
                {t(`${intlKey}.Addresses`)}
              </Box>
              {previewWallToWallStockCountingPlanItemsGridRawData.length ? (
                <Box border="sm" borderRadius="md" p={8}>
                  {previewWallToWallStockCountingPlanItemsGridRawData.map((i, index, arr) => {
                    return (
                      <Flex key={index.toString()} alignItems="center" mb={index !== arr.length - 1 && 8}>
                        <Flex
                          justifyContent="space-between"
                          border="xs"
                          borderRadius="md"
                          py={8}
                          px={16}
                          width={300}
                          fontFamily="base"
                          fontSize="16"
                          fontWeight={800}
                        >
                          <Box>{i['cellLabel']}</Box>
                          <Box>
                            {i['stockCount']} {t(`${intlKey}.Stock`)}
                          </Box>
                        </Flex>
                        <Icon
                          name="fas fa-trash-alt"
                          fontSize="26"
                          ml={8}
                          cursor="pointer"
                          color="palette.red"
                          onClick={() => {
                            setCellId(i['cellId']);
                            setIsDialogOpen(true);
                          }}
                        />
                      </Flex>
                    );
                  })}
                </Box>
              ) : null}
            </Box>
          </Flex>
          <Button onClick={() => setIsOpen(false)} variant="alternative" fontWeight={700} m="auto" mb={32} mt={64}>
            {t(`Modal.Success.Okay`)}
          </Button>
        </ModalContent>
      </Modal>
      <Dialog
        message={
          <Text fontWeight={500} lineHeight="small" color="palette.black">
            {t(`${intlKey}.${isRemoveListClicked ? `AreYouSureToRemoveList` : `AreYouSureToRemoveAddress`}`)}
          </Text>
        }
        isOpen={isDialogOpen}
        onApprove={() =>
          isRemoveListClicked
            ? dispatch(
                resourceActions.resourceRequested(ResourceType.DeleteWallToWallStockCountingList, {
                  payload: { stockCountingListId },
                })
              )
            : dispatch(
                resourceActions.resourceRequested(ResourceType.DeleteWallToWallStockCountingAddress, {
                  payload: { stockCountingListId, cellId: cellId },
                })
              )
        }
        onCancel={() => {
          setIsRemoveListClicked(false);
          setIsDialogOpen(false);
        }}
        type={DialogTypes.Warning}
        text={{
          approve: t(`Modal.MultiStep.Next`),
          cancel: t(`Modal.MultiStep.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
          zIndex: 4010,
        }}
      />
    </>
  );
};

export default PreviewModal;
