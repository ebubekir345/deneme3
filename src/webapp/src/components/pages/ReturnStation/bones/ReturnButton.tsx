import { Box } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useReturnStore, { initialReturnState } from '../../../../store/global/returnStore';
import { ActionButton } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

const ReturnButton: React.FC = () => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  return (
    <Box>
      <ActionButton
        onClick={() => {
          const { returnTime } = returnState;
          returnAction.clearState(initialReturnState);
          returnAction.setReturnTime(false, returnTime);
        }}
        height="36px"
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize="16px"
        fontWeight={500}
        letterSpacing="-0.5px"
        borderRadius="4px"
        mb="0"
        px={12}
        border="none"
        data-cy="abort-search"
      >
        {t(`${intlKey}.ActionButtons.Return`)}
      </ActionButton>
    </Box>
  );
};

export default ReturnButton;
