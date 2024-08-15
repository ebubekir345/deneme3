import { Box, Flex, Icon, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import useTimerStore from '../../../../store/global/timerStore';
import durationToHourMinuteSecondConverter from '../../../../utils/durationToHourMinuteSecondConverter';

const intlKey = 'TouchScreen.MissingItemTransferStation.RightBar';

const CompletedOrderPanel: React.FC = () => {
  const { t } = useTranslation();
  const [missingItemTransferState] = useMissingItemTransferStore();
  const [{ missingItemTransferTime }] = useTimerStore();

  const completedMessageMap = () => {
    if (missingItemTransferState.isCancelled) {
      return t(`${intlKey}.SuccessfullyTransferedCancelled`);
    }
    if (missingItemTransferState.isMissing) {
      return t(`${intlKey}.SuccessfullyTransferredWithLostItems`);
    }
    if (!missingItemTransferState.isCancelled && !missingItemTransferState.isMissing) {
      return t(`${intlKey}.SuccessfullyTransfered`);
    }
    return '';
  };

  return (
    <>
      <Flex flexGrow={1} flexDirection="column" justifyContent="space-between">
        <Flex
          width={1}
          position="relative"
          flexGrow={1}
          p="30"
          borderRadius="md"
          backgroundImage={
            missingItemTransferState.isMissing || missingItemTransferState.isCancelled
              ? 'linear-gradient(to bottom, #fdac42, #fccc75)'
              : 'linear-gradient(to bottom, #39d98a, #57eba1);'
          }
          justifyContent="center"
          alignItems="center"
          color="palette.white"
          flexDirection="column"
          mt={0}
        >
          <Icon name="fal fa-box-check" fontSize={'77px'} />
          <Box fontFamily="SpaceMono" mt={0} fontSize="48" overflowWrap="anywhere">
            #{missingItemTransferState.orderNumber}
          </Box>
          <Box fontSize="22" fontWeight={500} mt={4}>
            {completedMessageMap()}
          </Box>
          <Flex
            position="absolute"
            bottom={38}
            height={44}
            px={38}
            justifyContent="center"
            alignItems="center"
            bg={
              missingItemTransferState.isMissing || missingItemTransferState.isCancelled
                ? 'palette.orange_darker'
                : 'palette.hardGreen'
            }
            borderRadius="24px"
            fontSize="16"
            letterSpacing="negativeLarge"
            color="palette.white"
          >
            <Text fontWeight={700}>{t(`${intlKey}.PackingTime`)}</Text>
            <Text> {durationToHourMinuteSecondConverter(t, missingItemTransferTime)}</Text>
          </Flex>
        </Flex>
        <Flex width={1} height={96} borderRadius="md" bg="palette.softGrey" py="22" px="30" alignItems="center" mt={16}>
          <Icon name="fad fa-barcode-scan" fontSize="26" mr={16} />
          <Box fontSize="26" fontWeight={500} color="palette.softBlue_light" lineHeight="large">
            {t(`${intlKey}.ScanNextOrder`)}
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default CompletedOrderPanel;
