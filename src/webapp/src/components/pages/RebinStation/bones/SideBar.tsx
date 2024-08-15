import { Box, Flex, Icon, Image, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  CheckAndPlaceBatchPickingProductOutputDTO,
  PlaceProductOutputDTO,
  StartSortingProcessOutputDTO,
} from '../../../../services/swagger';
import useRebinStore from '../../../../store/global/rebinStore';
import { StoreState } from '../../../../store/initState';

const intlKey = 'TouchScreen.RebinStation.RightBar';

export enum BarType {
  Right = 'RightBar',
  Left = 'LeftBar',
}

interface IScanBarcode {
  rebinTrolleyLabel?: string;
  barType: BarType;
  cellLabel?: string;
}

const ScanBarcode: FC<IScanBarcode> = ({ rebinTrolleyLabel, barType, cellLabel }) => {
  const { t } = useTranslation();

  return (
    <Flex
      width={1}
      flexDirection="column"
      borderRadius="md"
      height="40vh"
      bg="palette.blue_darker"
      justifyContent="center"
      alignItems="center"
      color="palette.white"
      my={16}
      p={38}
    >
      <Icon name="fal fa-barcode-scan" fontSize={32} />
      <Text mt={22} fontSize={32} fontWeight={500} textAlign="center">
        {cellLabel ? (
          <Box fontSize={64}>
            <Trans
              i18nKey={`${intlKey}.ScanTote`}
              values={{
                cellLabel: cellLabel,
              }}
            />
          </Box>
        ) : rebinTrolleyLabel ? (
          <Trans
            i18nKey={`TouchScreen.RebinStation.${barType}.ActiveRebinTrolley`}
            values={{
              rebinTrolley: rebinTrolleyLabel,
            }}
          />
        ) : (
          t(`TouchScreen.RebinStation.${barType}.RebinTrolley`)
        )}
      </Text>
    </Flex>
  );
};

interface IItemInfo {
  isRebinTrolleyActive: boolean;
}

const ItemInfo: FC<IItemInfo> = ({ isRebinTrolleyActive }): JSX.Element => {
  const { t } = useTranslation();
  const [rebinState] = useRebinStore();

  return (
    <>
      {isRebinTrolleyActive && rebinState.product.productId && rebinState.toteLabel && (
        <Box width={1}>
          <Box
            height={38}
            pt={11}
            px={22}
            fontFamily="base"
            fontWeight={700}
            letterSpacing="small"
            bg="palette.slate_lighter"
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
          >
            {t(`${intlKey}.ItemInfo`)}
          </Box>
          <Box py={8} px={26} bg="palette.white" borderBottomLeftRadius="md" borderBottomRightRadius="md">
            <Flex
              key={rebinState.product.productId}
              color="palette.hardBlue_darker"
              fontSize="16"
              alignItems="center"
              py={11}
            >
              <Image
                src={rebinState.product.imageURL}
                borderRadius="full"
                width={26}
                height={26}
                flexShrink={0}
                boxShadow="small"
              />
              <Flex flexDirection="column" flexGrow={1} px={16}>
                <Box
                  letterSpacing="negativeLarge"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  overflow="hidden"
                  style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {rebinState.product.name}
                </Box>
              </Flex>
              <Box fontFamily="SpaceMono" letterSpacing="negativeLarge" flexShrink={0}>
                x{rebinState.product.amount}
              </Box>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
};

interface IHandleIsCellScanRemoved {
  isRebinTrolleyActive: boolean;
  rebinTrolleyLabel: string;
}

const HandleIsCellScanRemoved: FC<IHandleIsCellScanRemoved> = ({
  isRebinTrolleyActive,
  rebinTrolleyLabel,
}): JSX.Element => {
  const { t } = useTranslation();
  const [rebinState] = useRebinStore();
  const rebinSortingPlaceProductResponse: Resource<PlaceProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingPlaceProduct]
  );
  const rebinSortingCheckAndPlaceBatchPickingProductResponse: Resource<CheckAndPlaceBatchPickingProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingCheckAndPlaceBatchPickingProduct]
  );
  const isRebinTrolleyVisible = isRebinTrolleyActive && rebinState.cellLabel && rebinState.toteLabel;

  return (
    <>
      {rebinState.isCellScanRemoved ? (
        rebinSortingCheckAndPlaceBatchPickingProductResponse?.isSuccess && isRebinTrolleyVisible ? (
          <Flex
            width={1}
            flexDirection="column"
            borderRadius="md"
            height="40vh"
            bg="palette.blue_darker"
            justifyContent="center"
            alignItems="center"
            color="palette.white"
            my={16}
            p={38}
          >
            <Box fontSize={32} fontWeight={500} textAlign="center">
              <Box fontSize={64} textDecoration="underline">
                {rebinState.cellLabel}
              </Box>
              <Box fontSize={32}>{t(`${intlKey}.ScanOtherItem`)}</Box>
            </Box>
          </Flex>
        ) : null
      ) : (
        isRebinTrolleyVisible &&
        (rebinSortingPlaceProductResponse?.data ? (
          <Flex
            width={1}
            position="relative"
            flexGrow={1}
            py={16}
            borderRadius="lg"
            backgroundImage="linear-gradient(to bottom, #39d98a, #57eba1)"
            justifyContent="center"
            alignItems="center"
            color="palette.white"
            flexDirection="column"
            my={16}
          >
            <Icon name="fal fa-check-circle" fontSize={64} />
            <Box fontSize={32} fontWeight={500} mt={16} px={32} textAlign="center">
              <Trans
                i18nKey={`${intlKey}.ItemHasBeenPut`}
                values={{
                  cellLabel: rebinState.cellLabel,
                }}
              />
            </Box>
          </Flex>
        ) : (
          <ScanBarcode rebinTrolleyLabel={rebinTrolleyLabel} barType={BarType.Right} cellLabel={rebinState.cellLabel} />
        ))
      )}
      {rebinSortingCheckAndPlaceBatchPickingProductResponse?.isSuccess && isRebinTrolleyActive && (
        <Icon
          name={`fas fa-long-arrow-${rebinState.isRightRebinTrolleyActive ? 'right' : 'left'}`}
          borderRadius="full"
          bg="palette.white"
          color="palette.hardGreen_light"
          textAlign="center"
          fontSize={92}
          px={16}
          py={8}
          mb={16}
        />
      )}
      {rebinState.isCellScanRemoved ? (
        rebinSortingCheckAndPlaceBatchPickingProductResponse?.isSuccess ? (
          <ItemInfo isRebinTrolleyActive={isRebinTrolleyActive} />
        ) : null
      ) : (
        <ItemInfo isRebinTrolleyActive={isRebinTrolleyActive} />
      )}
    </>
  );
};

