import { FormatterProps } from '@oplog/data-grid';
import { Box } from '@oplog/express';
import * as React from 'react';
import { SalesOrderPackingState } from '../../services/swagger';

export function salesOrderStatusBadgeFormatter<T>(t, props: FormatterProps) {
  const { value } = props;
  if (
    value === SalesOrderPackingState.Completed
  ) {
    return (
      <Box
        height={24}
        width="fit-content"
        backgroundColor="#EAF9F5"
        borderRadius="4px"
        border="xs"
        borderColor="#279E6E"
        p={4}
        color="#279E6E"
        fontSize={12}
        fontWeight="bold"
      >
        {t('TouchScreen.SingleItemPackingStation.SingleItemPackingToteGrid.Packaged')}
      </Box>
    );
  }
  return '-';
}
