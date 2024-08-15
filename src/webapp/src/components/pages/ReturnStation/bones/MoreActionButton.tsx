import { Box } from '@oplog/express';
import React from 'react';
import useReturnStore from '../../../../store/global/returnStore';
import { ActionButton } from '../../../atoms/TouchScreen';
import MoreActionScreen from './MoreActionScreen';

const MoreActionButton: React.FC = (): React.ReactElement => {
  const [returnState, returnAction] = useReturnStore();
  return (
    <Box>
      <ActionButton
        onClick={() => returnAction.setIsMoreActionsOpen(true)}
        icon="fas fa-ellipsis-v"
        iconColor="palette.softBlue"
        height="36px"
        px={16}
        backgroundColor="palette.blue_lighter"
        mb="0"
        border="0"
        data-cy="more-actions-button"
      />
      {returnState.isMoreActionsOpen && <MoreActionScreen />}
    </Box>
  );
};

export default MoreActionButton;
