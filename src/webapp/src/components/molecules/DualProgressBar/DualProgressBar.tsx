import React, { ReactElement } from 'react';
import { Box, Flex, FlexProps, Text } from '@oplog/express';

export interface DualProgressBarProps {
  innerBarCurrent: number;
  outerBarCurrent: number;
  total: number;
  innerBarColor?: string;
  outerBarColor?: string;
  labelSize?: string;
  containerProps?: FlexProps;
  outerBarTitle: string;
  innerBarTitle: string;
  containerTitle: string;
}

const DualProgressBar: React.FC<DualProgressBarProps> = ({
  innerBarCurrent,
  outerBarCurrent,
  total,
  innerBarColor = 'palette.blue',
  outerBarColor = 'palette.green',
  labelSize = '10px',
  containerProps,
  outerBarTitle,
  innerBarTitle,
  containerTitle,
}): ReactElement => {
  return (
    <>
      {!total && total !== 0 ? (
        <Text color="palette.red">Error Occurred</Text>
      ) : (
        <Flex flexDirection="column">
          <Flex {...containerProps} position="relative" fontWeight="bold" mb={8}>
            <Box
              {...containerProps}
              position="relative"
              justifyContent="flex-start"
              width={innerBarCurrent <= total ? `${Math.round((innerBarCurrent / total) * 100)}%` : '100%'}
              bg={innerBarColor}
              zIndex={1}
              data-testid="innerBar"
            >
              <Box
                fontSize={labelSize}
                color={innerBarColor}
                position="absolute"
                right={-12}
                bottom={12}
                data-cy="progress-bar"
              >
                {innerBarCurrent < total ? `%${Math.round((innerBarCurrent / total) * 100)}` : '%100'}
              </Box>
            </Box>
            <Box
              {...containerProps}
              position="absolute"
              justifyContent="flex-start"
              width={outerBarCurrent <= total ? `${Math.round((outerBarCurrent / total) * 100)}%` : '100%'}
              bg={outerBarColor}
              zIndex={2}
              data-testid="outerBar"
            >
              <Box
                fontSize={labelSize}
                color={outerBarColor}
                position="absolute"
                right={8}
                bottom={12}
                data-cy="progress-bar"
              >
                {outerBarCurrent < total && `%${Math.round((outerBarCurrent / total) * 100)}`}
              </Box>
            </Box>
          </Flex>
          <Flex>
            <Flex mr={20} fontWeight={600} fontSize={9} color="#9b9b9b" alignItems="center">
              <Box mr={4} borderRadius="50%" width={8} height={8} bg={outerBarColor} />
              <Text letterSpacing={-0.36}>{outerBarTitle}</Text>
            </Flex>
            <Flex mr={20} fontWeight={600} fontSize={9} color="#9b9b9b" alignItems="center">
              <Box mr={4} borderRadius="50%" width={8} height={8} bg={innerBarColor} />
              <Text letterSpacing={-0.36}>{innerBarTitle}</Text>
            </Flex>
            <Flex mr={20} fontWeight={600} fontSize={9} color="#9b9b9b" alignItems="center">
              <Box {...containerProps} mr={4} borderRadius="50%" width={8} height={8} />
              <Text letterSpacing={-0.36}>{containerTitle}</Text>
            </Flex>{' '}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default DualProgressBar;
