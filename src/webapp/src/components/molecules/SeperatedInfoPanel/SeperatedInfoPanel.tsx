import { Box, Ellipsis, Flex, Icon, Panel, PanelProps, Text } from '@oplog/express';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';

export interface SeperatedInfoPanelDivision {
  icon: string;
  fields: SeperatedInfoPanelField[];
}

export interface SeperatedInfoPanelField {
  title: string;
  value: JSX.Element | string;
}

export interface ISeperatedInfoPanel {
  panelProps: PanelProps;
  divisions: SeperatedInfoPanelDivision[];
  column?: number;
  isLoading?: boolean;
  loadingItems?: number;
}

const SeperatedInfoPanel: React.FC<ISeperatedInfoPanel> = ({
  panelProps,
  column = 2,
  divisions,
  isLoading = false,
  loadingItems,
}) => {
  const width = 1 / column;

  return (
    <>
      <Panel bg="white" isRaised {...panelProps}>
        <Flex flexWrap="wrap" p="30" pb="0">
          {isLoading &&
            new Array(loadingItems || column).fill('').map((data, index: number) => (
              <Box minWidth="fit-content" key={index.toString()} width={width} pb="30" pr="30">
                <Skeleton />
                <Skeleton width="50%" />
              </Box>
            ))}
          {!isLoading &&
            divisions.map(({ icon, fields }: SeperatedInfoPanelDivision, divisionIndex: number) => {
              return (
                <Flex key={divisionIndex.toString()} width={1}>
                  <Icon name={icon} mr="30" color="palette.grey_lighter" fontSize="26" />
                  <Flex flexDirection="column" width={1}>
                    <Flex flexWrap="wrap">
                      {fields.map(({ title, value }: SeperatedInfoPanelField, fieldIndex: number) => {
                        return (
                          <Flex flexDirection="column" width={width} pb="30" pr={30} key={fieldIndex.toString()}>
                            <Text
                              fontFamily="base"
                              fontSize="11"
                              fontWeight={700}
                              color="palette.grey_light"
                              pb={fieldIndex === fields.length ? '0' : '6'}
                              textTransform="uppercase"
                            >
                              {title}
                            </Text>
                            <Text
                              fontFamily="heading"
                              fontSize="16"
                              color="text.body"
                              fontWeight={800}
                              lineHeight="xxlarge"
                              width={1}
                            >
                              <Ellipsis>{value}</Ellipsis>
                            </Text>
                          </Flex>
                        );
                      })}
                    </Flex>
                    {divisionIndex !== divisions.length - 1 && (
                      <Box height={1} width={1} bg="palette.grey_lighter" mb="30" />
                    )}
                  </Flex>
                </Flex>
              );
            })}
        </Flex>
      </Panel>
    </>
  );
};

export default SeperatedInfoPanel;
