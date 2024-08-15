import React, { ReactElement } from 'react';
import { Box, Flex, FlexProps } from '@oplog/express';

export interface ProgressBarProps {
  current: number;
  total: number;
  barColor: string;
  containerColor: string;
  completeColor: string;
  label: boolean;
  height: string | number;
  borderRadius: string;
  withPercentage?: boolean;
  labelSize?: string;
  containerProps?: FlexProps;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  barColor,
  containerColor,
  completeColor,
  label,
  height,
  borderRadius,
  withPercentage,
  labelSize = '16px',
  containerProps,
}): ReactElement => {
  return (
    <Flex
      position="relative"
      width="248px"
      height={height}
      borderRadius={borderRadius}
      bg={containerColor}
      data-testid="progressContainer"
      {...containerProps}
    >
      {label && (
        <Box
          fontSize={labelSize}
          fontWeight="bold"
          letterSpacing="-0.5px"
          color="palette.white"
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%,-50%)"
          data-cy="progress-bar"
        >
          {withPercentage ? `%${Math.round((current / total) * 100)}` : `${current} / ${total}`}
        </Box>
      )}
      <Box
        justifyContent="flex-start"
        width={current > total ? 1 : current / total}
        height={height}
        bg={current === total ? completeColor : barColor}
        borderRadius={borderRadius}
        data-testid="progressBar"
      />
    </Flex>
  );
};

export default ProgressBar;
