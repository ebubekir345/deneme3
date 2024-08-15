import React, { ReactElement } from 'react';
import { Flex, Icon, Text } from '@oplog/express';
import { Trans, useTranslation } from 'react-i18next';
import usePackingStore, { PackingModals } from '../../../../store/global/packingStore';
import { ActionButton } from '../../../atoms/TouchScreen';

interface IAddCargoPackageBox {
  isExpanded: boolean;
}

const intlKey = 'TouchScreen.PackingStation.Package';

const AddCargoPackageBox: React.FC<IAddCargoPackageBox> = ({ isExpanded }): ReactElement => {
  const { t } = useTranslation();
  const [packingState, packingAction] = usePackingStore();
  return (
    <Flex width={1} flexDirection="column" p={12} mb={16} mx={isExpanded ? '8px' : '0'} bg="#A0AEC0" borderRadius={8}>
      <Flex alignItems="center" mb={14}>
        <Flex
          justifyContent="center"
          alignItems="center"
          width={36}
          height={36}
          bg="palette.white"
          borderRadius={4}
          flexShrink={0}
        >
          <Icon name="fal fa-barcode-read" fontSize={20} color="#4A5568" />
        </Flex>
        <Text fontWeight={500} fontSize={16} lineHeight="xLarge" color="palette.white" ml={10}>
          <Trans
            i18nKey={`${intlKey}.ScanOrSelect`}
            values={{
              operation: packingState.operation.name,
            }}
          />
        </Text>
      </Flex>
      <ActionButton
        onClick={() => packingAction.toggleModalState(PackingModals.CargoPackagePick)}
        height={42}
        width={1}
        backgroundColor="palette.white"
        color="#4A5568"
        fontSize={16}
        borderRadius={4}
        fontWeight="500"
        mb="0"
        bs="0"
        border="none"
      >
        {t(`${intlKey}.SelectPackage`)}
      </ActionButton>
    </Flex>
  );
};

export default AddCargoPackageBox;
