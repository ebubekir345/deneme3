import { Button, Flex, Icon, Input } from '@oplog/express';
import React, { FC, KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import useProblemSolverStore from '../../../../store/global/problemSolverStore';
import { StoreState } from '../../../../store/initState';
import { actionBarcodes } from '../../../../typings/globalStore/enums';
import InfoMessageBox, { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { ModalBox } from '../../../molecules/TouchScreen';

interface ICargoPackageScanningModal {
  isOpen: boolean;
  setIsOpen: Function;
}

const intlKey = 'TouchScreen.ProblemSolver.Details.SolutionPanel.CargoPackageScanningModal';

const CargoPackageScanningModal: FC<ICargoPackageScanningModal> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [
    { scannedCargoPackages, infoMessageBox },
    { setScannedCargoPackages, callInfoMessageBox },
  ] = useProblemSolverStore();
  const [barcode, setBarcode] = useState('');
  const [cargoPackages, setCargoPackages] = useState<string[]>([])
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cargoCodeUpdatedProblemDetails = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCargoCodeUpdatedProblemDetails]
  );
  
  const handleBarcodeScan = (data: string) => {
    if (cargoPackages.some((label: string) => label.trim() === data.trim())) {
      const indexToRemove = cargoPackages.findIndex((label: string) => label.trim() === data.trim())
      cargoPackages.splice(indexToRemove, 1);

      setScannedCargoPackages([...scannedCargoPackages, data]);
      callInfoMessageBox({
        state: InfoMessageBoxState.Success,
        text: t(`${intlKey}.SuccessPackage`),
      });
    } else {
      callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`TouchScreen.Barcode.Error`),
      });
    }
    setIsDisabled(true);
    setTimeout(() => {
      setBarcode('');
      setIsDisabled(false);
      inputRef.current?.focus();
    }, 1000);
  };

useEffect(() => {
  cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels && setCargoPackages([...cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels])
}, [cargoCodeUpdatedProblemDetails])

  useEffect(() => {
    scannedCargoPackages.length === cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length && setIsOpen(false);
  }, [scannedCargoPackages]);

  return (
    <>
      <ModalBox
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        width={1 / 3}
        contentBoxProps={{
          py: '60',
          px: '30',
        }}
        icon={
          <Flex
            width={64}
            height={64}
            borderRadius="full"
            bg="palette.softBlue_lighter"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="fas fa-box-alt" fontSize={32} color="palette.blue" />
          </Flex>
        }
      >
        <Flex width={1} flexDirection="column" px={22}>
          <Flex fontSize={26} my={26} textAlign="center" flexDirection="column">
            {t(`${intlKey}.Title`)}
          </Flex>
          <Flex>
            <Input
              fontWeight={700}
              fontSize={26}
              pl={22}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => setBarcode(e.currentTarget.value)}
              value={barcode}
              disabled={isDisabled}
              height={64}
              maxLength={50}
              data-testid="input-box"
              autoFocus
              ref={inputRef}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === actionBarcodes.Enter || e.code === 'Enter') {
                  barcode.trim() && handleBarcodeScan(barcode);
                }
              }}
            />
            <Button
              onClick={() => handleBarcodeScan(barcode)}
              disabled={!barcode.trim()}
              fontSize={22}
              height={64}
              ml={6}
              bg="palette.white"
              color="palette.blue_darker"
              _hover={{
                backgroundColor: 'palette.blue_darker',
                color: 'palette.white',
              }}
            >
              {t(`${intlKey}.Okay`)}
            </Button>
          </Flex>
        </Flex>
      </ModalBox>
      <InfoMessageBox message={infoMessageBox} callInfoMessageBox={callInfoMessageBox} />
    </>
  );
};

export default CargoPackageScanningModal;
