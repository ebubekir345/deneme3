import { Box, Flex } from '@oplog/express';
import * as React from 'react';

const Main: React.FC = (props: any) => {
  const { children } = props;
  return (
    <Flex>
      <Box width={1} pl="22" pr="22" pt="16">
        {children}
      </Box>
    </Flex>
  );
};

export default Main;
