import { gridSelectors } from '@oplog/data-grid';
import { Box, Button, Flex, Icon, Modal, ModalContent } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { clearDqbFromUrl } from '../../../../utils/url-utils';
import useRouteProps from '../../../../utils/useRouteProps';
import AddressesGrid from './AddressesGrid';
import ListsGrid from './ListsGrid';

const intlKey = 'TrackW2WPlan.CreateCountingForIncorrectAddressesModal';

export interface ICreateCountingForIncorrectAddressesModal {
  isOpen: boolean;
  onClose: () => void;
  stockCountingPlanId: string;
  getCurrentData: (gridTab: string) => void;
  setIsGenericErrorModalOpen: (status: boolean) => void;
}

const CreateCountingForIncorrectAddressesModal: FC<ICreateCountingForIncorrectAddressesModal> = ({
  isOpen,
  onClose,
  stockCountingPlanId,
  getCurrentData,
  setIsGenericErrorModalOpen,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const routeProps = useRouteProps();
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [selectedCellIds, setSelectedCellIds] = useState<number[]>([]);
  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.GetCellsForControlCount, state.grid)
  );
  const createListForIncorrectCountedCellsResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateListForIncorrectCountedCells]
  );

  const element = document.querySelector('#order-item-list')?.children[0] as HTMLDivElement;
  if (element) element.style.top = '-10px';

  useEffect(() => {
    if (createListForIncorrectCountedCellsResponse?.isSuccess) {
      onClose();
      getCurrentData(routeProps.match.params['tab']);
    }
    if (createListForIncorrectCountedCellsResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [createListForIncorrectCountedCellsResponse]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedListIds([]);
      setSelectedCellIds([]);
      routeProps.history.replace(clearDqbFromUrl(location.pathname));
    }
  }, [isOpen]);

  return (
    <Modal
      showOverlay
      size="full"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_lighter"
      boxShadow="none"
      showCloseButton
      closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
    >
      <ModalContent px={16} pt={0} display="flex" flexDirection="column" mt={38} overflow="hidden">
        <Box textAlign="center" fontSize="22" fontWeight={700} color="text.h1">
          {t(`${intlKey}.Heading`)}
        </Box>
        <Flex justifyContent="space-evenly" mt={32}>
          <Box>
            <Box textAlign="center" fontSize="18" fontWeight={700} color="text.h2" mb={16}>
              {t(`${intlKey}.Lists`)}
            </Box>
            {!isGridBusy && (
              <ListsGrid
                stockCountingPlanId={stockCountingPlanId}
                selectedListIds={selectedListIds}
                setSelectedListIds={setSelectedListIds}
              />
            )}
          </Box>
          <Box>
            <Box textAlign="center" fontSize="18" fontWeight={700} color="text.h2" mb={16}>
              {t(`${intlKey}.Addresses`)}
            </Box>
            <AddressesGrid
              stockCountingPlanId={stockCountingPlanId}
              selectedCellIds={selectedCellIds}
              setSelectedCellIds={setSelectedCellIds}
            />
          </Box>
        </Flex>
      </ModalContent>
      <Flex justifyContent="space-evenly" mb={44} mt={32}>
        <Button onClick={() => onClose()} isLoading={false} variant="dark" fontWeight={700} px={16}>
          {t(`${intlKey}.Cancel`)}
        </Button>
        <Button
          onClick={() =>
            dispatch(
              resourceActions.resourceRequested(ResourceType.CreateListForIncorrectCountedCells, {
                payload: {
                  stockCountingPlanId: stockCountingPlanId,
                  stockCountingListIds: selectedListIds,
                  cellIds: selectedCellIds,
                },
              })
            )
          }
          disabled={!selectedListIds.length && !selectedCellIds.length}
          isLoading={createListForIncorrectCountedCellsResponse?.isBusy}
          variant="alternative"
          fontWeight={700}
          px={16}
        >
          {t(`${intlKey}.CreateList`)}
        </Button>
      </Flex>
    </Modal>
  );
};

export default CreateCountingForIncorrectAddressesModal;
