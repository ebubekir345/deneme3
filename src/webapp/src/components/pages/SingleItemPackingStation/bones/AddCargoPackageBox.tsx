import React, { ReactElement } from 'react';
import { Flex, Icon, Text } from '@oplog/express';
import { Trans, useTranslation } from 'react-i18next';
import useSingleItemPackingStore, { SingleItemPackingModals } from '../../../../store/global/singleItemPackingStore';
import { ActionButton } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.SingleItemPackingStation.Package';

const AddCargoPackageBox: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useSingleItemPackingStore();
  return (
    <Flex width={1} flexDirection="column" p={22} mx="0" bg="palette.blue_darker" borderRadius={8}>
      <Flex alignItems="center" justifyContent="center" flexDirection="column" px={8}>
        <Icon name="fal fa-barcode-read" fontSize={32} color="palette.white" />
        <Text fontWeight={500} fontSize={38} lineHeight="52px" color="palette.white" mt={18} textAlign="center">
          <Trans
            i18nKey={`${intlKey}.ScanOrSelect`}
            values={{
              operation: packingState.operation.name,
            }}
          />
        </Text>
        <Text fontSize={24} fontWeight={500} lineHeight="52px" color="palette.white" mb={14}>
          {t(`${intlKey}.Or`)}
        </Text>
        <ActionButton
          onClick={() => packingAction.toggleModalState(SingleItemPackingModals.CargoPackagePick)}
          minWidth={428}
          backgroundColor="palette.white"
          color="#868F9D"
          fontSize={32}
          borderRadius={8}
          fontWeight="500"
          mb="0"
          p={24}
          bs="0px 4px 10px rgba(91, 141, 239, 0.1)"
          border="none"
        >
          {t(`${intlKey}.SelectPackage`)}
        </ActionButton>
      </Flex>
    </Flex>
  );
};

export default AddCargoPackageBox;
