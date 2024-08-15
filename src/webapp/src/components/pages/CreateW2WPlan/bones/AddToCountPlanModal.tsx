import { gridActions } from '@oplog/data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogTypes,
  Flex,
  Icon,
  Input,
  Modal,
  ModalContent,
  Radio,
  RadioGroup,
  Text,
  Toggle,
} from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { WallToWallStockCountingPlanOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import WarningModal from '../../../molecules/WarningModal/WarningModal';

interface IAddToCountPlanModal {
  isOpen: boolean;
  setIsOpen: Function;
  selectedCellIds: string[];
  stockCountingPlanId: string;
  setStockCountingPlanId: Function;
  setSelectedCellIds: Function;
  countingPlanName: string;
  setIsGenericErrorModalOpen: Function;
}

enum ListCountType {
  NumberOfAddressesPerList = 'NumberOfAddressesPerList',
  TotalNumberOfList = 'TotalNumberOfList',
}

const intlKey = 'CreateW2WPlan.AddToCountPlanModal';

const AddToCountPlanModal: FC<IAddToCountPlanModal> = ({
  isOpen,
  setIsOpen,
  selectedCellIds,
  stockCountingPlanId,
  setStockCountingPlanId,
  setSelectedCellIds,
  countingPlanName,
  setIsGenericErrorModalOpen,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [allowManualCountEntry, setAllowManualCountEntry] = useState<boolean>(true);
  const [isImportant, setIsImportant] = useState<boolean>(true);
  const [listCount, setListCount] = useState<number | undefined>();
  const [listCountType, setListCountType] = useState<string>('');
  const [mandatoryCountAmount, setMandatoryCountAmount] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const assignToWallToWallStockCountingPlanResponse: Resource<WallToWallStockCountingPlanOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.AssignToWallToWallStockCountingPlan]
  );

  const initializer = () => {
    setIsOpen(false);
    setIsDialogOpen(false);
    setAllowManualCountEntry(true);
    setIsImportant(true);
    setListCount(undefined);
    setListCountType('');
  };

  useEffect(() => {
    if (assignToWallToWallStockCountingPlanResponse?.isSuccess) {
      const updatedStockCountingPlanId = assignToWallToWallStockCountingPlanResponse?.data?.id as string;
      setStockCountingPlanId(updatedStockCountingPlanId);
      initializer();
      setSelectedCellIds([]);
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingCounts, {
          stockCountingPlanId: updatedStockCountingPlanId,
        })
      );
      dispatch(
        gridActions.gridFetchRequested(GridType.WallToWallStockCountingTasksQueryCells, [updatedStockCountingPlanId])
      );
    } else if (assignToWallToWallStockCountingPlanResponse?.error?.code === 400) setIsWarningModalOpen(true);
    else if (assignToWallToWallStockCountingPlanResponse?.error) setIsGenericErrorModalOpen(true);
  }, [assignToWallToWallStockCountingPlanResponse]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => initializer()}
      size="3xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      contentBoxProps={{
        overflow: 'hidden',
        textAlign: 'left',
        px: '0',
      }}
      showCloseButton
      closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
    >
      <ModalContent flexDirection="column" fontSize={22} px={0} overflow="auto" width="fit-content" mt={16} ml={44}>
        <Flex height={250} justifyContent="space-between" flexDirection="column">
          <Box fontWeight={700} mb={16} color="palette.grey_darker">
            <Trans i18nKey={`${intlKey}.SelectTheSettings`} count={selectedCellIds?.length} />
          </Box>
          <Flex>
            <Toggle
              defaultIsChecked={allowManualCountEntry}
              onChange={() => {
                setAllowManualCountEntry(!allowManualCountEntry);
              }}
            />
            <Box ml={16}>{t(`${intlKey}.AllowManualCountEntry`)}</Box>
          </Flex>
          <Flex alignItems="center">
            <RadioGroup textAlign="left" onChange={e => setListCountType(e.target.value)} fontSize={16}>
              <Radio value={ListCountType.NumberOfAddressesPerList}>
                {t(`${intlKey}.${ListCountType.NumberOfAddressesPerList}`)}
              </Radio>
              <Radio value={ListCountType.TotalNumberOfList} mt={16}>
                {t(`${intlKey}.${ListCountType.TotalNumberOfList}`)}
              </Radio>
            </RadioGroup>
            <Input
              pl={22}
              ml={16}
              type="number"
              min={1}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => setListCount(parseInt(e.currentTarget.value))}
              value={listCount}
              height={32}
              width={100}
              autoFocus
            />
          </Flex>
          <Flex>
            <Toggle
              defaultIsChecked={isImportant}
              onChange={() => {
                setIsImportant(!isImportant);
              }}
            />
            <Box ml={16}>{t(`${intlKey}.Important`)}</Box>
          </Flex>
          <Flex>
            <Box mr={16}>{t(`${intlKey}.MandatoryCountAmount`)}</Box>
            <Input
              pl={22}
              ml={16}
              type="number"
              min={1}
              max={3}
              onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                setMandatoryCountAmount(parseInt(e.currentTarget.value))
              }
              value={mandatoryCountAmount}
              height={32}
              width={100}
            />
          </Flex>
        </Flex>
      </ModalContent>
      <Box alignSelf="flex-end">
        <Button
          onClick={() => {
            setIsDialogOpen(true);
          }}
          disabled={!listCountType || !listCount || !mandatoryCountAmount}
          isLoading={assignToWallToWallStockCountingPlanResponse?.isBusy}
          variant="alternative"
          fontWeight={700}
          m={64}
        >
          {t(`CreateW2WPlan.Buttons.AddToCountPlan`)}
        </Button>
      </Box>
      <Dialog
        message={
          <Text fontWeight={500} lineHeight="small" color="palette.black">
            {t(`${intlKey}.Approve`)}
          </Text>
        }
        isOpen={isDialogOpen}
        isLoading={assignToWallToWallStockCountingPlanResponse?.isBusy}
        onApprove={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.AssignToWallToWallStockCountingPlan, {
              payload: {
                stockCountingPlanId: stockCountingPlanId,
                stockCountingPlanName: countingPlanName,
                cellIds: selectedCellIds,
                allowManualEntry: allowManualCountEntry,
                isSignificant: isImportant,
                ...(listCountType === ListCountType.NumberOfAddressesPerList
                  ? { addressCountPerList: listCount }
                  : { totalListCount: listCount }),
                minCountingAmount: mandatoryCountAmount,
              },
            })
          )
        }
        onCancel={() => setIsDialogOpen(false)}
        type={DialogTypes.Information}
        text={{
          approve: t(`TouchScreen.ActionButtons.Save`),
          cancel: t(`TouchScreen.ActionButtons.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
          zIndex: 4010,
        }}
      />
      <WarningModal
        isOpen={isWarningModalOpen}
        setModal={setIsWarningModalOpen}
        header={t(`${intlKey}.InvalidEntry`)}
      />
    </Modal>
  );
};

export default AddToCountPlanModal;
