import { Flex, Icon, Modal, ModalContent, PseudoBox, Text } from '@oplog/express';
import React from 'react';
import { Trans } from 'react-i18next';
import CargoPackageMapper from '../../molecules/CargoPackageMapper/CargoPackageMapper';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';

const intlKey = 'TouchScreen.PackingStation.CargoPackagePickerModal';

export interface ICargoPackagePickerModal {
  isOpen: boolean;
  onClose: () => void;
  handleSelectCargoPackage: (barcode: string) => void;
  packingState: any;
}

const CargoPackagePickerModal: React.FC<ICargoPackagePickerModal> = ({
  isOpen,
  onClose,
  handleSelectCargoPackage,
  packingState,
}) => {
  return (
    <Modal
      showOverlay
      showCloseButton={false}
      size="6xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="md"
      bg="palette.softGrey"
      boxShadow="none"
      disableEscapeButtonClose
      disableOutsideMouseEvents={packingState.station.discriminator === DiscriminatorTypes.SimplePackingAddress && true}
    >
      <ModalContent p={22} display="flex" flexDirection="column">
        {packingState.station.discriminator !== DiscriminatorTypes.SimplePackingAddress && <PseudoBox onClick={() => onClose()} bg="transparent" _hover={{ cursor: 'pointer' }} textAlign="right">
          <Icon name="fal fa-times" fontSize={26} fontWeight={500} color="palette.grey_dark" />
        </PseudoBox>}
        {packingState.operationCargoPackageTypes.length !== 0 && (
          <>
            <Flex width={1} justifyContent="space-between" alignItems="center">
              <Text color="palette.slate_dark" fontWeight={700} fontSize={32} letterSpacing="negativeLarge">
                <Trans
                  i18nKey={`${intlKey}.OperationPackageTitle`}
                  values={{
                    operation: packingState.operation.name,
                  }}
                />
              </Text>
            </Flex>
            <Flex
              fontWeight={500}
              fontSize={18}
              color="palette.slate_dark"
              letterSpacing="small"
              my={30}
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                <Icon name="fal fa-barcode-read" fontSize={22} bg="palette.white" p={6} mr={11} />
                <Trans
                  i18nKey={`${intlKey}.ScanOrSelect`}
                  values={{
                    operation: packingState.operation.name,
                  }}
                />
              </Flex>
            </Flex>
            <CargoPackageMapper
              packages={packingState.operationCargoPackageTypes}
              handleSelectCargoPackage={handleSelectCargoPackage}
            />
          </>
        )}

        <Flex my={30}>
          <Text color="palette.slate_dark" fontWeight={700} fontSize={32} letterSpacing="negativeLarge">
            <Trans i18nKey={`${intlKey}.OplogPackageTitle`} />
          </Text>
        </Flex>
        <Flex
          fontWeight={500}
          fontSize={18}
          color="palette.slate_dark"
          letterSpacing="small"
          mb={30}
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            <Icon name="fal fa-barcode-read" fontSize={22} bg="palette.white" p={6} mr={11} />
            <Trans i18nKey={`${intlKey}.ScanOrSelectOplog`} />
          </Flex>
        </Flex>
        <CargoPackageMapper
          packages={packingState.oplogCargoPackageTypes}
          handleSelectCargoPackage={handleSelectCargoPackage}
        />
      </ModalContent>
    </Modal>
  );
};

export default CargoPackagePickerModal;
