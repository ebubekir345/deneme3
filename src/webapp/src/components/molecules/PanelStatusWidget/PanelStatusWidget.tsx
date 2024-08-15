import { Box, Flex, Icon } from '@oplog/express';
import React from 'react';

interface IPanelStatusWidget {
  statusItems: {
    title: string;
    count: number | string;
    iconName?: string;
    iconColor?: string;
    iconBg?: string;
    textColor?: string;
  }[];
}

const PanelStatusWidget: React.FC<IPanelStatusWidget> = ({ statusItems }) => {
  return (
    <Flex flexDirection="column" justifyContent="flex-start" flexWrap="wrap">
      {statusItems.map((item, i) => (
        <Flex key={i.toString()} paddingY="10px">
          {item.iconName && (
            <Flex
              width={44}
              height={44}
              borderRadius="full"
              justifyContent="center"
              alignItems="center"
              bg={item.iconBg}
              flexShrink={0}
            >
              <Icon name={item.iconName} fontSize="20px" color={item.iconColor} />
            </Flex>
          )}
          <Flex flexDirection="column" justifyContent="center" ml={12}>
            <Box fontWeight="bold" color="palette.grey_lighter">
              {item.title}
            </Box>
            <Box
              mt={6}
              fontFamily="Montserrat"
              fontSize={16}
              fontWeight={800}
              color={item.textColor ? item.textColor : 'palette.grey_dark'}
            >
              {item.textColor == 'palette.green' ? '+' : ''}
              {item.count}
            </Box>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default PanelStatusWidget;
