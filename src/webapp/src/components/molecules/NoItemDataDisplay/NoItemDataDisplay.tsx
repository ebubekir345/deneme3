import { Box, Flex, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../atoms/Loading';

interface INoItemDataDisplay {
  isLoaded?: boolean;
  height?: string | number;
}

const NoItemDataDisplay: React.FC<INoItemDataDisplay> = ({ isLoaded, height }) => {
  const { t } = useTranslation();

  return (
    <Flex
      my={16}
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={height ? height : '50vh'}
      bg="palette.white"
    >
      {isLoaded ? <Text fontSize={20}>{t('NotFoundDataOnPage')}</Text> : <Loading />}
    </Flex>
  );
};

export default NoItemDataDisplay;
