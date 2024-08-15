import React, { ReactElement } from 'react';
import { Box, Flex, Icon } from '@oplog/express';
import { useTranslation } from 'react-i18next';

interface AddPackageBoxProps {
  isExpanded: boolean;
  isTote?: boolean;
}

const intlKey = 'TouchScreen';

const AddPackageBox: React.FC<AddPackageBoxProps> = ({ isExpanded, isTote }): ReactElement => {
  const { t } = useTranslation();
  return (
    <Flex
      width={isExpanded ? 'calc(50% - 16px)' : 1}
      flexDirection="column"
      mb={16}
      mx={isExpanded ? '8px' : '0'}
      boxShadow="small"
    >
      <Box width={1} height={48} borderRadius="8px 8px 0 0" bg="palette.slate_light" />
      <Flex
        width={1}
        height={86}
        px={22}
        bg="palette.white"
        boxShadow="small"
        borderRadius="0 0 8px 8px"
        alignItems="center"
      >
        <Icon name={isTote ? 'fal fa-barcode-scan' : 'fal fa-barcode-read'} color="palette.blue_lighter" fontSize="26" />
        <Box fontSize="16" fontWeight={500} letterSpacing="small" color="palette.snow_darker" ml={11}>
          {isTote && t(`${intlKey}.ReturnStation.Package.ScanToAdd`)}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AddPackageBox;
