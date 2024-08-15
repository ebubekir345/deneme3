import { FormatterProps } from '@oplog/data-grid';
import { Box, Flex, Text, Ellipsis } from '@oplog/express';
import * as React from 'react';

export interface ChipFormatterProps {
  chipBackgroundColor?: string;
  chipShadow?: string;
  textColor?: string;
  imageSize?: string;
  imageFolder?: string;
  imageBorderRadius?: number | string;
  imageShadow?: string;
  text?: string;
  imageUrl?: string;
  list?: Array<any>;
  textPropertyOfListItem?: string;
  imageUrlPropertyOfListItem?: string;
  isUpperCase?: boolean;
}

export const chipFormatter = (props: FormatterProps) => {
  const {
    chipBackgroundColor,
    chipShadow,
    textColor,
    imageSize,
    imageBorderRadius,
    imageShadow,
    text,
    imageUrl,
    list,
    imageFolder,
    imageUrlPropertyOfListItem,
    isUpperCase,
  } = props.dependentValues;

  if (list) {
    const badges: React.ReactFragment[] = [];
    if (list instanceof Array && list.length === 0) {
      return <Ellipsis>N/A</Ellipsis>;
    }

    list.forEach(item => {
      badges.push(
        <Box
          width="auto"
          backgroundColor={chipBackgroundColor}
          textAlign="center"
          boxShadow={chipShadow || ''}
          borderRadius="16px"
          mr="8"
        >
          <Flex width="auto" flexDirection="row" alignItems="center" px="11">
            <Box
              minWidth={imageSize}
              minHeight={imageSize}
              maxHeight={imageSize}
              maxWidth={imageSize}
              backgroundImage={`url('${item[imageUrlPropertyOfListItem]}')`}
              backgroundSize="cover"
              backgroundPosition="center"
              borderRadius={imageBorderRadius as number}
              boxShadow={imageShadow}
              my="4"
              mr="4"
            />
            <Text color={textColor} py="4" fontSize="11" fontWeight={600} lineHeight="normal">
              {isUpperCase ? item.name.toString().toUpperCase() : item.name}
            </Text>
          </Flex>
        </Box>
      );
    });
    return <Flex width="auto">{badges}</Flex>;
  }
  if (text || imageUrl) {
    return (
      <Flex width="auto" p="6">
        <Box
          width="auto"
          backgroundColor={chipBackgroundColor}
          textAlign="center"
          boxShadow={chipShadow || ''}
          borderRadius="16px"
          mr="8"
        >
          <Flex width="auto" flexDirection="row" alignItems="center" px="11">
            <Box
              minWidth={imageSize}
              minHeight={imageSize}
              maxHeight={imageSize}
              maxWidth={imageSize}
              backgroundImage={`url('${imageUrl}');`}
              backgroundSize="cover"
              backgroundPosition="center"
              borderRadius={imageBorderRadius as number}
              boxShadow={imageShadow || ''}
              my="4"
              mr="4"
            />
            <Text color={textColor} py="4" fontSize="11" fontWeight={600} lineHeight="normal">
              {isUpperCase ? text?.toString().toUpperCase() : text}
            </Text>
          </Flex>
        </Box>
      </Flex>
    );
  }
  return <Ellipsis>N/A</Ellipsis>;
};
