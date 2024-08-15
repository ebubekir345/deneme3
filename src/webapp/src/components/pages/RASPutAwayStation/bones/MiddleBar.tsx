import { Box, Ellipsis, Flex, Image, Text } from '@oplog/express';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToteContainedItemOutputDTO } from '../../../../services/swagger';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';

export enum CellBgs {
  A = 'palette.blue',
}

const intlKey = 'TouchScreen.RASPickingStation.MiddleBar';

export const commonProps = {
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
};

const MiddleBar = () => {
  const { t } = useTranslation();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();
  const [lastSuccessHeadingBg, setLastSuccessHeadingBg] = useState('palette.grey');
  const [lastSuccessInfoBg, setLastSuccessInfoBg] = useState('palette.white');

  const ScanComponent: FC = () => (
    <Flex
      px={4}
      {...commonProps}
      height={putAwayState.phases.Cell ? '50%' : '100%'}
      bg={`palette.${
        putAwayState.phases.Cell ? 'hardGreen_light' : putAwayState.phases.Product ? 'orange_darker' : 'hardRed'
      }`}
      color="palette.white"
      borderRadius="sm"
      borderBottomRightRadius={putAwayState.phases.Cell && 'none'}
      borderBottomLeftRadius={putAwayState.phases.Cell && 'none'}
    >
      <Box mx="auto">
        {t(
          `${intlKey}.${
            putAwayState.phases.Cell ? 'ScanCell' : putAwayState.phases.Product ? 'ScanProduct' : 'WaitForPOD'
          }`
        )}
      </Box>
    </Flex>
  );

  useEffect(() => {
    if (putAwayState.successMessage) {
      setLastSuccessHeadingBg('palette.green_darker');
      setLastSuccessInfoBg('palette.hardGreen_lighter');
      setTimeout(() => {
        setLastSuccessHeadingBg('palette.grey');
        setLastSuccessInfoBg('palette.white');
      }, 3000);
    }
  }, [putAwayState.successMessage]);

  return (
    <Flex height="100vh" m={32} mt={-16} mb={16} fontSize={96} fontWeight={900} lineHeight="xxLarge" textAlign="center">
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        height="90vh"
        width={1 / 4}
        mt={-44}
        mb={-150}
        pb={16}
        fontSize={16}
      >
        <Box height="50%">
          <Box
            height={52}
            fontSize={22}
            bg={
              putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)
                ? 'palette.softBlue'
                : 'palette.slate_lighter'
            }
            color={
              putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected) ? 'palette.white' : 'palette.grey'
            }
            borderTopRightRadius="md"
            borderTopLeftRadius="md"
            pt={14}
          >
            {putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteName ||
              t(`${intlKey}.ToteDetails`)}
          </Box>

          <Box
            width={1}
            px={26}
            py={8}
            fontWeight={400}
            bg="palette.white"
            borderBottomRightRadius="md"
            borderBottomLeftRadius="md"
            flexGrow={1}
            height="90%"
            overflowY="auto"
          >
            {putAwayState.slots
              .find((slot: SlotInterface) => slot?.isSelected)
              ?.toteContent.map(
                (item: ToteContainedItemOutputDTO, i) =>
                  Boolean(item.amount) && (
                    <Flex
                      key={i.toString()}
                      color="palette.hardBlue_darker"
                      fontSize="16"
                      alignItems="center"
                      letterSpacing="negativeLarge"
                      py={16}
                      borderBottom={
                        putAwayState.slots.find((slot: SlotInterface) => slot?.isSelected)?.toteContent.length !== i + 1
                          ? `solid 1px rgb(157,191,249,0.25)`
                          : 'unset'
                      }
                    >
                      <Image src={item.imageURL} borderRadius="full" width={38} height={38} boxShadow="small" />
                      <Flex flexDirection="column" flexGrow={1} px={22}>
                        <Box
                          textAlign="left"
                          textOverflow="ellipsis"
                          display="-webkit-box"
                          overflow="hidden"
                          style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                        >
                          {item.productName}
                        </Box>
                      </Flex>
                      <Box fontFamily="SpaceMono">x{item.amount}</Box>
                    </Flex>
                  )
              )}
          </Box>
        </Box>

        <Box fontSize={22} height="45%" textAlign="center">
          <Box
            bg={lastSuccessHeadingBg}
            color="palette.white"
            py={11}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
          >
            {t(`TouchScreen.RASPutAwayStation.LastSuccessfulOperation.Title`)}
          </Box>
          <Flex
            {...commonProps}
            height="60%"
            fontWeight={500}
            py={16}
            bg={lastSuccessInfoBg}
            color="palette.hardBlue_darker"
            borderBottomLeftRadius="md"
            borderBottomRightRadius="md"
          >
            {putAwayState.successMessage}
          </Flex>
        </Box>
      </Flex>

      <Box width={3 / 4} pl={32}>
        {putAwayState.phases.Cell ? (
          <>
            <ScanComponent />
            <Flex justifyContent="space-between" height="50%" bg="palette.slate_lighter">
              <Box width={1 / 3}>
                <Image src={putAwayState.product?.imageURL} height="100%" borderBottomLeftRadius="sm" />
              </Box>
              <Flex {...commonProps} width={2 / 3} fontSize={26} fontWeight={500} borderBottomRightRadius="sm">
                <Box>{t(`${intlKey}.ProductName`)}</Box>
                <Box color="palette.hardGrey">{putAwayState.product?.productName}</Box>
                <Box>{t(`${intlKey}.ProductBarcode`)}</Box>
                <Flex color="palette.hardGrey" mx="auto" width="75vmin">
                  <Ellipsis maxWidth={10000}>
                    {putAwayState.product?.barcodes?.split(',').map((barcode: string, index: number, arr: []) => (
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
            </Flex>
          </>
        ) : (
          <ScanComponent />
        )}
      </Box>
    </Flex>
  );
};

export default MiddleBar;
