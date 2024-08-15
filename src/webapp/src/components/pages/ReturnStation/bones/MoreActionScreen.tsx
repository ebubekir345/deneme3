import React from 'react';
import { Box, Flex } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../../atoms/TouchScreen';
import useReturnStore, { initialReturnState, ReturnModals } from '../../../../store/global/returnStore';

const intlKey = 'TouchScreen';

const MoreActionScreen: React.FC = () => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();

  const onLogoutModalOpen = () => {
    returnAction.setIsMoreActionsOpen(false);
    returnAction.toggleModalState(ReturnModals.Logout);
  };

  const onAbortProcess = () => {
    returnAction.clearState(initialReturnState);
  };

  const onRevertLastAction = () => {
    returnAction.setPreviousBoxItems(returnState.boxItems);
    returnAction.setBoxItems(returnState.previousBoxItems);
    returnAction.setIsMoreActionsOpen(false);
  };

  const actions = [
    {
      title: t(`${intlKey}.ActionButtons.AbortProcess`),
      otherButtonProps: {
        onClick: () => onAbortProcess(),
        icon: 'far fa-bring-forward',
        iconColor: 'palette.softBlue',
        backgroundColor: 'palette.softBlue_lighter',
        color: 'palette.softBlue',
        border: 'solid 1px #5b8def',
      },
      dataCy: 'abort-process-button',
    },
    {
      title: t(`${intlKey}.ActionButtons.RevertLastAction`),
      otherButtonProps: {
        onClick: () => onRevertLastAction(),
        icon: 'far fa-undo',
        iconColor: 'palette.orange_darker',
        backgroundColor: 'palette.orange_lighter',
        color: 'palette.orange_darker',
        border: 'solid 1px #fdac42',
      },
      dataCy: 'revert-last-action-button',
    },
  ];

  return (
    <>
      <Box
        onClick={() => returnAction.setIsMoreActionsOpen(false)}
        position="fixed"
        width="100%"
        height="100%"
        left={0}
        top={0}
        zIndex={2}
        opacity={0.6}
        bg="palette.black"
      />
      <Flex
        position="absolute"
        flexDirection="column"
        transform={
          returnState.orderNumber && !returnState.isReturnCompleted ? 'translateY(-252px)' : 'translateY(-142px)'
        }
        width="auto"
        height="auto"
        zIndex={2}
      >
        <ActionButton
          onClick={() => {
            returnAction.setIsMoreActionsOpen(false);
            returnAction.setIsManuelBarcodeInputOpen(true);
          }}
          icon="fal fa-keyboard"
          iconColor="palette.white"
          height="36px"
          width="fit-content"
          backgroundColor="palette.softBlue"
          color="palette.white"
          fontSize="16px"
          fontWeight={500}
          letterSpacing="negativeLarge"
          border="unset"
          borderRadius="4px"
          mb="16"
          px={12}
        >
          {t(`${intlKey}.ActionButtons.BarcodeInput`)}
        </ActionButton>
        {returnState.orderNumber && !returnState.isReturnCompleted && (
          <>
            {actions.map((action, i) => (
              <ActionButton
                key={i.toString()}
                height="36px"
                fontSize="16px"
                fontWeight={500}
                letterSpacing="-0.5px"
                borderRadius="4px"
                mb="16px"
                px={12}
                width="fit-content"
                data-cy={action.dataCy}
                {...action.otherButtonProps}
              >
                <Flex alignItems="center" justifyContent="center">
                  {action.title}
                </Flex>
              </ActionButton>
            ))}
          </>
        )}
        <ActionButton
          onClick={() => onLogoutModalOpen()}
          icon="far fa-arrow-from-right"
          iconColor="palette.softBlue"
          height="36px"
          backgroundColor="palette.slate_lighter"
          color="palette.softBlue"
          fontSize="16"
          fontWeight={500}
          letterSpacing="negativeLarge"
          border="unset"
          borderRadius="sm"
          mb="0"
          px={11}
          width="fit-content"
          data-cy="return-home-button"
        >
          {t(`${intlKey}.ActionButtons.Logout`)}
        </ActionButton>
      </Flex>
    </>
  );
};

export default MoreActionScreen;
