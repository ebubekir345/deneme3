import { gridActions, gridSelectors, PredefinedFilter } from '@oplog/data-grid';
import { Box, Button, Dialog, DialogTypes, Flex, Icon, Modal, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { BatchPickingState, PicklistRequestState } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilterBar from '../../../molecules/QuickFilterBar';
import WarningModal from '../../../molecules/WarningModal/WarningModal';
import { batchManagementGridColumns } from './batchManagementGridColumns';

const intlKey = 'BatchManagement';
const titleKey = 'BatchManagement.Title';

const batchManagementGridPredefinedFilters: PredefinedFilter[] = [
  ...Object.values(PicklistRequestState).map(filter => ({
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      value: filter,
      id: filter,
    }),
    selected: filter === PicklistRequestState.PickingNotStarted ? true : false,
    visibility: filter === PicklistRequestState.PickingNotStarted ? true : false,
  })),
  ...Object.values(BatchPickingState).map(filter => ({
    filter: new StringFilter({
      property: 'batchPickingState',
      op: StringFilterOperation.Equals,
      value: filter,
      id: filter,
    }),
    selected: false,
    visibility: false,
  })),
];

const BatchManagementGrid = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeQuickFilters, setActiveQuickFilters] = useState(['']);
  const [selectedIndexes, setSelectedIndexes] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedBatchReferenceNumbers, setSelectedBatchReferenceNumbers] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteButtonClicked, setIsDeleteButtonClicked] = useState<boolean>(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  const [qrCode, setQRCode] = useState<string>('');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [batchName, setBatchName] = useState<string>('');
  const batchManagementGridColumnsArray: Array<any> = batchManagementGridColumns(
    setQRCode,
    setIsQRCodeOpen,
    setIsWarningModalOpen,
    setBatchName
  );

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.PickListRequests, state.grid)
  );
  const appliedPredefinedFilters: PredefinedFilter[] = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(GridType.PickListRequests, state.grid)
  );
  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PickListRequests, state.grid)
  );
  const pickListRequestsDeleteResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.PickListRequestsDelete]
  );
  const pickListRequestsPrioritizeResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.PickListRequestsPrioritize]
  );

  const quickFilterButtons = Object.keys(PicklistRequestState)
    .concat(Object.keys(BatchPickingState))
    .map(status => ({
      key: status,
      title: t(`${intlKey}.QuickFilters.${status}`),
      isSelected: activeQuickFilters.includes(status),
      onClick: () => {
        if (!isGridBusy) {
          let filters = appliedPredefinedFilters.map(filter => ({
            ...filter,
            selected: filter.filter.valueToString() === status,
            visibility: filter.filter.valueToString() === status,
          }));

          if (filters.length) {
            dispatch(gridActions.gridPaginationOffsetReset(GridType.PickListRequests));
            dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.PickListRequests, filters));
            dispatch(gridActions.gridFetchRequested(GridType.PickListRequests));
          }
        }
      },
    }));
  const failedQuickFilterButton = quickFilterButtons.shift();
  failedQuickFilterButton && quickFilterButtons.push(failedQuickFilterButton);
  quickFilterButtons.shift();
  quickFilterButtons.splice(3, 1);

  useEffect(() => {
    const appliedQuickFilters = appliedPredefinedFilters
      .filter(filter => filter.selected)
      .map(filter => filter.filter.valueToString());
    setActiveQuickFilters(appliedQuickFilters.length ? appliedQuickFilters : ['']);
  }, [appliedPredefinedFilters]);

  const initializer = () => {
    setSelectedBatchReferenceNumbers([]);
    setSelectedIndexes([]);
    setSelectedRows([]);
    setIsDeleteButtonClicked(false);
    setIsDialogOpen(false);
    dispatch(gridActions.gridFetchRequested(GridType.PickListRequests));
  };

  useEffect(() => {
    pickListRequestsDeleteResponse?.isSuccess && initializer();
  }, [pickListRequestsDeleteResponse]);

  useEffect(() => {
    pickListRequestsPrioritizeResponse?.isSuccess && initializer();
  }, [pickListRequestsPrioritizeResponse]);

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
    setSelectedRows(selectedRows.concat(rows));
    setSelectedBatchReferenceNumbers(selectedBatchReferenceNumbers.concat(rows.map(row => row.row.referenceNumber)));
  };

  const onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    setSelectedRows(
      selectedRows.filter((_, index) => index !== selectedIndexes.findIndex(i => rowIndexes.indexOf(i) !== -1))
    );
    setSelectedIndexes(selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1));
    setSelectedBatchReferenceNumbers(
      selectedBatchReferenceNumbers.filter(i => !rows.some(row => row.row.referenceNumber === i))
    );
  };

  useEffect(() => {
    setSelectedIndexes(
      gridRawData
        ?.map((data, index) => (selectedBatchReferenceNumbers.indexOf(data['referenceNumber']) !== -1 ? index : null))
        .filter(index => index !== null)
    );
    setSelectedRows(gridRawData?.filter(data => selectedBatchReferenceNumbers.indexOf(data['referenceNumber']) !== -1));
  }, [gridRawData]);

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PickListRequests}
        columns={batchManagementGridColumnsArray}
        predefinedFilters={batchManagementGridPredefinedFilters}
        rowSelection={
          activeQuickFilters.includes(PicklistRequestState.PickingNotStarted)
            ? {
                onRowsSelected: onRowsSelected,
                onRowsDeselected: onRowsDeselected,
                selectBy: {
                  indexes: selectedIndexes,
                },
              }
            : undefined
        }
        headerContent={
          activeQuickFilters.includes(PicklistRequestState.PickingNotStarted) && (
            <Flex justifyContent="space-between">
              <Flex alignItems="center">
                <Flex alignItems="center" fontSize={13} color="palette.black" ml={22}>
                  <Box fontWeight={900}>{selectedBatchReferenceNumbers.length}</Box>&nbsp;&nbsp;
                  <Box>{t(`${intlKey}.SelectedBatches`)}</Box>
                </Flex>
                <Button
                  ml={16}
                  variant="danger"
                  fontWeight={700}
                  disabled={!selectedBatchReferenceNumbers.length}
                  onClick={() => {
                    setSelectedBatchReferenceNumbers([]);
                    setSelectedIndexes([]);
                    setSelectedRows([]);
                  }}
                  outline="none !important"
                >
                  <Icon name="fas fa-trash-alt" mr={16} />
                  {t(`ManualPicklists.Clear`)}
                </Button>
              </Flex>
              <Flex>
                <Button
                  ml={16}
                  variant="alternative"
                  fontWeight={700}
                  disabled={!selectedBatchReferenceNumbers.length}
                  onClick={() => setIsDialogOpen(true)}
                  outline="none !important"
                >
                  {t(`${intlKey}.Prioritize`)}
                </Button>
                <Button
                  ml={16}
                  variant="danger"
                  fontWeight={700}
                  disabled={!selectedBatchReferenceNumbers.length}
                  onClick={() => {
                    setIsDeleteButtonClicked(true);
                    setIsDialogOpen(true);
                  }}
                  outline="none !important"
                >
                  {t(`${intlKey}.Delete`)}
                </Button>
              </Flex>
            </Flex>
          )
        }
      />
      <Dialog
        message={
          <Text fontWeight={500} lineHeight="small" color="palette.black">
            {selectedBatchReferenceNumbers.length === 1 ? (
              <Trans
                i18nKey={`${intlKey}.${isDeleteButtonClicked ? `SureToDelete` : `SureToPrioritize`}`}
                values={{
                  name: selectedRows[0]?.row?.name,
                }}
              />
            ) : (
              <Trans
                i18nKey={`${intlKey}.${isDeleteButtonClicked ? `SureToDeleteMulti` : `SureToPrioritizeMulti`}`}
                count={selectedBatchReferenceNumbers?.length}
              />
            )}
          </Text>
        }
        isOpen={isDialogOpen}
        isLoading={pickListRequestsDeleteResponse?.isBusy || pickListRequestsPrioritizeResponse?.isBusy}
        onApprove={() => {
          dispatch(
            resourceActions.resourceRequested(
              isDeleteButtonClicked ? ResourceType.PickListRequestsDelete : ResourceType.PickListRequestsPrioritize,
              {
                payload: {
                  referenceNumbers: selectedBatchReferenceNumbers,
                },
              }
            )
          );
        }}
        onCancel={() => {
          setIsDeleteButtonClicked(false);
          setIsDialogOpen(false);
        }}
        type={DialogTypes.Warning}
        text={{
          approve: t(`Modal.MultiStep.Next`),
          cancel: t(`Modal.MultiStep.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
      />
      <Modal
        showCloseButton={true}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.6,
        }}
        closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
      >
        <QRCodeSVG value={qrCode} size={600} includeMargin={true} />
      </Modal>
      <WarningModal
        isOpen={isWarningModalOpen}
        setModal={setIsWarningModalOpen}
        header={`${batchName} ${t(`${intlKey}.NoSuitableQRCodesToScan`)}`}
      />
    </>
  );
};

export default BatchManagementGrid;
