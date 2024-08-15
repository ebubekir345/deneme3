import { Box } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useReturnStore, { ReturnTooltips } from '../../../../store/global/returnStore';
import { ActionButton } from '../../../atoms/TouchScreen';
import CustomerInfoScreen from './CustomerInfoScreen';

const intlKey = 'TouchScreen';

const CustomerInfoButton: React.FC = () => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  return (
    <Box>
      <ActionButton
        onClick={() => returnAction.toggleTooltipState(ReturnTooltips.CustomerInfo, true)}
        icon="fas fa-user-circle"
        iconColor="palette.softBlue_light"
        height="36px"
        backgroundColor="palette.slate_lighter"
        color="#7c8ba2"
        fontSize="16px"
        fontWeight={500}
        letterSpacing="-0.5px"
        borderRadius="4px"
        mb="0"
        px={8}
        border="none"
        data-cy="customer-info-tooltip-button"
      >
        {t(`${intlKey}.ActionButtons.CustomerInfo`)}
      </ActionButton>
      {returnState.tooltips.CustomerInfo && <CustomerInfoScreen />}
    </Box>
  );
};

export default CustomerInfoButton;
