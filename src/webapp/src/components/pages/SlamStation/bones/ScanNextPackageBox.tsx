import React, { useState } from 'react';
import { Flex, Text } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../../atoms/TouchScreen';
import ManuelBarcodeInput from '../../../organisms/ManuelBarcodeInput';

const intlKey = 'TouchScreen.SlamStation.ManuelBarcodInput';

export interface ScanNextPackageBoxInterface {
  getBarcodeDataFromScreenKeyboard: (data: string) => void;
}

const ScanNextPackageBox: React.FC<ScanNextPackageBoxInterface> = ({ getBarcodeDataFromScreenKeyboard }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const closeScreenKeyboard = () => {
    setIsOpen(false);
  };

  return (
    <Flex
      width={400}
      height={90}
      justifyContent="space-between"
      alignItems="center"
      p={24}
      mt={24}
      bg="palette.softGrey"
      borderRadius={8}
    >
      <Text fontSize={26} color="palette.slate_dark" fontWeight={500} ml={16}>
        {t(`${intlKey}.Title`)}
      </Text>
      <ActionButton
        onClick={() => setIsOpen(true)}
        icon="far fa-keyboard"
        iconColor="palette.white"
        height={40}
        px={8}
        backgroundColor="palette.softBlue"
        borderRadius={12}
        boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.5)"
        border="0"
        data-testid="openCloseKeyboard"
      />
      {isOpen && (
        <ManuelBarcodeInput
          placeholder={t(`${intlKey}.PackageNumberPlaceholder`)}
          closeScreenKeyboard={closeScreenKeyboard}
          getBarcodeDataFromScreenKeyboard={getBarcodeDataFromScreenKeyboard}
        />
      )}
    </Flex>
  );
};

export default ScanNextPackageBox;
