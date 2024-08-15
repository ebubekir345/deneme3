import { Box, Flex, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';
import { slotLimit } from '../../../../utils/useWebSocket';

const intlKey = 'TouchScreen.RASPickingStation.TopBar';

const TopBar = () => {
  const { t } = useTranslation();
  const [putAwayState] = useRASPutAwayStore();

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
          {putAwayState.station.label}
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
                {putAwayState.slots[i]?.isSelected && (
                  <Box width={1} color="palette.hardRed" fontWeight={900} mt={-14}>
                    {t(`TouchScreen.RASPutAwayStation.TopBar.ActiveTote`)}
                  </Box>
                )}
                <Box
                  bg={putAwayState.slots[i]?.isSelected ? 'palette.white' : 'palette.softBlue'}
                  color={putAwayState.slots[i]?.isSelected ? 'palette.grey_darker' : 'palette.white'}
                  borderTopLeftRadius="lg"
                  borderTopRightRadius="lg"
                  width={1}
                  pb={4}
                  pt={6}
                >
                  {`${t(`${intlKey}.Slot`)} ${i + 1}`}
                </Box>
                <Box
                  px={putAwayState.slots[i]?.toteName ? 16 : 52}
                  py={16}
                  width={1}
                  borderBottomRightRadius="lg"
                  borderBottomLeftRadius="lg"
                  bg={putAwayState.slots[i]?.isSelected ? 'palette.hardGreen_light' : 'palette.white'}
                  color={
                    putAwayState.slots[i]?.isSelected
                      ? 'palette.white'
                      : putAwayState.slots[i]?.toteName
                      ? 'palette.grey_darker'
                      : null
                  }
                  fontWeight={putAwayState.slots[i]?.isSelected ? 900 : null}
                >
                  <Box fontSize={16}>
                    {putAwayState.slots[i]?.toteName || t(`${intlKey}.Empty`)}
                  </Box>
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