interface ISideBar {
  barType: BarType;
  isRebinTrolleyNotScanned: boolean;
}

const SideBar: FC<ISideBar> = ({ barType, isRebinTrolleyNotScanned }) => {
  const { t } = useTranslation();
  const [rebinState] = useRebinStore();
  const isRight = barType === BarType.Right;
  const rebinTrolleyLabel = isRight ? rebinState.rightRebinTrolleyLabel : rebinState.leftRebinTrolleyLabel;
  const isRebinTrolleyActive = isRight ? rebinState.isRightRebinTrolleyActive : rebinState.isLeftRebinTrolleyActive;

  const rebinSortingStartSortingProcessResponse: Resource<StartSortingProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RebinSortingStartSortingProcess]
  );
  const scannedRebinTrolleyLabel = isRight
    ? rebinSortingStartSortingProcessResponse?.data?.rightRebinTrolleyLabel
    : rebinSortingStartSortingProcessResponse?.data?.leftRebinTrolleyLabel;

  if (rebinTrolleyLabel) {
    return (
      <Flex
        flexDirection="column"
        borderRadius="md"
        bg="palette.steel_lighter"
        justifyContent="space-between"
        alignItems="center"
        color="palette.slate"
        minHeight="80vh"
        px={22}
        py={16}
      >
        <Box borderRadius="md" bg="palette.white" fontWeight={500} width={1} px={16} py={8}>
          <Box fontSize="14" fontWeight={700} letterSpacing="small" color="palette.snow_darker">
            {t(`${intlKey}.RebinName`)}
          </Box>
          <Box fontSize="22" letterSpacing="negativeLarge" pt={4} color="palette.black">
            {rebinTrolleyLabel}
          </Box>
        </Box>
        <HandleIsCellScanRemoved rebinTrolleyLabel={rebinTrolleyLabel} isRebinTrolleyActive={isRebinTrolleyActive} />
      </Flex>
    );
  } else if (isRebinTrolleyNotScanned)
    return <ScanBarcode rebinTrolleyLabel={scannedRebinTrolleyLabel} barType={barType} />;
  return null;
};

export default SideBar;
