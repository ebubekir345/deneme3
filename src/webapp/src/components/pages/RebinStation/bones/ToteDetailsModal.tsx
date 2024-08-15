import { Box, Button, Flex, Icon, Image } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { BatchPickingProductDetailOutputDTO } from '../../../../services/swagger';
import useRebinStore, { RebinModals } from '../../../../store/global/rebinStore';
import { StoreState } from '../../../../store/initState';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.RebinStation';

interface IToteDetailsModal {
  isDropToteClicked: boolean;
  setIsDropToteClicked: Function;
}

const ToteDetailsModal: FC<IToteDetailsModal> = ({ isDropToteClicked, setIsDropToteClicked }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rebinState, rebinAction] = useRebinStore();

  const rebinSortingGetBatchPickingToteDetailsResponse: Resource<BatchPickingProductDetailOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingGetBatchPickingToteDetails]
  );

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.RebinSortingGetBatchPickingToteDetails, {
        payload: {
          sortingProcessReferenceNumber: rebinState.sortingProcessReferenceNumber,
          batchPickingToteLabel: rebinState.toteLabel,
        },
      })
    );
  }, []);

  return (
    <ModalBox
      onClose={() => null}
      isOpen={rebinState.modals.ToteDetails}
      width={640}
      headerText={t(`${intlKey}.${isDropToteClicked ? `CompleteTheProcess` : `ToteDetails`}`)}
      subHeaderText={
        isDropToteClicked && (
          <Box fontWeight={400}>
            <Trans i18nKey={`${intlKey}.YouWillConfirmMissing`} count={rebinState.productCount} />
          </Box>
        )
      }
      icon={
        <Flex
          width={76}
          height={76}
          borderRadius="full"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            name={isDropToteClicked ? 'far fa-engine-warning' : 'far fa-info-circle'}
            fontSize="32"
            color="palette.softBlue_light"
          />
        </Flex>
      }
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
    >
      <Flex flexDirection="column" width={1}>
        <Flex flexDirection="column" maxHeight={350} overflowX="hidden" overflowY="auto">
          {rebinSortingGetBatchPickingToteDetailsResponse?.data?.map(remainingItem => (
            <Box key={remainingItem?.sku} width={1}>
              <Flex
                mb={11}
                bg="palette.white"
                borderRadius="sm"
                boxShadow="small"
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex
                  width={92}
                  height={92}
                  bg="palette.softGrey"
                  borderRadius="4px 0 0 4px"
                  borderTopRightRadius="sm"
                  borderTopLeftRadius="sm"
                  p={16}
                  justifyContent="center"
                  alignItems="center"
                  flexShrink={0}
                >
                  <Image src={remainingItem?.imageURL} borderRadius="md" width={64} height={64} />
                </Flex>
                <Flex flexDirection="column" flexGrow={1} pl={22} pr={52} py={22}>
                  <Box
                    fontSize={16}
                    color="palette.hardBlue_Darker"
                    textOverflow="ellipsis"
                    display="-webkit-box"
                    overflow="hidden"
                    style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                    alignSelf="flex-start"
                  >
                    {remainingItem?.name}
                  </Box>
                  <Box alignSelf="flex-start" fontSize="16px" color="palette.blue_light" pt={4}>
                    {remainingItem?.barcodes}
                  </Box>
                </Flex>
                <Box mr={38} fontSize={16} fontWeight={700} color="palette.softBlue" whiteSpace="nowrap">
                  {remainingItem?.amount}
                </Box>
              </Flex>
            </Box>
          ))}
        </Flex>
        <Flex justifyContent="space-evenly" mt={44}>
          {isDropToteClicked && (
            <Button
              onClick={() => {
                setIsDropToteClicked(false);
                rebinAction.toggleModalState(RebinModals.ToteDetails);
              }}
              variant="light"
            >
              {t(`TouchScreen.ActionButtons.Cancel`)}
            </Button>
          )}
          <Button
            onClick={() => {
              isDropToteClicked && rebinAction.toggleModalState(RebinModals.DropTote);
              rebinAction.toggleModalState(RebinModals.ToteDetails);
            }}
            variant="alternative"
          >
            {t(`TouchScreen.ActionButtons.Okay`)}
          </Button>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default ToteDetailsModal;
