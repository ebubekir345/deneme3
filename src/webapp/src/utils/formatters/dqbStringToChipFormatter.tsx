import { FormatterProps } from '@oplog/data-grid';
import { Box, formatUtcToLocal, Flex, isDate, Text } from '@oplog/express';
import * as React from 'react';

function buildFilterSymbols(propertyName: string, filterOperation: string, propertyValue: string) {
  // eslint-disable-next-line no-param-reassign
  propertyName = propertyName?.charAt(0).toUpperCase() + propertyName?.slice(1);
  switch (filterOperation) {
    case 'Equals':
      return [propertyName, '=', propertyValue].join(' ');
    case 'NotEqual':
      return [propertyName, '≠', propertyValue].join(' ');
    case 'LessThan':
      return [propertyName, '<', propertyValue].join(' ');
    case 'LessThanOrEqual':
      return [propertyName, '≤', propertyValue].join(' ');
    case 'GreaterThan':
      return [propertyName, '>', propertyValue].join(' ');
    case 'GreaterThanOrEqual':
      return [propertyName, '≥', propertyValue].join(' ');
    case 'Contains':
      return [propertyName, '=', `[*..${propertyValue}..*]`].join(' ');
    case 'In':
      return [propertyName, '=', `[${propertyValue}]`].join(' ');
    case 'StartsWith':
      return [propertyName, '=', `[${propertyValue}..*]`].join(' ');
    case 'EndsWith':
      return [propertyName, '=', `[*..${propertyValue}]`].join(' ');
    default:
      return [propertyName, filterOperation, propertyValue].join(' ');
  }
}

export const dqbStringToChipFormatter = (props: FormatterProps) => {
  const t = props.dependentValues;
  const filters: string[] = [];

  let filterOperation: string | undefined;
  let propertyName: string | undefined;
  let propertyValue: string | undefined;

  props.value.split('&').forEach((parameterAndValue: string) => {
    if (!parameterAndValue.search('o=')) {
      const filterOperationArray = parameterAndValue.split('=');
      filterOperation = filterOperationArray[1];
    }

    if (!parameterAndValue.search('p=')) {
      const propertyNameArray = parameterAndValue.split('=');
      propertyName = propertyNameArray[1];
    }

    if (!parameterAndValue.search('v=')) {
      const propertyValueArray = parameterAndValue.split('=');
      propertyValue = propertyValueArray[1];
    }

    if (propertyName && filterOperation && propertyValue) {
      if (isDate(propertyValue)) {
        propertyValue = formatUtcToLocal(new Date(propertyValue));
      }

      filters.push(buildFilterSymbols(t(`Property.${propertyName}`), filterOperation, propertyValue));

      propertyName = undefined;
      filterOperation = undefined;
      propertyValue = undefined;
    }
  });

  const badges: React.ReactFragment[] = [];
  filters.forEach(filter => {
    badges.push(
      <Box width="auto" backgroundColor="palette.snow_light" textAlign="center" borderRadius="16px" mr="6">
        <Text color="palette.grey_dark" py="4" fontSize="11" lineHeight="normal" px="11">
          {filter}
        </Text>
      </Box>
    );
  });

  return <Flex width="auto">{badges}</Flex>;
};
