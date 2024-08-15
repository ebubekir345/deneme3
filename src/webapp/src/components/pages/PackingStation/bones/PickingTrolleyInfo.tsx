/* eslint-disable import/no-named-as-default */
import { Flex, Icon, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { PickingTrolleyDetailsOutputDTO } from '../../../../services/swagger';

import { ActionButton, ProgressBar } from '../../../atoms/TouchScreen';
import TrolleyModal from '../../../organisms/TrolleyModal';

const intlKey = 'TouchScreen';

export const PickingTrolleyInfo: React.FC = () => {
  const { t } = useTranslation();
  const [isTrolleyModalOpen, setIsTrolleyModalOpen] = useState(false);
  const pickingTrolleyDetails: Resource<PickingTrolleyDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPickingTrolleyDetails]
  );
  const onDetailButtonClick = () => {
    setIsTrolleyModalOpen(true);
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
            {t(`${intlKey}.PackingStation.PickingTrolleyInfo.Title`)}
          </Text>
          <Text fontSize="10" mt={4}>
            {pickingTrolleyDetails?.data?.label || ''}
          </Text>
        </Flex>
        <ProgressBar
          label
          withPercentage
          current={pickingTrolleyDetails?.data?.percentage ? pickingTrolleyDetails?.data?.percentage : 0}
          total={100}
          barColor="palette.softBlue"
          containerColor="palette.blue_lighter"
          completeColor="palette.softBlue"
          borderRadius="20px"
          height="24px"
          labelSize="20px"
          containerProps={{ flexGrow: 1 }}
        />
        <ActionButton
          onClick={() => onDetailButtonClick()}
          color="palette.hardBlue_darker"
          bg="palette.white"
          fontSize="12"
          letterSpacing="negativeMedium"
          px={30}
          borderRadius="4px"
          border="none"
          height="24px"
          ml={16}
          flexShrink="0"
        >
          {t(`${intlKey}.ActionButtons.TrolleyDetail`)}
        </ActionButton>
      </Flex>
      <TrolleyModal
        trolleyLabel={pickingTrolleyDetails?.data?.label || ''}
        isOpen={isTrolleyModalOpen}
        onClose={() => setIsTrolleyModalOpen(false)}
        isLinked={false}
      />
    </>
  );
};

export default PickingTrolleyInfo;
