import { Box } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from './TouchScreen';

const intlKey = 'TouchScreen';

interface IExpandButton {
  packingState: any;
  packingAction: any;
}

const ExpandButton: FC<IExpandButton> = ({ packingState, packingAction }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <ActionButton
        onClick={() => packingAction.setIsLeftBarExpanded(!packingState.isLeftBarExpanded)}
        icon="far fa-exchange"
        iconColor="palette.snow_light"
        height={38}
        backgroundColor="palette.softBlue"
        color="palette.softGrey_darker"
        fontSize="16"
        fontWeight={500}
        letterSpacing="negativeLarge"
        px={11}
        boxShadow="0 4px 9px 0 rgba(160, 174, 192, 0.5)" /* todo: add this colors to theme.ts later */
        border="solid 2px #a0aec0"
        data-cy="expand-button"
      >
        {packingState.isLeftBarExpanded ? t(`${intlKey}.ActionButtons.Shrink`) : t(`${intlKey}.ActionButtons.Expand`)}
      </ActionButton>
    </Box>
  );
};

export default ExpandButton;
