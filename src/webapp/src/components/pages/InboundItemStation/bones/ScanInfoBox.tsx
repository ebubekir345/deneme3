import React, { ReactElement } from 'react';
import { Box, Flex, Icon } from '@oplog/express';
import { useTranslation } from 'react-i18next';

const intlKey = 'TouchScreen';

interface IScanInfoBox {
  isScanOpen: boolean;
}

const ScanInfoBox: React.FC<IScanInfoBox> = ({
  isScanOpen,
}): ReactElement => {
  const { t } = useTranslation();
  return (
    <Flex
      position="absolute"
      bottom={isScanOpen ? '3%' : '1%'}
      mx="auto"
      px={48}
      left={0}
      right={0}
      height={isScanOpen ? 72 : 0}
      opacity={isScanOpen ? 1 : 0}
      width="fit-content"
      bg="palette.white"
      borderRadius={18}
      alignItems="center"
      boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.1)" 
      transition="all 0.25s"
      overflow="hidden"
      zIndex={5010}
    >
      <Icon name="far fa-spinner fa-spin" fontSize={48} color="palette.softBlue" mr={18} />
      <Box fontFamily="Jost" fontSize={32} color="palette.hardBlue_darker">
        {t(`${intlKey}.Barcode.Scanning`)}
      </Box>
    </Flex>
  );
};

export default ScanInfoBox;
