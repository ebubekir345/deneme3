import { Box, Flex, Icon, PseudoBox, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { ProductDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';

const intlKey = 'ProductDetails.ActionBar.Content';

export const ActionBarContent: React.FC = () => {
  const { t } = useTranslation();
  const productDetailsResource: Resource<ProductDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetProduct]
  );

  return (
    <>
      <Flex mt={20}>
        <PseudoBox
          onClick={() => window.open(`https://search.oplog.app/?q=${productDetailsResource?.data?.sku}&size=n_60_n&sort-field=createdat&sort-direction=desc`, '_blank')}
          color="text.link"
          _hover={{ cursor: 'pointer' }}
          pr={16}
        >
          <PseudoBox _hover={{ textDecoration: 'underline' }} display="inline" pr={6}>
            {t('SideBar.ActionHistory')}
          </PseudoBox>
          <Icon name="far fa-external-link"></Icon>
        </PseudoBox>
        {productDetailsResource?.data?.isHeavy && (
          <Box color="palette.grey" pl={16} pr={16} borderLeft="xs" borderColor="palette.grey">
            <Icon name="fal fa-dolly-flatbed" />
            <Text ml={8}>{t(`${intlKey}.Heavy`)}</Text>
          </Box>
        )}
        {productDetailsResource?.data?.isOversize && (
          <Box color="palette.grey" pl={16} pr={16} borderLeft="xs" borderColor="palette.grey">
            <Icon name="fal fa-box-up" />
            <Text ml={8}>{t(`${intlKey}.Oversize`)}</Text>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default ActionBarContent;
