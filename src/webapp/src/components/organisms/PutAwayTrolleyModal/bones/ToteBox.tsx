import { Box, Button, Flex, Icon, Text } from '@oplog/express';
import React from 'react';

export interface IToteBox {
  title: string;
  current?: number;
  total?: number;
  hasLostItem?: boolean;
}

export const ToteBox: React.FC<IToteBox> = ({ title, current, total, hasLostItem }) => {
  const progressBarStyleMap = () => {
    if (current !== 0 && current === total) {
      return { bg: 'palette.green', icon: <Icon name="far fa-check" /> };
    }
    if (current === 0 && current !== total) {
      return { bg: 'palette.grey_lighter', icon: <Text>%0</Text> };
    }
    if (current !== 0 && current !== total && current !== undefined && total !== undefined) {
      return { bg: 'palette.blue', icon: <Text>%{((current / total) * 100).toFixed(0)}</Text> };
    }
    if (hasLostItem) {
      return { bg: '#FFD578', icon: <Icon name="far fa-exclamation-triangle" /> };
    }
    return { bg: 'palette.snow_light', icon: null };
  };
  return (
    <Box width={1} bg="palette.white" borderRadius="lg" p={8}>
      <Flex justifyContent="space-between" fontWeight="500" alignItems="center" px={8}>
        <Text>{title}</Text>
        <Text>{total !== 0 && current !== undefined ? `${current}/${total}` : '-'}</Text>
      </Flex>
      <Box my={8} bg="palette.snow_light" width={1} height={1} />
      <Button kind="link" color="text.body" px={8} mb={8} outline="none !important" cursor={'auto !important'}>
        {total === 0 ? '-' : ' '}
      </Button>
      <Flex
        height={40}
        alignItems="center"
        justifyContent="flex-end"
        px={8}
        bg={progressBarStyleMap().bg}
        borderRadius="md"
        color="palette.white"
        fontSize="22"
        fontFamily="heading"
      >
        {progressBarStyleMap().icon}
      </Flex>
    </Box>
  );
};

export default ToteBox;
