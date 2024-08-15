import { Box, Ellipsis, Flex, Image, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useRASPickingStore from '../../../../store/global/rasPickingStore';

export enum CellBgs {
  A = '#b0b7b9',
  B = '#dea8dd',
  C = '#FF1493',
  D = '#800080',
  E = '#090136',
  F = '#4c9fc8',
  G = '#78c8e5',
  H = '#00bf6f',
  I = '#a4d65e',
  J = '#f2d0ae',
  K = '#ffff00',
  L = '#f3af22',
  M = '#e56a54',
  N = '#df4660',
  O = '#da291c',
  P = '#000',
}

const intlKey = 'TouchScreen.RASPickingStation.MiddleBar';

export const commonProps = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const MiddleBar = () => {
  const { t } = useTranslation();
  const [pickingState] = useRASPickingStore();

  if (pickingState.phases.POD)
    return (
      <Flex
        bg="palette.hardRed"
        color="palette.white"
        fontSize={96}
        fontWeight={900}
        lineHeight="xxLarge"
        textAlign="center"
        borderRadius="sm"
        {...commonProps}
        m={32}
        mt={-16}
        mb={16}
        height="100vh"
      >
        <Box mx="auto" width={2 / 3}>
          {t(`${intlKey}.WaitForPOD`)}
        </Box>
      </Flex>
    );
  return (
    <Flex height="100vh" m={32} mt={-16} mb={16} fontSize={96} fontWeight={900} textAlign="center">
      <Flex
        bg={`palette.${
          pickingState.phases.Tote ? 'snow_lighter' : pickingState.phases.Product ? 'hardGreen_light' : 'orange_darker'
        }`}
        color={pickingState.phases.Tote ? 'palette.hardGrey' : 'palette.white'}
        borderTopLeftRadius="sm"
        borderBottomLeftRadius="sm"
        lineHeight="xxLarge"
        {...commonProps}
        width={1 / 2}
      >
        <Box mx="auto" width={1 / 2}>
          {t(
            `${intlKey}.${
              pickingState.phases.Tote ? 'SelectTote' : pickingState.phases.Product ? 'ScanProduct' : 'ScanCell'
            }`
          )}
        </Box>
      </Flex>
      <Box width={1 / 2}>
        <Flex
          bg={pickingState.isPalette ? CellBgs.A : CellBgs[pickingState.cellLabel.split('-')[2]?.charAt(0)]}
          color="palette.white"
          lineHeight="xxSmall"
          fontWeight={800}
          fontSize={200}
          {...commonProps}
          borderTopRightRadius="sm"
          height="50%"
        >
          <Box mx="auto" mb={-16}>
            {pickingState.cellLabel
                  .split('-')
                  .slice(2)
                  .join('-')}
          </Box>
        </Flex>
        <Flex
          justifyContent="space-between"
          bg="palette.slate_lighter"
          lineHeight="xxLarge"
          borderBottomRightRadius="sm"
          height="50%"
        >
          <Box width={1 / 3}>
            <Image src={pickingState.product?.imageURL} height="100%" />
          </Box>
          <Flex {...commonProps} width={2 / 3} fontSize={26} fontWeight={500}>
            <Box>{t(`${intlKey}.ProductName`)}</Box>
            <Box color="palette.hardGrey">{pickingState.product?.productName}</Box>
            <Box>{t(`${intlKey}.ProductBarcode`)}</Box>
            <Flex color="palette.hardGrey" justifyContent="center" width="60vmin">
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
        </Flex>
      </Box>
    </Flex>
  );
};

export default MiddleBar;
