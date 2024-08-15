import React, { ReactElement } from 'react';
import { Box, Flex, Image, PseudoBox, Heading, formatUtcToLocal, Popover, duration, Text } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { urls } from '../../../../routers/urls';
import i18n from '../../../../i18n';
import { tr, enUS } from 'date-fns/locale';

interface ReturnPackageItemProps {
  item: any;
  state: string;
}

const intlKey = 'ReturnManagement';

const ReturnPackageItem: React.FC<ReturnPackageItemProps> = ({ item, state }): ReactElement => {
  const { t } = useTranslation();
  const contextToStateDateMap = () => {
    switch (state) {
      case 'arrived':
        return item.createdAt;
      case 'inProcess':
        return item.matchedAt ? item.matchedAt : item.createdAt;
      case 'resolved':
        return item.resolvedAt ? item.resolvedAt : item.createdAt;
      case 'undefined':
        return item.markedAsUndefinedAt ? item.markedAsUndefinedAt : item.createdAt;
      default:
        return 0;
    }
  };

  const handleIntl = () => {
    switch (i18n.language) {
      case 'tr':
        return tr;
      case 'en-US':
        return enUS;
      default:
        return tr;
    }
  } 

  return (
    <PseudoBox as={Link} to={urls.returnDetails.replace(':id', item.id)} _hover={{ textDecoration: 'none' }}>
      <Popover
        action={['hover', 'focus']}
        content={<PseudoBox>{t(`${intlKey}.Grid.${state}`)}</PseudoBox>}
        contentProps={{
          bg: state === 'undefined' ? 'palette.red' : 'palette.green',
          color: 'palette.white',
          borderRadius: 'sm',
          padding: '8px 11px',
          boxShadow: 'medium',
          fontSize: '10',
          lineHeight: 'xxLarge',
        }}
        withArrow
        placement="bottom-end"
      >
        <PseudoBox
          boxShadow="0 8px 14px 0 rgba(216, 221, 230, 0.5)"
          borderRadius="sm"
          border="xs"
          borderColor="palette.snow_light"
          borderLeft="4px solid"
          borderLeftColor={state === 'undefined' ? 'palette.red' : 'palette.green'}
          minHeight="81px"
          mb="16px"
          p="11"
          _hover={{ boxShadow: '0 20px 34px 0 rgba(0, 0, 0, 0.2);' }}
          transition="0.2s ease all"
          cursor="pointer"
        >
          <Flex justifyContent="space-between">
            <Box>
              <Heading
                color="palette.grey"
                fontFamily="heading"
                fontSize="12"
                lineHeight="large"
                letterSpacing="negativeSmall"
                fontWeight={600}
              >
                #{item.referenceNumber}
              </Heading>
              <Text fontFamily="heading" fontSize="12" color="palette.grey_lighter">
                {formatUtcToLocal(item.createdAt)}
              </Text>
            </Box>
            {item.operation && (
              <Box width="32px" height="32px" bg="transparent">
                <Image src={item.operation.imageUrl} />
              </Box>
            )}
          </Flex>
          {contextToStateDateMap() && (
            <Text mt="11" fontFamily="heading" fontSize="12" color="palette.grey_lighter" display="block">
              {duration(new Date(contextToStateDateMap()), new Date(Date.now()), handleIntl())}
            </Text>
          )}
        </PseudoBox>
      </Popover>
    </PseudoBox>
  );
};

export default ReturnPackageItem;
