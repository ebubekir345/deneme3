import { DataGridRow, FormatterProps, gridSelectors } from '@oplog/data-grid';
import { Box, Button, Flex, Icon, Text } from '@oplog/express';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { StockCountingProcessState } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { coloredBadgeFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'TrackW2WPlan.CreateCountingForIncorrectAddressesModal.AddressesGrid';
const titleKey = 'TrackW2WPlan.CreateCountingForIncorrectAddressesModal.AddressesGrid.Title';

enum StockCountingProcessStateColors {
  Counted = 'palette.yellow',
  Completed = 'palette.hardGreen',
  Created = 'palette.grey',
  InProgress = 'palette.softBlue',
}

interface IAddressesGrid {
  stockCountingPlanId: string;
  selectedCellIds: number[];
  setSelectedCellIds: Function;
}

const AddressesGrid: FC<IAddressesGrid> = ({ stockCountingPlanId, selectedCellIds, setSelectedCellIds }) => {
  const { t } = useTranslation();
  const [selectedIndexes, setSelectedIndexes] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [_, setIsDialogOpen] = useState<boolean>(false);
  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.GetCellsForControlCount, state.grid)
  );

  const input = document.querySelector('.addresses-grid input[type="checkbox"][name="select-all-checkbox"]');
  const label = document.querySelector('.addresses-grid label[for="select-all-checkbox"]');
  if (input && label) {
    input.id = 'select-all-checkbox2';
    label.setAttribute('for', 'select-all-checkbox2');
  }

  const addressesGridColumns: Array<any> = [
    {
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <Text
            onClick={() => {
              window.open(urls.inventoryCellDetails.replace(':cellLabel', value), '_blank');
            }}
            color="text.link"
            width={1}
            _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {value}
          </Text>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingProcessState),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, StockCountingProcessStateColors),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('FinalCountResult', t, intlKey),
      key: 'afterCountingAmount',
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
    <Box overflowY="auto" overflowX="hidden" maxHeight="40vh" id="order-item-list" className="addresses-grid">
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.GetCellsForControlCount}
        columns={addressesGridColumns}
        apiArgs={[stockCountingPlanId]}
        predefinedFilters={[]}
        rowSelection={{
          onRowsSelected: onRowsSelected,
          onRowsDeselected: onRowsDeselected,
          selectBy: {
            indexes: selectedIndexes,
          },
        }}
        headerContent={
          <Flex alignItems="center" justifyContent="space-between" bg="palette.snow_lighter">
            <Flex alignItems="center" fontSize={13} color="palette.black" ml={22}>
              <Box fontWeight={900}>{selectedCellIds.length}</Box>&nbsp;&nbsp;
              <Box>{t(`${intlKey}.SelectedCells`)}</Box>
            </Flex>
            <Button
              ml={16}
              variant="danger"
              fontWeight={700}
              disabled={!selectedCellIds.length}
              onClick={() => {
                setSelectedCellIds([]);
                setSelectedIndexes([]);
                setSelectedRows([]);
                setIsDialogOpen(false);
              }}
              outline="none !important"
            >
              <Icon name="fas fa-trash-alt" mr={16} />
              {t(`TrackW2WPlan.CreateCountingForIncorrectAddressesModal.Clear`)}
            </Button>
          </Flex>
        }
        gridCss={`
              .react-grid-Container .react-grid-Main .react-grid-Grid {
                min-height: 500px !important;
              }
              .react-grid-Header {
                top: 0px !important;
              }
            `}
      />
    </Box>
  );
};

export default AddressesGrid;
