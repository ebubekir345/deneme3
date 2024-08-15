/* eslint-disable import/no-named-as-default */
import { Flex, Icon, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import { ProgressBar } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

export const PickingTrolleyInfo: React.FC = () => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useHovPackingStore();

  const handleProgress = () => {
    if (packingState.trolleyDetails.totalCount && packingState.trolleyDetails.packedCount > 0) {
      let percentage;
      return (percentage = (packingState.trolleyDetails.packedCount * 100) / packingState.trolleyDetails.totalCount);
    }
    return 0;
  };
  return (
    <>
      <Flex alignItems="center">
        <Icon name="fal fa-dolly" fontSize="22" color="palette.grey_dark" />
        <Flex
          flexDirection="column"
          mx={18}
          letterSpacing="negativeMedium"
          color="palette.hardBlue_darker"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontSize="12" fontWeight="600">
            {t(`${intlKey}.HOVPackingStation.PickingTrolleyInfo.Title`)}
          </Text>
        </Flex>
        <ProgressBar
          label
          withPercentage
          current={handleProgress()}
          total={100}
          barColor="palette.softBlue"
          containerColor="palette.blue_lighter"
          completeColor="palette.softBlue"
          borderRadius="20px"
          height="24px"
          labelSize="20px"
          containerProps={{ flexGrow: 1 }}
        />
      </Flex>
    </>
  );
};

export default PickingTrolleyInfo;
