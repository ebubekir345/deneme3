import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Button, Dialog, DialogTypes, Flex, Icon, Image, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import { Pagination, QueryBuilder, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType, ResourceType } from '../../../../models';
import useCommonStore from '../../../../store/global/commonStore';
import { StoreState } from '../../../../store/initState';
import { clearDqbFromUrl } from '../../../../utils/url-utils';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { SearchBar } from '../../../molecules/SearchBar/SearchBar';
import { unassignedOrdersGridColumns } from './manualPicklistsColumns';
import PreviewModal from './PreviewModal';

const intlKey = 'ManualPicklists';
const titleKey = 'ManualPicklists.Title';

const ManualPicklists: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [{ selectedSalesOrderIds }, { setSelectedSalesOrderIds }] = useCommonStore();
  const [selectedIndexes, setSelectedIndexes] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPreviewButtonActive, setIsPreviewButtonActive] = useState<boolean>(false);
  const unassignedOrdersGridColumnsArray: Array<any> = unassignedOrdersGridColumns();

  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.ManualPicklists, state.grid)
  );
  const appliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(GridType.ManualPicklists, state.grid)
  );
  const createManualPicklistResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateManualPicklist]
  );

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
    setSelectedRows(selectedRows.concat(rows));
    setSelectedSalesOrderIds(selectedSalesOrderIds.concat(rows.map(row => row.row.id)));
  };

  const onRowsDeselected = rows => {
    setIsPreviewButtonActive(false);
    let rowIndexes = rows.map(r => r.rowIdx);
    setSelectedRows(
      selectedRows.filter((_, index) => index !== selectedIndexes.findIndex(i => rowIndexes.indexOf(i) !== -1))
    );
    setSelectedIndexes(selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1));
    setSelectedSalesOrderIds(
      selectedSalesOrderIds.filter(salesOrderId => !rows.some(row => row.row.id === salesOrderId))
    );
  };

  const handleShowSelectedOrders = () => {
    const builder = new QueryBuilder({
      filters: [
        ...appliedFilters,
        new StringFilter({
          property: 'id',
          op: StringFilterOperation.In,
          value: selectedSalesOrderIds.join(),
        }),
      ],
      pagination: new Pagination({ offset: 0, count: 100 }),
    });
    const query = builder.build();

    dispatch(gridActions.gridFiltersSubmitted(GridType.ManualPicklists, appliedFilters, []));
    dispatch(gridActions.gridPaginationChanged(GridType.ManualPicklists, new Pagination({ offset: 0, count: 100 })));
    dispatch(gridActions.gridFetchRequested(GridType.ManualPicklists, [query], history));
    setIsPreviewButtonActive(true);
  };

  useEffect(() => {
    if (selectedSalesOrderIds.length) handleShowSelectedOrders();
    else {
      dispatch(gridActions.gridPaginationChanged(GridType.ManualPicklists, new Pagination({ offset: 0, count: 100 })));
      dispatch(gridActions.gridFetchRequested(GridType.ManualPicklists, [], history));
    }
    return () => {
      dispatch(gridActions.gridStateCleared(GridType.ManualPicklists));
    };
  }, []);

  useEffect(() => {
    setSelectedIndexes(
      gridRawData
        ?.map((data, index) => (selectedSalesOrderIds.indexOf(data.id) !== -1 ? index : null))
        .filter(index => index !== null)
    );
    setSelectedRows(gridRawData?.filter(data => selectedSalesOrderIds.indexOf(data.id) !== -1));
  }, [gridRawData]);

  useEffect(() => {
    appliedFilters.some(filter => filter.property === 'id') && history.replace(clearDqbFromUrl(location.pathname));
  }, [history.location.search]);

  useEffect(() => {
    createManualPicklistResponse?.isSuccess && setIsPreviewButtonActive(false);
  }, [createManualPicklistResponse]);

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.ManualPicklists}
        columns={unassignedOrdersGridColumnsArray}
        predefinedFilters={[]}
        noRowsView={() =>
          !appliedFilters.length && !selectedSalesOrderIds.length ? (
            <Flex flexDirection="column" alignItems="center">
              <Image width={471} height={351} src="/images/create-cargo-plan.png" alt="create-cargo-plan" />
              <Text color="palette.grey_darker" fontWeight={600} fontSize={14} mt={32}>
                {t(`${intlKey}.EmptyFilterMessage`)}
              </Text>
            </Flex>
          ) : (
            <Box marginY="12" borderRadius="sm" boxShadow="small" paddingY="30" paddingX="60" bg="palette.white">
              {t(`DataGrid.NoRows.NoMatch`)}
            </Box>
          )
        }
        rowSelection={{
          onRowsSelected: onRowsSelected,
          onRowsDeselected: onRowsDeselected,
          selectBy: {
            indexes: selectedIndexes,
          },
        }}
        headerContent={
          <Flex justifyContent="space-between">
            <Flex alignItems="center">
              <SearchBar
                grid={GridType.ManualPicklists}
                searchProperty={'referenceNumber'}
                placeholder={t(`${intlKey}.Placeholder`)}
                width={320}
              />
              <Flex alignItems="center" fontSize={13} color="palette.black" ml={22}>
                <Box fontWeight={900}>{selectedSalesOrderIds.length}</Box>&nbsp;&nbsp;
                <Box>{t(`PickingManagement.WaitingOrdersGrid.SelectedOrders`)}</Box>
              </Flex>
              <Button
                ml={16}
                variant="danger"
                fontWeight={700}
                disabled={!selectedSalesOrderIds.length}
                onClick={() => setIsDialogOpen(true)}
                outline="none !important"
              >
                <Icon name="fas fa-trash-alt" mr={16} />
                {t(`${intlKey}.Clear`)}
              </Button>
            </Flex>
            <Button
              ml={16}
              variant="alternative"
              fontWeight={700}
              disabled={!selectedSalesOrderIds.length}
              onClick={() => {
                if (isPreviewButtonActive)
                  dispatch(
                    resourceActions.resourceRequested(ResourceType.PreviewManualPicklist, [
                      { salesOrderIds: selectedSalesOrderIds },
                    ])
                  );
                else handleShowSelectedOrders();
              }}
            >
              {t(`${intlKey}.${isPreviewButtonActive ? `Preview` : `Show`}`)}
            </Button>
          </Flex>
        }
      />
      <Dialog
        message={
          <Text fontWeight={500} lineHeight="small" color="palette.black">
            {selectedSalesOrderIds.length === 1 ? (
              <Trans
                i18nKey={`${intlKey}.SureToRemoveSingle`}
                values={{
                  refNumber: selectedRows[0]?.row?.referenceNumber,
                  operationName: selectedRows[0]?.row?.operationName,
                }}
              />
            ) : (
              <Trans i18nKey={`${intlKey}.SureToRemoveMulti`} count={selectedSalesOrderIds?.length} />
            )}
          </Text>
        }
        isOpen={isDialogOpen}
        onApprove={() => {
          dispatch(
            gridActions.gridFiltersSubmitted(
              GridType.ManualPicklists,
              appliedFilters.filter(filter => filter.property !== 'id'),
              []
            )
          );
          setSelectedSalesOrderIds([]);
          setSelectedIndexes([]);
          setSelectedRows([]);
          setIsPreviewButtonActive(false);
          setIsDialogOpen(false);
        }}
        onCancel={() => setIsDialogOpen(false)}
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
      <PreviewModal />
    </>
  );
};

export default ManualPicklists;
