/* eslint-disable react/jsx-indent */
import { Box, Flex, Icon, Text } from '@oplog/express';
import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useSimplePackingStore from '../../../../store/global/simplePackingStore';
import BoxItem from './BoxItem';

const intlKey = 'TouchScreen.SimplePackingStation.LeftBar';

const BoxItemList: FC = (): ReactElement => {
  const { t } = useTranslation();
  const [packingState] = useSimplePackingStore();

  if (packingState.boxItems.length)
    return (
      <Box overflowX="hidden" overflowY="auto" flexGrow={1} height={0} mt={16} data-cy="box-item-container">
        {packingState.boxItems.map((boxItem, i) => (
          <BoxItem key={boxItem.title.concat(i.toString())} boxItem={boxItem} />
        ))}
      </Box>
    );
  if (packingState.orderItems.length && !packingState.modals.CargoPackagePick)
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
          {t(`${intlKey}.ScanItems`)}
        </Text>
      </Flex>
    );
  return <></>;
};

export default BoxItemList;
