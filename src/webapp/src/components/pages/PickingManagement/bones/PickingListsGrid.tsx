import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Button, Dialog, DialogTypes, Flex, Icon, Modal, Text, useToast } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType, ResourceType } from '../../../../models';
import { LogicalOperator, PickListState } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { filterApplier } from '../../../../utils/filterApplier';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import QuickFilterBar from '../../../molecules/QuickFilterBar';
import { SearchBar } from '../../../molecules/SearchBar/SearchBar';
import { pickingListsColumns } from './columns/pickingListsColumns';

const intlKey = 'PickingManagement.PickingListsGrid';
const titleKey = 'PickingManagement.PickingListsGrid.Title';

export enum FilterID {
  PickingStarted = 'PickingStarted',
  PickingCompleted = 'PickingCompleted',
  Created = 'Created',
  Assigned = 'Assigned',
}

enum PickListStatusFilter {
  Created = 'Created',
  Assigned = 'Assigned',
  PickingStarted = 'PickingStarted',
  PickingCompleted = 'PickingCompleted',
}

export const initialFilters = [
  {
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      value: PickListState.PickingStarted,
      id: FilterID.PickingStarted,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      value: PickListState.PickingCompleted,
      id: FilterID.PickingCompleted,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      logicalOperator: LogicalOperator.Or,
      value: PickListState.Created,
      id: FilterID.Created,
    }),
    selected: false,
    visibility: false,
  },
  {
    filter: new StringFilter({
      property: 'state',
      op: StringFilterOperation.Equals,
      value: PickListState.Assigned,
      id: FilterID.Assigned,
    }),
    selected: true,
    visibility: false,
  },
];

const PickingListsGrid: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const toast = useToast();
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState<PickListStatusFilter[]>([]);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  const [qrCode, setQRCode] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const pickingListsColumnsArray: Array<any> = pickingListsColumns(setQRCode, setIsQRCodeOpen);
  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.PickingListsGrid, state.grid)
  );
  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.PickingListsGrid, state.grid)
  );
  const deletePickListsResponse = useSelector((state: StoreState) => state.resources[ResourceType.DeletePickLists]);

  const quickFilterButtons = Object.keys(PickListStatusFilter).map(status => ({
    key: status,
    title: t(`${intlKey}.QuickFilters.${status}`),
    isSelected:
      (!activeFilter.length && status === PickListStatusFilter.Assigned) ||
      activeFilter.includes(PickListStatusFilter[status]),
    onClick: () => {
      if (!isGridBusy) {
        setActiveFilter([PickListStatusFilter[status]]);
      }
    },
  }));

  useEffect(() => {
    localStorage.getItem('filters') && setActiveFilter([PickListStatusFilter.Created, PickListStatusFilter.Assigned]);
    filterApplier(GridType.PickingListsGrid, dispatch, history);
  }, []);

  useEffect(() => {
    if (activeFilter.length) {
      initialFilters.forEach((x): any => {
        x.selected = false;
        if (activeFilter.includes(x.filter.value as PickListStatusFilter)) x.selected = true;
      });
      dispatch(gridActions.gridPaginationOffsetReset(GridType.PickingListsGrid));
      dispatch(gridActions.gridPredefinedFiltersInitialized(GridType.PickingListsGrid, initialFilters));
      dispatch(gridActions.gridFetchRequested(GridType.PickingListsGrid, undefined, history));
    }
  }, [activeFilter]);

  useEffect(() => {
    setSelectedIndexes([]);
    setSelectedRows([]);
  }, [gridRawData]);

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
    setSelectedRows(selectedRows.concat(rows));
  };

  const onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    setSelectedRows(
      selectedRows.filter((_, index) => index !== selectedIndexes.findIndex(i => rowIndexes.indexOf(i) !== -1))
    );
    setSelectedIndexes(selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1));
  };

  const handleDeletePickLists = () => {
    const count = deletePickListsResponse?.data?.deleted.length;
    setIsDialogOpen(false);
    setSelectedIndexes([]);
    setSelectedRows([]);
    setTimeout(() => {
      dispatch(gridActions.gridFetchRequested(GridType.PickingListsGrid));
      dispatch(resourceActions.resourceInit(ResourceType.DeletePickLists));
    }, 500);
    count
      ? toast({
          position: 'bottom-left',
          variant: 'success',
          title: t(`${intlKey}.Toast.SuccessTitle`),
          description: t(`${intlKey}.Toast.SuccessDescription`, {
            count: count,
          }),
          duration: 5000,
          icon: { name: 'fas fa-check-circle' },
        })
      : toast({
          position: 'bottom-left',
          variant: 'danger',
          title: t(`${intlKey}.Toast.FailTitle`),
          description: t(`${intlKey}.Toast.FailDescription`),
          duration: 5000,
          icon: { name: 'fas fa-times-circle' },
        });
  };

  useEffect(() => {
    if (deletePickListsResponse?.isSuccess) handleDeletePickLists();
  }, [deletePickListsResponse]);

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.PickingListsGrid}
        columns={pickingListsColumnsArray}
        predefinedFilters={initialFilters}
        rowSelection={
          activeFilter?.join() === PickListStatusFilter.Created
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
          <Flex justifyContent="space-between">
            <Flex alignItems="center">
              <SearchBar
                grid={GridType.PickingListsGrid}
                searchProperty={'pickListName'}
                placeholder={t(`${intlKey}.Placeholder`)}
                width={320}
              />
              {activeFilter?.join() === PickListStatusFilter.Created && (
                <Flex alignItems="center" fontSize={13} color="palette.black" ml={22}>
                  <b>{selectedIndexes.length}</b>
                  <pre> </pre>
                  {t(`${intlKey}.SelectedLists`)}
                </Flex>
              )}
            </Flex>{' '}
            {activeFilter?.join() === PickListStatusFilter.Created && (
              <Button
                ml={16}
                px={32}
                variant="danger"
                fontWeight={700}
                disabled={!selectedIndexes.length}
                onClick={() => setIsDialogOpen(true)}
              >
                {t(`${intlKey}.Delete`)}
              </Button>
            )}
          </Flex>
        }
      />
      <Dialog
        message={
          <Text lineHeight="xxLarge" letterSpacing="medium" color="palette.black">
            {selectedRows.length === 1 ? (
              <Trans
                i18nKey={`${intlKey}.SureToDeleteSingle`}
                values={{
                  pickListName: selectedRows[0].row.pickListName,
                }}
              />
            ) : (
              <Trans i18nKey={`${intlKey}.SureToDeleteMulti`} count={selectedRows?.length} />
            )}
          </Text>
        }
        isOpen={isDialogOpen}
        isLoading={deletePickListsResponse?.isBusy}
        onApprove={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.DeletePickLists, {
              params: { pickListIds: selectedRows.map(row => row.row.pickListId) },
            })
          )
        }
        onCancel={() => {
          setSelectedIndexes([]);
          setSelectedRows([]);
          setIsDialogOpen(false);
        }}
        type={DialogTypes.Information}
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
    </>
  );
};

export default PickingListsGrid;
