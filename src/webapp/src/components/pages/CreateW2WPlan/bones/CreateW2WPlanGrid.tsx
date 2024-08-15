import { DataGridRow, FormatterProps, gridSelectors } from '@oplog/data-grid';
import { Box, Button, Dialog, DialogTypes, Flex, Icon, Image, Text } from '@oplog/express';
import { ArrayFilterOperation, SortDirection, SortField } from 'dynamic-query-builder-client';
import React, { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { StockCellStatusOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import {
  chipFormatter,
  ChipFormatterProps,
  geti18nName,
  InventoryCellLinkFormatter,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'CreateW2WPlan.CreateW2WPlanGrid';
const titleKey = 'CreateW2WPlan.CreateW2WPlanGrid.Title';

const createW2WPlanGridInitialSort: SortField = new SortField({
  property: 'address',
  by: SortDirection.ASC,
});

interface ICreateW2WPlanGrid {
  selectedCellIds: string[];
  setSelectedCellIds: Function;
  stockCountingPlanId: string;
}

const CreateW2WPlanGrid: FC<ICreateW2WPlanGrid> = ({ selectedCellIds, setSelectedCellIds, stockCountingPlanId }) => {
  const { t } = useTranslation();
  const [selectedIndexes, setSelectedIndexes] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.WallToWallStockCountingTasksQueryCells, state.grid)
  );

  const createW2WPlanGridColumns: Array<any> = [
    {
      name: geti18nName('AddressLabel', t, intlKey),
      key: 'address',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ZoneLabel', t, intlKey),
      key: 'currentStockZone',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Section', t, intlKey),
      key: 'section',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Side', t, intlKey),
      key: 'side',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Level', t, intlKey),
      key: 'level',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Cell', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: InventoryCellLinkFormatter,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('Operations', t, intlKey),
      key: 'operations',
      type: 'string',
      filterable: true,
      fieldType: 'array',
      searchField: 'name',
      outerOp: ArrayFilterOperation.Any,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => (props.value === 'N/A' ? '-' : chipFormatter(props)),
      getRowMetaData: (row: StockCellStatusOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          list: row.operations?.map(operation => ({ name: operation.name, imageUrl: operation.imageUrl })),
          imageUrlPropertyOfListItem: 'imageUrl',
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
    {
      name: geti18nName('ProductVariety', t, intlKey),
      key: 'productVariety',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
  ];

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
    setSelectedRows(selectedRows.concat(rows));
    setSelectedCellIds(selectedCellIds.concat(rows.map(row => row.row.cellId)));
  };

  const onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    setSelectedRows(
      selectedRows.filter((_, index) => index !== selectedIndexes.findIndex(i => rowIndexes.indexOf(i) !== -1))
    );
    setSelectedIndexes(selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1));
    setSelectedCellIds(selectedCellIds.filter(id => !rows.some(row => row.row.cellId === id)));
  };

  useEffect(() => {
    setSelectedIndexes(
      gridRawData
        ?.map((data, index) => (selectedCellIds.indexOf(data['cellId']) !== -1 ? index : null))
        .filter(index => index !== null)
    );
    setSelectedRows(gridRawData?.filter(data => selectedCellIds.indexOf(data['cellId']) !== -1));
  }, [gridRawData]);

  return (
    <>
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.WallToWallStockCountingTasksQueryCells}
        columns={createW2WPlanGridColumns}
        apiArgs={[stockCountingPlanId]}
        predefinedFilters={[]}
        sortField={createW2WPlanGridInitialSort}
        noRowsView={() => (
          <Flex flexDirection="column" alignItems="center">
            <Image width={471} height={351} src="/images/create-cargo-plan.png" alt="create-cargo-plan" />
            <Text color="#4A4A4A" fontWeight={600} fontSize={12} mt={32}>
              {t(`${intlKey}.EmptyFilterMessage`)}
            </Text>
          </Flex>
        )}
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
              <Flex alignItems="center" fontSize={13} color="palette.black" ml={22}>
                <Box fontWeight={900}>{selectedCellIds.length}</Box>&nbsp;&nbsp;
                <Box>{t(`${intlKey}.SelectedAddresses`)}</Box>
              </Flex>
              <Button
                ml={16}
                variant="danger"
                fontWeight={700}
                disabled={!selectedCellIds.length}
                onClick={() => setIsDialogOpen(true)}
                outline="none !important"
              >
                <Icon name="fas fa-trash-alt" mr={16} />
                {t(`${intlKey}.Clear`)}
              </Button>
            </Flex>
          </Flex>
        }
      />
      <Dialog
        message={
          <Text fontWeight={500} lineHeight="small" color="palette.black">
            {selectedCellIds.length === 1 ? (
              <Trans
                i18nKey={`${intlKey}.SureToRemoveSingle`}
                values={{
                  address: selectedRows[0]?.row?.address,
                }}
              />
            ) : (
              <Trans i18nKey={`${intlKey}.SureToRemoveMulti`} count={selectedCellIds?.length} />
            )}
          </Text>
        }
        isOpen={isDialogOpen}
        onApprove={() => {
          setSelectedCellIds([]);
          setSelectedIndexes([]);
          setSelectedRows([]);
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
    </>
  );
};

export default CreateW2WPlanGrid;
