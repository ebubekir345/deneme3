import { Flex, Icon } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '../../../auth/auth0';
import { config } from '../../../config';
import { HovPackingModals } from '../../../store/global/hovPackingStore';
import { ActionButton } from '../../atoms/TouchScreen';
import { ModalBox } from '../TouchScreen';

const intlKey = 'TouchScreen';

interface IReturnDialogModal {
  modals: any;
  toggleModalState: Function;
  type: string;
}

const ReturnDialogModal: React.FC<IReturnDialogModal> = ({ modals, toggleModalState, type }): ReactElement => {
  const { t } = useTranslation();
  const { logout } = useAuth0();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={modals.Logout}
      width={640}
      headerText={t(`${intlKey}.LogoutModal.SureToLogout`)}
      subHeaderText={t(`${intlKey}.LogoutModal.WillNotCompletedWarning`, {
        type: t(type),
      })}
      icon={
        <Flex
          width={120}
          height={120}
          borderRadius="50%"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            name="far fa-arrow-from-right"
            fontSize="52"
            color="#9dbff9" /* todo: add this colors to theme.ts later */
          />
        </Flex>
      }
      contentBoxProps={{
        padding: '52px 32px 32px 32px',
        color: 'palette.hardBlue_darker',
      }}
    >
      <ActionButton
        onClick={() => toggleModalState(HovPackingModals.Logout)}
        height={48}
        width={172}
        backgroundColor="transparent"
        color="palette.softBlue"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight={700}
        px={11}
        border="solid 1.4px #5b8def"
      >
        {t(`${intlKey}.ActionButtons.Cancel`)}
      </ActionButton>
      <ActionButton
        onClick={() => {
          localStorage.clear();
          logout({ returnTo: config.auth.logout_uri });
        }}
        height={44}
        width={172}
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight={700}
        px={11}
        border="none"
        ml="22"
        data-cy="return-landing-page-button"
      >
        {t(`${intlKey}.ActionButtons.Logout`)}
      </ActionButton>
    </ModalBox>
  );
};

export default ReturnDialogModal;
