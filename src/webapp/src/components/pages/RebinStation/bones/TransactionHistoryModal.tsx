import { Box, Button, Ellipsis, Flex, Icon, Image, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  RebinSortingHistoryOutputDTO,
  RebinSortingHistoryOutputDTODynamicQueryOutputDTO,
} from '../../../../services/swagger';
import useRebinStore, { RebinModals } from '../../../../store/global/rebinStore';
import { StoreState } from '../../../../store/initState';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.RebinStation';

const TransactionHistoryModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rebinState, rebinAction] = useRebinStore();

  const rebinSortingGetAllRebinSortingHistoryResponse: Resource<RebinSortingHistoryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingGetAllRebinSortingHistory]
  );

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.RebinSortingGetAllRebinSortingHistory, {
        sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
      })
    );
  }, []);

  return (
    <ModalBox
      onClose={() => null}
      isOpen={rebinState.modals.TransactionHistory}
      width={1 / 2}
      maxHeight="95vh"
      zIndex={5002}
      headerText={
        <Text fontSize={30} letterSpacing="none" fontWeight="900">
          {t(`${intlKey}.MiddleBar.TransactionHistory`)}
        </Text>
      }
      icon={
        <Icon
          name="far fa-info-circle"
          fontSize="32"
          p={22}
          borderRadius="full"
          bg="palette.softBlue_lighter"
          color="palette.softBlue_light"
        />
      }
      contentBoxProps={{
        py: '60',
        px: '38',
        color: 'palette.hardBlue_darker',
        fontWeight: '700',
        lineHeight: 'xxLarge',
        overflow: 'hidden',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.4,
        zIndex: 5001,
      }}
    >
      <Flex flexDirection="column" width={1} px={0} overflow="auto" maxHeight="75vh">
        <Flex
          flexDirection="column"
          justifyContent={!rebinSortingGetAllRebinSortingHistoryResponse?.data?.count && 'center'}
          height={350}
          overflowX="hidden"
          overflowY="auto"
        >
          {rebinSortingGetAllRebinSortingHistoryResponse?.isBusy ? (
            <Icon name={'far fa-spinner fa-spin'} fontSize="48" color={'palette.softBlue'} />
          ) : !rebinSortingGetAllRebinSortingHistoryResponse?.data?.count ? (
            <Text fontSize={22} letterSpacing="none" fontWeight="900" color="palette.black">
              {t(`${intlKey}.MiddleBar.NoTransaction`)}
            </Text>
          ) : (
            rebinSortingGetAllRebinSortingHistoryResponse?.data?.data?.map(
              (item: RebinSortingHistoryOutputDTO, index: number) => (
                <Flex
                  key={index.toString()}
                  width={1}
                  height={96}
                  mb={11}
                  bg="palette.white"
                  borderRadius="sm"
                  boxShadow="small"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Flex alignItems="center">
                    <Flex width={96} bg="palette.softGrey" borderRadius="sm" p={16}>
                      <Image src={item?.imageUrl} borderRadius="sm" width={64} height={64} />
                    </Flex>
                    <Flex flexDirection="column" textAlign="left" pl={22} pb={22} fontSize={14} fontWeight={400}>
                      <Box width="30vmin">
                        <Ellipsis maxWidth={1000}>{item?.productName}</Ellipsis>
                      </Box>
                      <Box width="30vmin" pt={10} color="palette.blue_light">
                        <Ellipsis maxWidth={1000}>{item?.productBarcodes}</Ellipsis>
                      </Box>
                    </Flex>
                  </Flex>
                  <Box fontSize={16} fontWeight={700}>
                    <Text color="palette.grey">{item?.batchToteLabel}</Text>
                    <Text color="palette.softBlue" ml={22} mr={16}>
                      {item?.rebinToteLabel}
                    </Text>
                  </Box>
                </Flex>
              )
            )
          )}
        </Flex>
        <Button
          onClick={() => rebinAction.toggleModalState(RebinModals.TransactionHistory)}
          variant="alternative"
          width={1 / 4}
          mx="auto"
          mt={30}
        >
          {t(`TouchScreen.ActionButtons.Okay`)}
        </Button>
      </Flex>
    </ModalBox>
  );
};

export default TransactionHistoryModal;
