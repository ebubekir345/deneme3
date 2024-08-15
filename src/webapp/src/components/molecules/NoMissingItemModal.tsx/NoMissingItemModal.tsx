import { Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC, ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import usePackingStore from '../../../store/global/packingStore';
import { StoreState } from '../../../store/initState';
import { ActionButton } from '../../atoms/TouchScreen';
import { ModalBox } from '../TouchScreen';

const intlKey = 'TouchScreen';

interface INoMissingItemModal {
  isOpen: boolean;
  setIsOpen: Function;
}

const NoMissingItemModal: FC<INoMissingItemModal> = ({ isOpen, setIsOpen }): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState] = usePackingStore();
  const removePackingQuarantineProcessResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.RemovePackingQuarantineProcess]
  );

  useEffect(() => {
    removePackingQuarantineProcessResponse?.isSuccess && location.reload();
  }, [removePackingQuarantineProcessResponse]);

  return (
    <ModalBox
      onClose={() => setIsOpen(true)}
      isOpen={isOpen}
      width={640}
      headerText={t(`${intlKey}.NoMissingItemModal.NoMissingItem`)}
      subHeaderText={t(`${intlKey}.NoMissingItemModal.PressContinue`)}
      icon={
        <Flex
          width={120}
          height={120}
          borderRadius="full"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="far fa-info-circle" fontSize="52" color="palette.softBlue_light" />
        </Flex>
      }
      contentBoxProps={{
        padding: '52px 32px 32px 32px',
        color: 'palette.hardBlue_darker',
      }}
    >
      <ActionButton
        onClick={() => setIsOpen(false)}
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
        {t(`${intlKey}.ActionButtons.Return`)}
      </ActionButton>
      <ActionButton
        onClick={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.RemovePackingQuarantineProcess, {
              payload: {
                packingQuarantineProcessId: packingState.processId,
                quarantineToteLabel: packingState.boxItems[0].title,
              },
            })
          )
        }
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
        {t(`Modal.MultiStep.Next`)}
      </ActionButton>
    </ModalBox>
  );
};

export default NoMissingItemModal;
