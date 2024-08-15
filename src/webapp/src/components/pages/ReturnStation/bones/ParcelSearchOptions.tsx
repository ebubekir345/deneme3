import { Box, Flex, Icon, Image, Toggle } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { OperationOutputDTO, OperationQueryOutputDTO } from '../../../../services/swagger';
import useReturnStore, { ReturnModals } from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import iff from '../../../../utils/iff';
import { ActionButton } from '../../../atoms/TouchScreen';
import ParcelSearchInput from './ParcelSearchInput';

const intlKey = 'TouchScreen';

const ParcelSearchOptions: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [returnState, returnAction] = useReturnStore();
  const [isAllOrdersDisplayed, setIsAllOrdersDisplayed] = useState(false);
  const [isOperationDropdownOpen, setIsOperationDropdownOpen] = useState(false);
  const [operationList, setOperationList] = useState<OperationOutputDTO[] | undefined>([]);
  const [searchKey, setSearchKey] = useState('');
  const operations: Resource<OperationQueryOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetOperations]
  );
  const searchSalesOrdersResponse = useSelector((state: StoreState) =>
    state.resources.searchSalesOrders ? state.resources.searchSalesOrders : null
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetOperations));
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.SearchSalesOrders));
    };
  }, []);

  useEffect(() => {
    if (returnState.searchQueries.referenceNumber.length) {
      setSearchKey('');
    }
    const modifiedSearchQueries = {};
    let isQueryEmpty = true;
    Object.keys(returnState.searchQueries).forEach(key => {
      if (returnState.searchQueries[key].length) {
        if (key === 'barcodes') {
          modifiedSearchQueries[key] = returnState.searchQueries[key].map(barcode => barcode.trim()).join();
        } else {
          modifiedSearchQueries[key] = returnState.searchQueries[key].trim();
        }
        isQueryEmpty = false;
      } else {
        modifiedSearchQueries[key] = undefined;
      }
    });
    modifiedSearchQueries['trackingId'] = returnState.parcelInfo.trackingId.length
      ? returnState.parcelInfo.trackingId
      : undefined;
    modifiedSearchQueries['displayAll'] = returnState.searchQueries.displayAll;
    !isQueryEmpty &&
      dispatch(
        resourceActions.resourceRequested(ResourceType.SearchSalesOrders, {
          ...modifiedSearchQueries,
          trackingId: modifiedSearchQueries['serialNumber'],
          serialNumber: modifiedSearchQueries['trackingId'],
        })
      );
  }, [returnState.searchQueries]);

  useEffect(() => {
    if (searchSalesOrdersResponse?.isSuccess) {
      returnAction.setFilteredOrders(searchSalesOrdersResponse.data || []);
    }
    if (searchSalesOrdersResponse?.error) {
      returnAction.toggleModalState(ReturnModals.GenericError, true);
    }
  }, [searchSalesOrdersResponse]);

  useEffect(() => {
    if (operations) {
      setOperationList(operations.data);
    }
  }, [operations]);

  useEffect(() => {
    returnAction.setSearchQueries({ ...returnState.searchQueries, displayAll: isAllOrdersDisplayed });
  }, [isAllOrdersDisplayed]);

  useEffect(() => {
    if (searchKey === 'referenceNumber') {
      returnAction.setIsReferenceNumberActive(true);
    } else {
      returnAction.setIsReferenceNumberActive(false);
    }
  }, [searchKey]);

  const handleOnClick = (key: string) => {
    if (key === 'operationId') {
      setIsOperationDropdownOpen(!isOperationDropdownOpen);
    } else if (
      key === 'customerName' ||
      key === 'referenceNumber' ||
      key === 'cargoPackageLabel' ||
      key === 'barcodes' ||
      key === 'serialNumber' ||
      key === 'recipientName'
    ) {
      setSearchKey(key);
    }
  };

  const searchOptions = [
    {
      key: 'customerName',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.CustomerName`),
      iconName: 'far fa-user-circle',
      dataCy: 'search-full-name',
    },
    {
      key: 'recipientName',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.RecipientName`),
      iconName: 'far fa-user-circle',
      dataCy: 'search-recipient-name',
    },
    {
      key: 'cargoPackageLabel',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.ReferenceNumber`),
      iconName: 'far fa-hashtag',
      dataCy: 'search-cargo-package-label',
    },
    {
      key: 'barcodes',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.Barcode`),
      iconName: 'far fa-barcode-read',
      dataCy: 'search-barcodes',
    },
    {
      key: 'referenceNumber',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.OrderNumber`),
      iconName: 'far fa-bags-shopping',
      dataCy: 'search-reference-number',
    },
    {
      key: 'serialNumber',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.SerialNumber`),
      iconName: 'far fa-key',
      dataCy: 'search-serial-number',
    },
    {
      key: 'operationId',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.Operation`),
      iconName: 'far fa-building',
      dataCy: 'search-operation',
    },
    {
      key: 'displayAllOrders',
      placeholder: t(`${intlKey}.ReturnStation.SearchOptions.DisplayAllOrders`),
      dataCy: 'search-display-all',
    },
  ];

  return (
    <>
      <Box fontSize="16" letterSpacing="negativeLarge" position="relative">
        <Box fontWeight={700} letterSpacing="negativeLarge" color="palette.hardBlue_darker" mt={38}>
          {t(`${intlKey}.ReturnStation.SearchOptions.Title`)}
        </Box>
        {searchOptions.map(option => {
          return (
            <Box key={option.key} data-cy={option.dataCy}>
              <Flex
                onClick={() => handleOnClick(option.key)}
                alignItems="center"
                width="100%"
                p="4px 20px 4px 16px"
                my={11}
                minHeight="56px"
                borderRadius={option.key === 'operationId' && isOperationDropdownOpen ? '8px 8px 0 0' : 'md'}
                bg={option.key !== 'displayAllOrders' ? 'palette.white' : 'palette.slate_lighter'}
                boxShadow={
                  option.key !== 'displayAllOrders' ? 'small' : 'none'
                } /* todo: add this colors to theme.ts later */
              >
                {option?.iconName && (
                  <Icon name={option.iconName} fontSize="18" width="19px" color="palette.snow_darker" mr={16} />
                )}
                <Flex justifyContent="space-between" alignItems="center" width="100%">
                  {option.key === 'barcodes' && returnState.searchQueries.barcodes.length ? (
                    <Box>
                      <Box fontSize="12" color="palette.snow_darker" letterSpacing={"large"} fontWeight={900} lineHeight={"large"} transition="all 0.25s">
                        {option.placeholder}
                      </Box>
                      <Flex flexWrap="wrap">
                        {returnState.searchQueries.barcodes.map((barcode, i) => (
                          <Flex
                            key={i.toString()}
                            fontFamily="SpaceMono"
                            height="20px"
                            borderRadius="sm"
                            bg="palette.softGrey"
                            color="palette.hardBlue_Darker"
                            ml={i !== 0 ? 4 : 0}
                            mb={4}
                            px={4}
                            alignItems="center"
                          >
                            {barcode}
                          </Flex>
                        ))}
                      </Flex>
                    </Box>
                  ) : (
                    <Box
                      fontSize="16"
                      letterSpacing="medium"
                      color={
                        option.key !== 'displayAllOrders'
                          ? iff(
                              returnState.searchQueries[option.key]?.length,
                              'palette.purple_darker',
                              'palette.softGrey_darker'
                            )
                          : 'palette.purple_darker'
                      }
                    >
                      <Box
                        fontSize={returnState.searchQueries[option.key]?.length ? '12' : '16'}
                        color={option.key === 'displayAllOrders' ? "palette.purple_darker" : 'palette.snow_darker'}
                        fontWeight={returnState.searchQueries[option.key]?.length ? 700 : 500}
                        lineHeight={returnState.searchQueries[option.key]?.length ? "large" : "medium"}
                        transition="all 0.25s"
                        letterSpacing={returnState.searchQueries[option.key]?.length && "large"}
                      >
                        {option.placeholder}
                      </Box>
                      {returnState.searchQueries[option.key]?.length
                        ? iff(
                            option.key === 'operationId',
                            operationList?.filter(
                              operation => operation.id === returnState.searchQueries[option.key]
                            )[0]?.name,
                            returnState.searchQueries[option.key]
                          )
                        : null}
                    </Box>
                  )}

                  {option.key === 'operationId' ? (
                    <Flex alignItems="center">
                      <Icon flexShrink={0} name="far fa-angle-down" fontSize="26" color="palette.blue_lighter" />
                      {returnState.searchQueries[option.key]?.length ? (
                        <ActionButton
                          onClick={() => {
                            returnAction.setSearchQueries({ ...returnState.searchQueries, [option.key]: '' });
                          }}
                          height="24px"
                          width="24px"
                          border="none"
                          borderRadius="full"
                          bg="palette.softGrey"
                          flexShrink={0}
                          ml={11}
                        >
                          <Icon name="fas fa-times" fontSize="16" color="palette.blue_lighter" />
                        </ActionButton>
                      ) : null}
                    </Flex>
                  ) : (
                    iff(
                      returnState.searchQueries[option.key]?.length,
                      <ActionButton
                        onClick={() => {
                          returnAction.setSearchQueries({
                            ...returnState.searchQueries,
                            [option.key]: option.key === 'barcodes' ? [] : '',
                          });
                        }}
                        height="24px"
                        width="24px"
                        border="none"
                        borderRadius="full"
                        bg="palette.softGrey"
                        flexShrink={0}
                      >
                        <Icon name="fas fa-times" fontSize="16" color="palette.blue_lighter" />
                      </ActionButton>,
                      null
                    )
                  )}

                  {option.key === 'displayAllOrders' && (
                    <Toggle
                      bg="palette.blue_lighter"
                      checkedColor="palette.hardGreen"
                      defaultIsChecked={isAllOrdersDisplayed}
                      onChange={() => setIsAllOrdersDisplayed(!isAllOrdersDisplayed)}
                    />
                  )}
                </Flex>
              </Flex>
              {option.key === 'operationId' && isOperationDropdownOpen && (
                <Box
                  position="absolute"
                  width="100%"
                  transform="translateY(-12px)"
                  zIndex={1}
                  borderRadius="0 0 8px 8px"
                  maxHeight="220px"
                  overflow="auto"
                  style={{ userSelect: 'none' }}
                  borderTop="solid 1px #d7dfe9"
                >
                  {operationList &&
                    operationList?.map((operation, i, arr) => {
                      return (
                        <Flex
                          key={operation.id}
                          onClick={() => {
                            returnAction.setSearchQueries({ ...returnState.searchQueries, operationId: operation.id as string });
                            setIsOperationDropdownOpen(false);
                          }}
                          position="relative"
                          bg="palette.white"
                          height="56px"
                          alignItems="center"
                          px={22}
                          borderRadius={arr.length - 1 === i ? '0 0 8px 8px' : '0'}
                        >
                          <Image
                            src={operation.imageUrl}
                            width="20px"
                            height="20px"
                            borderRadius="full"
                            mr={16}
                            boxShadow="small"
                          />
                          <Box fontWeight={500} color="palette.slate_dark" letterSpacing="negativeLarge">
                            {operation.name}
                          </Box>
                        </Flex>
                      );
                    })}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      {searchKey && (
        <ParcelSearchInput
          onSearch={input => {
            returnAction.setSearchQueries({
              ...returnState.searchQueries,
              [searchKey]: searchKey === 'barcodes' ? [...returnState.searchQueries['barcodes'], input] : input,
            });
            setSearchKey('');
          }}
          onClose={() => {
            setSearchKey('');
          }}
          value={returnState.searchQueries[searchKey]}
          parameter={searchKey}
        />
      )}
    </>
  );
};

export default ParcelSearchOptions;
