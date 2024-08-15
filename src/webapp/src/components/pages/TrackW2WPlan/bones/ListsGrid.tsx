import { gridSelectors } from '@oplog/data-grid';
import { Box, Button, Flex, Icon } from '@oplog/express';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GridType } from '../../../../models';
import { WallToWallStockCountingListIndex } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'TrackW2WPlan.CreateCountingForIncorrectAddressesModal.ListsGrid';
const titleKey = 'TrackW2WPlan.CreateCountingForIncorrectAddressesModal.ListsGrid.Title';

interface IListsGrid {
  stockCountingPlanId: string;
  selectedListIds: string[];
  setSelectedListIds: Function;
}

const ListsGrid: FC<IListsGrid> = ({ stockCountingPlanId, selectedListIds, setSelectedListIds }) => {
  const { t } = useTranslation();
  const [selectedIndexes, setSelectedIndexes] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [_, setIsDialogOpen] = useState<boolean>(false);
  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.GetListsWithIncorrectCountedCells, state.grid)
  );

  const listsGridColumns: Array<any> = [
    {
      name: geti18nName('List', t, intlKey),
      key: 'stockCountingListName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Operator', t, intlKey),
      key: 'operator',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('IncorrectCountedCellCount', t, intlKey),
      key: 'incorrectCountedCellCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('RankOfCountingToBeCreated', t, intlKey),
      key: 'nextCountIndex',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, WallToWallStockCountingListIndex),
      formatter: props => enumFormatter(props),
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  const onRowsSelected = rows => {
    setSelectedIndexes(selectedIndexes.concat(rows.map(r => r.rowIdx)));
    setSelectedRows(selectedRows.concat(rows));
    setSelectedListIds(selectedListIds.concat(rows.map(row => row.row.stockCountingListId)));
  };

  const onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    setSelectedRows(
      selectedRows.filter((_, index) => index !== selectedIndexes.findIndex(i => rowIndexes.indexOf(i) !== -1))
    );
    setSelectedIndexes(selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1));
    setSelectedListIds(selectedListIds.filter(id => !rows.some(row => row.row.stockCountingListId === id)));
  };

  useEffect(() => {
    setSelectedIndexes(
      gridRawData
        ?.map((data, index) => (selectedListIds.indexOf(data['stockCountingListId']) !== -1 ? index : null))
        .filter(index => index !== null)
    );
    setSelectedRows(gridRawData?.filter(data => selectedListIds.indexOf(data['stockCountingListId']) !== -1));
  }, [gridRawData]);

  return (
    <Box overflowY="auto" overflowX="hidden" maxHeight="40vh" id="order-item-list">
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.GetListsWithIncorrectCountedCells}
        columns={listsGridColumns}
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
              <Box fontWeight={900}>{selectedListIds.length}</Box>&nbsp;&nbsp;
              <Box>{t(`${intlKey}.SelectedLists`)}</Box>
            </Flex>
            <Button
              ml={16}
              variant="danger"
              fontWeight={700}
              disabled={!selectedListIds.length}
              onClick={() => {
                setSelectedListIds([]);
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

export default ListsGrid;
