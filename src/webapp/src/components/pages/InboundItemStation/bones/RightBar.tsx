import { Box, Flex } from '@oplog/express';
import React from 'react';
import { QuarantineTotePanel, TotePanel } from '.';

const RightBar: React.FC = () => {
  return (
    <Box bg="palette.slate_lighter" width={1 / 4} padding="16px 18px 8px 14px">
      <Flex flexGrow={1} flexDirection="column" height="100%">
        <TotePanel />
        <QuarantineTotePanel />
      </Flex>
    </Box>
  );
};

export default RightBar;
