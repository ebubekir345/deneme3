import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@oplog/express';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ProblemSolverModals } from '../../../../typings/globalStore/enums';
import useProblemSolverStore from '../../../../store/global/problemSolverStore';

const intlKey = 'TouchScreen';

const MoreActionScreen: React.FC = () => {
  const { t } = useTranslation();
  const [{ isMoreActionsOpen }, { setIsMoreActionsOpen, toggleModalState }] = useProblemSolverStore();
  if (isMoreActionsOpen) {
    return (
      <>
        <Box
          onClick={() => setIsMoreActionsOpen(false)}
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
          transform="translateY(-56px)"
          width="auto"
          height="auto"
          zIndex={2}
        >
          <Box width="fit-content">
            <ActionButton
              onClick={() => {
                toggleModalState(ProblemSolverModals.Logout);
                setIsMoreActionsOpen(false);
              }}
              icon="far fa-arrow-from-right"
              iconColor="palette.softBlue"
              height={38}
              backgroundColor="palette.slate_lighter"
              color="palette.softBlue"
              fontSize={16}
              fontWeight={500}
              letterSpacing="negativeLarge"
              border="unset"
              borderRadius="sm"
              px={11}
            >
              {t(`${intlKey}.ActionButtons.Logout`)}
            </ActionButton>
          </Box>
        </Flex>
      </>
    );
  }
  return <></>;
};

export default MoreActionScreen;
