import { Box, Flex, Icon, Text } from '@oplog/express';
import { SortDirection } from 'dynamic-query-builder-client';
import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import useIntersect from '../../../utils/useIntersect';
import Grid from '../../atoms/Grid';

interface IGridTableColumn {
  key: string;
  title: string;
  sortable: boolean;
}

export interface ISort {
  key: string;
  direction: SortDirection;
}

interface IGridTable {
  columns: IGridTableColumn[];
  rows: JSX.Element[][];
  activeSort: ISort;
  onSort: (activeSort: ISort) => void;
  loadMore?: () => void;
  isBusy?: boolean;
}

const GridTable: React.FC<IGridTable> = ({ columns, rows, activeSort, onSort, loadMore, isBusy }) => {
  const [ref, entry] = useIntersect({});
  const isVisible = entry && entry.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      loadMore && loadMore();
    }
  }, [isVisible]);

  const sortIconName = (key: string) => {
    if (key === activeSort.key) {
      return activeSort.direction === SortDirection.ASC ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  };

  const handleSort = (key: string) => {
    if (key === activeSort.key) {
      onSort({
        ...activeSort,
        direction: activeSort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC,
      });
    } else {
      onSort({ key, direction: SortDirection.ASC });
    }
  };

  return (
    <Grid width={1} overflow="auto" gridTemplateColumns={`repeat(${columns.length}, auto)`} pr={10}>
      {columns.map(column => (
        <Flex
          key={column.key}
          top={0}
          position="sticky"
          height={32}
          color="palette.softBlue_light"
          bg="palette.softGrey"
          justifyContent="center"
          alignItems="center"
          fontSize={12}
          cursor="pointer"
          onClick={() => column.sortable && handleSort(column.key)}
        >
          {column.sortable && <Icon name={sortIconName(column.key)} mr={8} />}
          <Text fontWeight={500} letterSpacing="negativeLarge">
            {column.title}
          </Text>
        </Flex>
      ))}
      {rows.reduce(
        (res, row, line, rowsArray) => [
          ...res,
          <React.Fragment key={line.toString()}>
            {...row.map((cell, i, arr) => (
              <Box
                key={`${line.toString()}-${i.toString()}`}
                ref={line === rowsArray.length - 1 && i === arr.length - 1 ? ref : undefined}
                height={62}
                my={4}
                py={10}
                bg="palette.white"
                borderTopLeftRadius={i === 0 ? 'lg' : 'none'}
                borderBottomLeftRadius={i === 0 ? 'lg' : 'none'}
                borderTopRightRadius={i === arr.length - 1 ? 'lg' : 'none'}
                borderBottomRightRadius={i === arr.length - 1 ? 'lg' : 'none'}
                letterSpacing="negativeLarge"
              >
                <Box height="100%" px={16} borderLeft={i !== 0 ? 'xs' : 'none'} color="palette.hardBlue_darker" borderColor="palette.softGrey">
                  {cell}
                </Box>
              </Box>
            ))}
            {Array(1).fill(
              columns.map(
                (column, i) =>
                  !isBusy && line === rowsArray.length - 1 && <Box key={i.toString()} height={66} marginBottom={4} />
              )
            )}
          </React.Fragment>,
        ],
        []
      )}
      {isBusy &&
        Array(1).fill(
          columns.map((column, i) => <Skeleton key={i.toString()} height={62} style={{ marginBottom: 4 }} />)
        )}
    </Grid>
  );
};

export default GridTable;
