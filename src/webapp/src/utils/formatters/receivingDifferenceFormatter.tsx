import { FormatterProps } from '@oplog/data-grid';
import { Badge, Box, Text } from '@oplog/express';
import * as React from 'react';

export function receivingDifferenceFormatter(props: FormatterProps) {
  let difference = props.value;
  if (props.value !== "N/A") {
    return (
      <Box width={1}>
        {(difference === undefined || difference === 0) ? (
          <Text>{difference}</Text>
        ) : (
          <Badge
            badgeColor={"palette.white"}
            outlined={false}
            fontFamily="heading"
            fontWeight={500}
            height={18}
            fontSize={10}
            py={2}
            px={6}
            textTransform="none"
            variant={difference < 0 ? "danger" : "success"}
          >
            {difference > 0 ? '+' : ''}{difference}
          </Badge>
        )}
      </Box>
    );
  }

  return <Box ml={64}>-</Box>;
}
