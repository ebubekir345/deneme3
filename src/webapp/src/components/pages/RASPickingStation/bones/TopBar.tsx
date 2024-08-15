import { Box, Flex, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useRASPickingStore from '../../../../store/global/rasPickingStore';
import { slotLimit } from '../../../../utils/useWebSocket';

const intlKey = 'TouchScreen.RASPickingStation.TopBar';

const TopBar = () => {
  const { t } = useTranslation();
  const [pickingState] = useRASPickingStore();

  const handleBg = (i: number) => {
    if (pickingState.phases.Tote) {
      return pickingState.slots[i]?.isSelectable
        ? 'palette.hardGreen_light'
        : pickingState.slots[i]?.toteName
        ? 'palette.hardRed'
        : 'palette.white';
    } else return 'palette.white';
  };

  return (
    <Flex>
      <Flex
        borderRadius="lg"
        bg={'palette.white'}
        width={1 / 4}
        p={8}
        m={32}
        alignItems="center"
        justifyContent="center"
        color="palette.slate_dark"
        fontWeight="500"
        height="fit-content"
      >
        <Text ml={8} fontSize="16">
          {pickingState.station.label}
        </Text>
      </Flex>

      <Flex flexDirection="column" width={3 / 4} p={32} pl={0}>
        <Flex justifyContent="space-between">
          {Array.from({ length: slotLimit })
            .map((_, i) => (
              <Flex
                alignItems="center"
                textAlign="center"
                key={i.toString()}
                flexDirection="column"
                width={1 / 6}
                mr={i && 8}
              >
                <Box
                  bg="palette.softBlue"
                  color="palette.white"
                  borderTopLeftRadius="lg"
                  borderTopRightRadius="lg"
                  width={1}
                  pb={4}
                  pt={6}
                >
                  {`${t(`${intlKey}.Slot`)} ${i + 1}`}
                </Box>
                <Box
                  px={pickingState.slots[i] ? 16 : 52}
                  py={16}
                  width={1}
                  borderBottomRightRadius="lg"
                  borderBottomLeftRadius="lg"
                  fontWeight={pickingState.slots[i]?.isSelectable ? 900 : null}
                  bg={handleBg(i)}
                  color={
                    pickingState.slots[i]?.isSelectable
                      ? 'palette.white'
                      : pickingState.slots[i]?.toteName
                      ? 'palette.grey_darker'
                      : null
                  }
                >
                  <Box fontSize={16}>{pickingState.slots[i]?.toteName || t(`${intlKey}.Empty`)}</Box>
                </Box>
              </Flex>
            ))
            .reverse()}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TopBar;
