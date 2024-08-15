import { Flex, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import usePackingStore from '../../../store/global/packingStore';
import { ActionButton } from '../../atoms/TouchScreen';
import { ModalBox } from '../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

interface IPrintPalletModal {
  onPrintPalette: (pallet: BoxItemsInterface | undefined) => void;
  pallet: BoxItemsInterface | undefined;
  isModalOpen: boolean;
  setIsModalOpen: Function;
  packingState: any;
}

const PrintPalletModal: FC<IPrintPalletModal> = ({ onPrintPalette, pallet, isModalOpen, setIsModalOpen, packingState }) => {
  const { t } = useTranslation();

  return (
    <ModalBox
      onClose={() => setIsModalOpen(false)}
      isOpen={isModalOpen}
      width={640}
      subHeaderText={
        <Trans
          i18nKey={`${intlKey}.PackingStation.Package.AreYouSureToComplete`}
          values={{
            pallet: [...packingState.operationCargoPackageTypes, ...packingState.oplogCargoPackageTypes].find(
              type => type.barcode === pallet?.title
            )?.name,
          }}
        />
      }
      contentBoxProps={{
        py: '60',
        px: '38',
        color: 'palette.hardBlue_darker',
        fontWeight: '700',
        lineHeight: 'xxLarge',
      }}
      icon={
        <Flex
          width={120}
          height={120}
          mb={22}
          borderRadius="full"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="far fa-engine-warning" fontSize="48" color="palette.softBlue_light" />
        </Flex>
      }
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.4,
      }}
    >
      <ActionButton
        onClick={() => setIsModalOpen(false)}
        height="44"
        width="126px"
        bg="transparent"
        color="palette.softBlue"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        mb="0"
        fontWeight={700}
        px={11}
        border="xs"
        borderColor="palette.softBlue"
      >
        {t(`${intlKey}.ActionButtons.Cancel`)}
      </ActionButton>
      <ActionButton
        onClick={() => {
          onPrintPalette(pallet);
          setIsModalOpen(false);
        }}
        height="48px"
        width="126px"
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight={700}
        px={11}
        mb="0"
        border="none"
      >
        {t(`${intlKey}.ActionButtons.Complete`)}
      </ActionButton>
    </ModalBox>
  );
};

export default PrintPalletModal;
