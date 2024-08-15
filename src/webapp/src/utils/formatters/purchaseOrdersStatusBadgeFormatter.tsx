import { FormatterProps } from '@oplog/data-grid';
import { Box } from '@oplog/express';
import * as React from 'react';

enum backgroundColors {
  None = 'palette.softBlue_lighter',
  AwaitingInventory = 'palette.softBlue_lighter',
  ReceivingOnHold = 'palette.softBlue_lighter',
  ReceivingCanBeStarted = 'palette.softBlue_lighter',
  ReceivingInProgress = 'palette.orange_lighter',
  ReceivingCompleted = 'palette.green_lighter',
}

enum borderColors {
  None = 'palette.softBlue',
  AwaitingInventory = 'palette.softBlue',
  ReceivingOnHold = 'palette.softBlue',
  ReceivingCanBeStarted = 'palette.softBlue',
  ReceivingInProgress = 'palette.orange_darker',
  ReceivingCompleted = 'palette.hardGreen',
}

export function purchaseOrdersStatusBadgeFormatter<T>(t, props: FormatterProps) {
  const { value } = props;
  if (props) {
    return (
      <Box
        height={24}
        width="fit-content"
        backgroundColor={backgroundColors[value]}
        borderRadius="4px"
        border="xs"
        borderColor={borderColors[value]}
        p={4}
        color={borderColors[value]}
        fontSize="10"
        fontWeight="bold"
      >
        {t(`Enum.${value}`)}
      </Box>
    );
  }
  return <></>;
}
