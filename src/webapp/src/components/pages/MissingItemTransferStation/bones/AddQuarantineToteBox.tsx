import { Flex, Icon, Text } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';

interface IAddQuarantineToteBox {
  isExpanded: boolean;
}

const intlKey = 'TouchScreen.MissingItemTransferStation.Package';

const AddQuarantineToteBox: React.FC<IAddQuarantineToteBox> = ({ isExpanded }): ReactElement => {
  const { t } = useTranslation();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();
  return (
    <Flex
      width={1}
      height={68}
      p={16}
      mb={16}
      mx={isExpanded ? '8' : '0'}
      alignItems="center"
      bg="palette.yellow_lighter"
      borderRadius="md"
      color="palette.yellow_darker"
    >
      <Icon name="far fa-exclamation-circle" fontSize={22} />
      <Text ml={11} fontWeight={500} fontSize={16} letterSpacing="negativeLarge">
        {t(`${intlKey}.ScanQuarantineTote`, { tote: missingItemTransferState.quarantineToteLabel })}
      </Text>
    </Flex>
  );
};

export default AddQuarantineToteBox;
