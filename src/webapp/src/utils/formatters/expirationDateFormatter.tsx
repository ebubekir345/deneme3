import { FormatterProps } from '@oplog/data-grid';
import { Badge, Box, Text } from '@oplog/express';
import moment from 'moment';
import * as React from 'react';

export function expirationDateFormatter(props: FormatterProps) {
  let expirationDate = props.value;
  let formattedDate = moment(expirationDate).format('DD-MM-YYYY');

  if (props.value !== "N/A") {
    return (
      <Box width={1}>
        {moment(expirationDate).isAfter(moment(new Date())) ? (
          <Text>{formattedDate}</Text>
        ) : (
          <Badge
            badgeColor="palette.white"
            outlined={false}
            fontFamily="heading"
            fontWeight={500}
            height={18}
            fontSize={10}
            py={2}
            px={6}
            textTransform="none"
            variant="danger"
          >
            {formattedDate}
          </Badge>
        )}
      </Box>
    );
  }

  return <Box ml={64}>-</Box>;
}
