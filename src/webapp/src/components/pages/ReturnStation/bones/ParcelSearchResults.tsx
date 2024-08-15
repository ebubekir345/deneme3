import React from 'react';
import { Box, Button, Flex, Image } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import iff from '../../../../utils/iff';
import useReturnStore from '../../../../store/global/returnStore';
import FilteredOrder from './FilteredOrder';

const intlKey = 'TouchScreen';

const ParcelSearchResults: React.FC = () => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();

  const isSearchQueryEmpty = !Object.keys(returnState.searchQueries).filter(
    key => returnState.searchQueries[key].length
  )?.length;
  const isParcelInfoFilled = Object.keys(returnState.parcelInfo).every(key => {
    if (key === 'cargoCarrier' && returnState.parcelInfo[key] === "") {
      return false;
    }
    return returnState.parcelInfo[key].length !== 0;
  });
  return (
    <>
      <Flex
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={!returnState.filteredOrders.length ? 'xs' : 'none'}
        borderColor="palette.snow_darker"
        pb={!returnState.filteredOrders.length ? 16 : 0}
      >
        <Box fontSize="22" fontWeight={700} letterSpacing="negativeLarge" color="palette.hardBlue_darker" mr={8}>
          {t(`${intlKey}.ReturnStation.SearchResults.Title`)}
        </Box>
        <Button
          onClick={() => {
            returnAction.setIsUndefinedReturnInputScreenOpen(true);
          }}
          _disabled={{ bg: "palette.slate_light" }}
          disabled={!isParcelInfoFilled}
          borderRadius="sm"
          backgroundColor="palette.red_dark"
          padding="8px 18px"
          border="0"
          outline="none !important"
          size="small"
          color="palette.white"
          fontSize={16}
          height={36}
          letterSpacing="negativeLarge"
          fontWeight={500}
          fontFamily="ModernEra"
          contentProps={{ padding: 0 }}
          _hover={{
            backgroundColor: 'palette.red_darker',
          }}
        >
          {t(`${intlKey}.ReturnStation.SearchResults.UndefinedReturn`)}
        </Button>
      </Flex>
      {isSearchQueryEmpty ? (
        <Flex
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
          fontSize="16"
          letterSpacing="negativeLarge"
          color="palette.snow_darker"
          flexDirection="column"
        >
          <Box letterSpacing={"small"} fontWeight={700} mb={8} data-cy="no-search-query">
            {t(`${intlKey}.ReturnStation.SearchResults.NoQuery`)}
          </Box>
          <Box letterSpacing={"small"} fontWeight={500} color="palette.snow_darker">{t(`${intlKey}.ReturnStation.SearchResults.SearchWithOptions`)}</Box>
        </Flex>
      ) : (
        iff(
          returnState.filteredOrders.length,
          <Box flex="1 1 auto" overflowY="auto" height="0px" mt={16}>
            {returnState.filteredOrders.map(order => (
              <FilteredOrder key={order.id} order={order} />
            ))}
          </Box>,
          <Flex
            flexGrow={1}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            fontSize="16"
            fontWeight={500}
            letterSpacing="negativeLarge"
            color="palette.snow_darker"
          >
            <Image src="/images/search-not-found.png" width="300px" height="200px" />
            <Box mt={12} data-cy="no-result">
              {t(`${intlKey}.ReturnStation.SearchResults.NoResult`)}
            </Box>
          </Flex>
        )
      )}
    </>
  );
};

export default ParcelSearchResults;
