import { Box, Flex } from '@oplog/express';
import React from 'react';

interface IInfoPanelCell {
  title: string;
  content: string | Object;
}

const InfoPanelCell: React.FC<IInfoPanelCell> = ({ title, content }) => {
  return (
    <Flex width={1 / 3} flexDirection="column">
      <Box fontSize={11} fontWeight="bold" color="palette.grey_lighter" mb={5}>
        {title}
      </Box>
      <Box fontSize={16} fontWeight={500} color="palette.grey_dark" lineHeight="medium">
        {content}
      </Box>
    </Flex>
  );
};

export default InfoPanelCell;
