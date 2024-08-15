import { Box, Flex } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import usePackingStore from '../../../../store/global/packingStore';
import { ProgressBar } from '../../../atoms/TouchScreen';
import VasItem from './VasItem';

const intlKey = 'TouchScreen.PackingStation.RightBar';

const VasPanel: React.FC = () => {
  const { t } = useTranslation();
  const [packingState] = usePackingStore();
  const vasProcessed = packingState.vasItems.reduce((a, c) => a + c.boxedCount, 0);
  const vasTotal = packingState.vasItems.reduce((a, c) => a + c.amountInOrder, 0);
  return (
    <>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex flexWrap="wrap">
          <Box fontSize="20px" fontWeight="bold" letterSpacing="-0.5px" color="palette.hardBlue_darker" mr={8}>
            {t(`${intlKey}.VasProducts`)}
          </Box>
        </Flex>
        <Box>
          <ProgressBar
            current={vasProcessed}
            total={vasTotal}
            containerColor="palette.blue_lighter"
            barColor="palette.hardGreen"
            height="24px"
            borderRadius="4px"
            label
            completeColor="palette.hardGreen"
          />
        </Box>
      </Flex>
      <Box my={16} overflowY="auto" maxHeight={264}>
        {packingState.vasItems.map(vasItem => {
          return (
            <div key={vasItem.barcode} id={vasItem.barcode}>
              <VasItem vasItem={vasItem} />
            </div>
          );
        })}
      </Box>
    </>
  );
};

export default VasPanel;
