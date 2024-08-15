import { Box, Button, Ellipsis, Flex, Image, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { RasPlaceProductOutputDTO } from '../../../../services/swagger';
import useRASPickingStore, { RASPickingModals } from '../../../../store/global/rasPickingStore';
import { StoreState } from '../../../../store/initState';
import { ModalBox } from '../../../molecules/TouchScreen';
import { CellBgs, commonProps } from './MiddleBar';

const intlKey = 'TouchScreen.RASPickingStation';

const buttonProps = {
  fontWeight: 400,
  fontFamily: 'touchScreen',
  fontSize: 26,
  borderRadius: 'sm',
  px: 32,
  _focus: {
    outline: 'none',
  },
};

const ProblemProductModal = () => {
  const { t } = useTranslation();
  const [pickingState, pickingAction] = useRASPickingStore();
  const dispatch = useDispatch();
  const rasPickLostItemResponse: Resource<RasPlaceProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasPickLostItem]
  );

  return (
    <ModalBox
      onClose={() => null}
      isOpen={pickingState.modals.ProblemProduct}
      width={4 / 5}
      headerText={
        <Box fontSize={32} fontWeight={500} letterSpacing="negativeLarge">
          {t(`${intlKey}.ProblemProductModal.ApproveForMissing`)}
        </Box>
      }
      contentBoxProps={{
        py: '60',
        px: '30',
        color: 'palette.slate_dark',
        bg: 'palette.softGrey',
        borderRadius: 'md',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      icon={<></>}
    >
      <Flex flexDirection="column" alignItems="center" width={3 / 4}>
        <Flex alignContent="center" justifyContent="space-between" width={1} borderBottomRightRadius="lg">
          <Box width={1 / 3}>
            <Image src={pickingState.product?.imageURL} height="100%" borderRadius="sm" />
          </Box>
          <Flex {...commonProps} width={1 / 3} fontSize={22} fontWeight={500}>
            <Box>{t(`${intlKey}.MiddleBar.ProductName`)}</Box>
            <Box color="palette.hardGrey" mt={16} mb={32}>
              {pickingState.product?.productName}
            </Box>
            <Box>{t(`${intlKey}.MiddleBar.ProductBarcode`)}</Box>
            <Flex color="palette.hardGrey" justifyContent="center" width="45vmin">
              <Ellipsis maxWidth={10000}>
                {pickingState.product?.barcodes?.split(',').map((barcode: string, index: number, arr: []) => (
                  <>
                    <Text fontWeight={300}>{barcode?.slice(0, -5)}</Text>
                    <Text fontWeight={900}>{barcode?.slice(-5)}</Text>
                    <Text fontWeight={300} fontFamily="Arial">
                      {index !== arr.length - 1 && ','}&nbsp;
                    </Text>
                  </>
                ))}
              </Ellipsis>
            </Flex>
          </Flex>
          <Flex
            bg={CellBgs[pickingState.cellLabel.split('-')[2]?.charAt(0)]}
            color="palette.white"
            width={1 / 3}
            {...commonProps}
            borderRadius="sm"
          >
            <Box fontSize={32} fontWeight={500} mb={32}>
              {t(`${intlKey}.ProblemProductModal.Cell`)}
            </Box>
            <Box fontSize={100} fontWeight={800}>
              {pickingState.cellLabel
                .split('-')
                .slice(2)
                .join('-')}
            </Box>
          </Flex>
        </Flex>
        <Flex justifyContent="space-evenly" mt={60} mb={30} width={1}>
          <Button
            {...buttonProps}
            variant="danger"
            disabled={rasPickLostItemResponse?.isBusy}
            onClick={() => pickingAction.toggleModalState(RASPickingModals.ProblemProduct)}
          >
            {t('Modal.Cancel')}
          </Button>
          <Button
            {...buttonProps}
            variant="info"
            isLoading={rasPickLostItemResponse?.isBusy}
            onClick={() =>
              dispatch(
                resourceActions.resourceRequested(ResourceType.RasPickLostItem, {
                  payload: {
                    addressLabel: pickingState.station.label,
                    cellLabel: pickingState.cellLabel,
                    pickListId: pickingState.pickListId,
                    productBarcode: pickingState.product.barcodes?.split(',')[0],
                  },
                })
              )
            }
          >
            {t('Modal.Approve')}
          </Button>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default ProblemProductModal;
