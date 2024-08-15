import { Box, Flex, Icon, Image } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import useSingleItemPackingStore, { SingleItemPackingModals } from '../../../../store/global/singleItemPackingStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

function DropToteDialogModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useSingleItemPackingStore();

  const getSingleItemSalesOrdersToteRemainingItemsResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSingleItemSalesOrdersToteRemainingItems]
  );
  const getSingleItemRemainingToteSalesOrdersCountResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSingleItemRemainingToteSalesOrdersCount]
  );

  const getSingleItemSalesOrdersToteRemainingItems = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetSingleItemSalesOrdersToteRemainingItems, params));
  };

  useEffect(() => {
    if (packingState.modals.DropTote) {
      getSingleItemSalesOrdersToteRemainingItems({ toteLabel: packingState.toteLabel });
    }
  }, [packingState.modals.DropTote]);

  useEffect(() => {
    if (
      (getSingleItemSalesOrdersToteRemainingItemsResponse?.isSuccess &&
        getSingleItemRemainingToteSalesOrdersCountResponse?.data?.remainingToteSalesOrdersCount === 0) ||
      getSingleItemSalesOrdersToteRemainingItemsResponse?.error?.message?.includes('Tote with ToteLabel')
    ) {
      packingAction.toggleModalState(SingleItemPackingModals.DropTote, false);
      packingAction.toggleModalState(SingleItemPackingModals.ParkAreaScan, true);
    }
  }, [getSingleItemSalesOrdersToteRemainingItemsResponse]);

  useEffect(() => {
    if (getSingleItemRemainingToteSalesOrdersCountResponse?.data?.remainingToteSalesOrdersCount === 0)
      setTimeout(() => {
        packingAction.toggleModalState(SingleItemPackingModals.ParkAreaScan, true);
      }, 4000);
  }, [getSingleItemRemainingToteSalesOrdersCountResponse]);

  return (
    <>
      <ModalBox
        onClose={() => null}
        isOpen={packingState.modals.DropTote}
        width={640}
        headerText={t(`${intlKey}.SingleItemPackingStation.DropToteModal.AreYouSureToComplete`)}
        subHeaderText={
          <Trans
            i18nKey={`${intlKey}.SingleItemPackingStation.DropToteModal.InformBeforeDrop`}
            values={{
              count: getSingleItemSalesOrdersToteRemainingItemsResponse?.data?.reduce(
                (acc, cur) => acc + cur.amount,
                0
              ),
            }}
          />
        }
        contentBoxProps={{
          padding: '52px 36px 36px 36px',
          color: 'palette.hardBlue_Darker',
        }}
        icon={
          <Flex
            width={76}
            height={76}
            borderRadius="50%"
            bg="palette.softBlue_lighter"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="far fa-engine-warning" fontSize="28px" color="#9dbff9" />
          </Flex>
        }
      >
        <Flex flexDirection="column" width={1}>
          <Flex flexDirection="column" maxHeight={350} overflow="auto">
            {getSingleItemSalesOrdersToteRemainingItemsResponse?.data?.map(remainingItem => (
              <Box key={remainingItem?.sku} width={1}>
                <Flex
                  mb={12}
                  bg="palette.white"
                  borderRadius="4px"
                  boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.1)"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Flex
                    width={'92px'}
                    height={'92px'}
                    bg="palette.softGrey"
                    borderRadius="4px 0 0 4px"
                    p={16}
                    justifyContent="center"
                    alignItems="center"
                    flexShrink={0}
                  >
                    <Image src={remainingItem?.imageUrl} borderRadius="8px" width={'66px'} height={'66px'} />
                  </Flex>
                  <Flex flexDirection="column" flexGrow={1} paddingLeft={20} paddingRight={50} py="20px">
                    <Box
                      fontSize={'16px'}
                      color="palette.hardBlue_Darker"
                      textOverflow="ellipsis"
                      display="-webkit-box"
                      overflow="hidden"
                      style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                      alignSelf="flex-start"
                    >
                      {remainingItem?.productName}
                    </Box>

                    {remainingItem?.barcodes?.length !== 0 && (
                      <Box alignSelf="flex-start" fontSize="16px" color="palette.blue_light" pt={4}>
                        {remainingItem?.barcodes?.join()}
                      </Box>
                    )}
                  </Flex>
                  <Box mr={36} fontSize={16} fontWeight="bold" color="palette.softBlue" whiteSpace="nowrap">
                    {remainingItem?.amount}
                  </Box>
                </Flex>
              </Box>
            ))}
          </Flex>
          <Flex justifyContent="center" mt={46}>
            <ActionButton
              onClick={() => packingAction.toggleModalState(SingleItemPackingModals.DropTote)}
              height="48px"
              width="126px"
              backgroundColor="transparent"
              color="palette.softBlue"
              fontSize="20px"
              letterSpacing="-0.63px"
              borderRadius="5.5px"
              mb="0"
              bs="0"
              fontWeight="bold"
              px={12}
              border="solid 1.4px palette.softBlue"
            >
              {t(`${intlKey}.ActionButtons.Cancel`)}
            </ActionButton>
            <ActionButton
              onClick={() => {
                packingAction.toggleModalState(SingleItemPackingModals.DropTote);
                packingAction.toggleModalState(SingleItemPackingModals.ParkAreaScan);
              }}
              height="48px"
              width="126px"
              backgroundColor="palette.softBlue"
              color="palette.white"
              fontSize="20px"
              letterSpacing="-0.63px"
              borderRadius="5.5px"
              fontWeight="bold"
              px={12}
              mb="0"
              bs="0"
              border="none"
              ml={24}
            >
              {t(`${intlKey}.ActionButtons.Complete`)}
            </ActionButton>
          </Flex>
        </Flex>
      </ModalBox>
      <ModalBox
        onClose={() => null}
        isOpen={packingState.modals.ParkAreaScan}
        width={640}
        headerText={t(`${intlKey}.SingleItemPackingStation.DropToteModal.PackingCompleted`)}
        subHeaderText={
          <Trans
            i18nKey={`${intlKey}.SingleItemPackingStation.DropToteModal.ScanParkArea`}
            values={{
              toteLabel: packingState.toteLabel,
            }}
          />
        }
        icon={<Box fontSize="48">🎊 👏🏻</Box>}
        contentBoxProps={{
          py: '60',
          px: '38',
          color: 'palette.hardBlue_darker',
          fontWeight: '700',
          lineHeight: 'xxLarge',
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.4,
        }}
      />
    </>
  );
}

export default DropToteDialogModal;
