import { FormatterProps } from '@oplog/data-grid';
import { Flex, Text } from '@oplog/express';
import * as React from 'react';
import { DeliveryTypeColors } from '../../components/pages/PickingManagement/bones/PickingManagementWaitingOrdersGrid';
import { enumFormatter } from './enumFormatter';

export function coloredBadgeFormatter<T>(props: FormatterProps, enumObject: {}) {
  const { value } = props;
  if (props) {
    return (
      <Flex
        height={25}
        maxWidth="153px"
        backgroundColor={enumObject[value]}
        textAlign="center"
        borderRadius="16px"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          color="palette.white"
          py="4"
          fontSize="11"
          fontWeight="bold"
          textTransform={enumObject !== DeliveryTypeColors && 'uppercase' as any}
        >
          {enumFormatter(props)}
        </Text>
      </Flex>
    );
  }
  return <></>;
}
