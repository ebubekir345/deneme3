import { FormatterProps } from '@oplog/data-grid';
import { Box } from '@oplog/express';
import * as React from 'react';

enum backgroundColors {
  None = 'palette.softBlue_lighter',
  Created = 'palette.softBlue_lighter',
  InProgress = 'palette.orange_lighter',
  Completed = 'palette.green_lighter',
}

enum borderColors {
  None = 'palette.softBlue',
  Created = 'palette.softBlue',
  InProgress = 'palette.orange_darker',
  Completed = 'palette.hardGreen',
}

export function waybillStatusBadgeFormatter<T>(t, props: FormatterProps) {
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
