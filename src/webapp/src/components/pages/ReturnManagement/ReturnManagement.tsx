// TODO: Refactor this component
import React, { useEffect, useState, useRef } from 'react';
import {
  LayoutContent,
  Panel,
  Flex,
  Input,
  DatepickerExtended,
  Select,
  Box,
  Button,
  Icon,
  Heading,
  PseudoBox,
  ErrorPanel,
} from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { Resource, resourceActions } from '@oplog/resource-redux';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import {
  OperationQueryOutputDTO,
  ArrivedReturnPackageQueryOutputDTODynamicQueryOutputDTO,
  InProcessReturnPackageQueryOutputDTODynamicQueryOutputDTO,
  ResolvedReturnPackageQueryOutputDTODynamicQueryOutputDTO,
  UndefinedReturnPackageQueryOutputDTODynamicQueryOutputDTO,
} from '../../../services/swagger';
import useIntersect from '../../../utils/useIntersect';
import { ActionButton } from '../../atoms/TouchScreen';
import ReturnManagementGrid from './bones/ReturnManagementGrid';
import ReturnPackageItem from './bones/ReturnPackageItem';
import ActionBar from '../../organisms/ActionBar';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import {
  DateFilter,
  DateFilterOperation,
  Pagination,
  QueryBuilder,
  SortDirection,
  SortField,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import moment from 'moment';
import { onViewChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import { StoreState } from '../../../store/initState';

const intlKey = 'ReturnManagement';

interface DataInterface {
  packageCount: number;
  operationCount?: number;
  packages: any;
}

interface FilterData {
  operation: string;
  cargoTrackingNumber: string;
  salesOrderReferenceNumber: string;
  dateRange: { startDate: Date; endDate: Date };
}

export enum ReturnManagementViewType {
  State = 'state',
  Grid = 'grid',
}

export const ListTypes = ['arrived', 'inProcess', 'resolved', 'undefined'];

const listTypeToSortMap = (listType: string) => {
  switch (listType) {
    case 'arrived':
      return 'createdAt';
    case 'inProcess':
      return 'matchedAt';
    case 'resolved':
      return 'resolvedAt';
    case 'undefined':
      return 'markedAsUndefinedAt';
    default:
      return 'createdAt';
  }
};

const listTypeToResourceTypeMap = (listType: string) => {
  switch (listType) {
    case 'arrived':
      return ResourceType.GetArrivedReturnPackages;
    case 'inProcess':
      return ResourceType.GetInProcessReturnPackages;
    case 'resolved':
      return ResourceType.GetResolvedReturnPackages;
    case 'undefined':
      return ResourceType.GetUndefinedReturnPackages;
    default:
      return ResourceType.GetArrivedReturnPackages;
  }
};

let previousCountArrived = 10;
let previousCountInProcess = 10;
let previousCountResolved = 10;
let previousCountUndefined = 10;

type ModifiedReturnPackages = DataInterface[] | { [key: string]: any } | undefined;

const ReturnPackageLastItem = props => {
  const { item, state, loadMore, isBusy } = props;
  const [ref, entry] = useIntersect({});
  const isVisible = entry && entry.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      loadMore();
    }
  }, [isVisible]);

  return (
    <div ref={ref}>
      <ReturnPackageItem item={item} state={state} />
      {isBusy && <Skeleton height={85} />}
    </div>
  );
};

const ReturnManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [operationOptions, setOperationOptions]: any = useState();
  const [modifiedReturnPackagesArrived, setModifiedReturnPackagesArrived] = useState<ModifiedReturnPackages>();
  const [modifiedReturnPackagesInProcess, setModifiedReturnPackagesInProcess] = useState<ModifiedReturnPackages>();
  const [modifiedReturnPackagesResolved, setModifiedReturnPackagesResolved] = useState<ModifiedReturnPackages>();
  const [modifiedReturnPackagesUndefined, setModifiedReturnPackagesUndefined] = useState<ModifiedReturnPackages>();
  const [filterData, setFilterData] = useState<FilterData>({
    operation: '',
    cargoTrackingNumber: '',
    salesOrderReferenceNumber: '',
    dateRange: { startDate: new Date(), endDate: new Date() },
  });
  const [isDateRangeChanged, setIsDateRangeChanged] = useState(false);
  const [viewType, setViewType] = useState(0);
  const isReturnPackagesArrivedEffectFirstRun = useRef(true);
  const isReturnPackagesInProcessEffectFirstRun = useRef(true);
  const isReturnPackagesResolvedEffectFirstRun = useRef(true);
  const isReturnPackagesUndefinedEffectFirstRun = useRef(true);
  const operations: Resource<OperationQueryOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetOperations]
  );
  const arrivedReturnPackages: Resource<ArrivedReturnPackageQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetArrivedReturnPackages]
  );
  const inProcessReturnPackages: Resource<InProcessReturnPackageQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInProcessReturnPackages]
  );
  const resolvedReturnPackages: Resource<ResolvedReturnPackageQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetResolvedReturnPackages]
  );
  const undefinedReturnPackages: Resource<UndefinedReturnPackageQueryOutputDTODynamicQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetUndefinedReturnPackages]
  );

  const resetModifiedStates = () => {
    setModifiedReturnPackagesArrived(undefined);
    setModifiedReturnPackagesInProcess(undefined);
    setModifiedReturnPackagesResolved(undefined);
    setModifiedReturnPackagesUndefined(undefined);
  };

  const { view: viewTab }: any = useHistory();
  const routeProps = useRouteProps();

  useEffect(() => {
    routeProps.history.replace(location.pathname);
    setViewType(location.pathname.includes(ReturnManagementViewType.Grid) ? 1 : 0)
  }, [location.pathname]);

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetOperations));
    ListTypes.forEach(listType => {
      const builder = new QueryBuilder({
        filters: [],
        pagination: new Pagination({ offset: 0, count: 10 }),
        sortBy: new SortField({
          property: listTypeToSortMap(listType),
          by: SortDirection.DESC,
        }),
      });
      const query = builder.build();
      dispatch(resourceActions.resourceRequested(listTypeToResourceTypeMap(listType), { query }));
    });
    if (viewTab) {
      const index = Object.values(ReturnManagementViewType).findIndex(name => {
        return name === viewTab;
      });
      setViewType(index !== -1 ? index : 0);
    }
    return () => {
      ListTypes.forEach(listType => {
        dispatch(resourceActions.resourceInit(listTypeToResourceTypeMap(listType)));
      });
    };
  }, []);

  useEffect(() => {
    const options = [{ value: 'all', label: t(`${intlKey}.Filter.All`) }];

    if (operations?.data) {
      operations.data.forEach(operation => {
        options.push({
          value: operation?.id as string,
          label: operation?.name as string,
        });
      });
    }
    setOperationOptions(options);
  }, [operations]);

  useEffect(() => {
    if (isReturnPackagesArrivedEffectFirstRun.current) {
      isReturnPackagesArrivedEffectFirstRun.current = false;
      return;
    }
    if (arrivedReturnPackages?.isSuccess) {
      setModifiedReturnPackagesArrived({
        type: 'arrived',
        packageCount: arrivedReturnPackages?.data?.count,
        packages: modifiedReturnPackagesArrived
          ? [...(modifiedReturnPackagesArrived as any).packages, ...(arrivedReturnPackages?.data?.data as any)]
          : arrivedReturnPackages?.data?.data,
      } as DataInterface);
    }
  }, [arrivedReturnPackages]);
  useEffect(() => {
    if (isReturnPackagesInProcessEffectFirstRun.current) {
      isReturnPackagesInProcessEffectFirstRun.current = false;
      return;
    }
    if (inProcessReturnPackages?.isSuccess) {
      setModifiedReturnPackagesInProcess({
        type: 'inProcess',
        packageCount: inProcessReturnPackages?.data?.count,
        operationCount: Array.from(
          new Set((inProcessReturnPackages?.data?.data as any).map((item: any) => item.operation?.name))
        ).length,
        packages: modifiedReturnPackagesInProcess
          ? [...(modifiedReturnPackagesInProcess as any).packages, ...(inProcessReturnPackages?.data?.data as any)]
          : inProcessReturnPackages?.data?.data,
      } as DataInterface);
    }
  }, [inProcessReturnPackages]);
  useEffect(() => {
    if (isReturnPackagesResolvedEffectFirstRun.current) {
      isReturnPackagesResolvedEffectFirstRun.current = false;
      return;
    }
    if (resolvedReturnPackages?.isSuccess) {
      setModifiedReturnPackagesResolved({
        type: 'resolved',
        packageCount: resolvedReturnPackages?.data?.count,
        operationCount: Array.from(
          new Set((resolvedReturnPackages?.data?.data as any).map((item: any) => item.operation?.name))
        ).length,
        packages: modifiedReturnPackagesResolved
          ? [...(modifiedReturnPackagesResolved as any).packages, ...(resolvedReturnPackages?.data?.data as any)]
          : resolvedReturnPackages?.data?.data,
      } as DataInterface);
    }
  }, [resolvedReturnPackages]);
  useEffect(() => {
    if (isReturnPackagesUndefinedEffectFirstRun.current) {
      isReturnPackagesUndefinedEffectFirstRun.current = false;
      return;
    }
    if (undefinedReturnPackages?.isSuccess) {
      setModifiedReturnPackagesUndefined({
        type: 'undefined',
        packageCount: undefinedReturnPackages?.data?.count,
        operationCount: Array.from(
          new Set((undefinedReturnPackages?.data?.data as any).map((item: any) => item.operation?.name))
        ).length,
        packages: modifiedReturnPackagesUndefined
          ? [...(modifiedReturnPackagesUndefined as any).packages, ...(undefinedReturnPackages?.data?.data as any)]
          : undefinedReturnPackages?.data?.data,
      } as DataInterface);
    }
  }, [undefinedReturnPackages]);

  const updateRouteOnViewChange = (activeIndex: number) => {
    const activePath = Object.values(ReturnManagementViewType)[activeIndex];
    onViewChange(activePath, routeProps);
  };

  const filterOrders = (values, isDateRangeChanged) => {
    const filters: any = [];
    if (values.operation) {
      filters.push(
        new StringFilter({
          property: 'operation.id',
          value: values.operation,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (values.cargoTrackingNumber) {
      filters.push(
        new StringFilter({
          property: 'cargoTrackingNumber',
          value: values.cargoTrackingNumber,
          op: StringFilterOperation.Contains,
        })
      );
    }
    if (values.salesOrderReferenceNumber) {
      filters.push(
        new StringFilter({
          property: 'salesOrderReferenceNumber',
          value: values.salesOrderReferenceNumber,
          op: StringFilterOperation.Contains,
        })
      );
    }
    if (isDateRangeChanged) {
      filters.push(
        new DateFilter({
          property: 'createdAt',
          op: DateFilterOperation.GreaterThanOrEqual,
          value: moment(values.dateRange.startDate, 'YYYY-MM-DD HH:mm').toISOString(),
          dateFormat: 'YYYY-MM-DD HH:mm',
        })
      );
      filters.push(
        new DateFilter({
          property: 'createdAt',
          op: DateFilterOperation.LessThanOrEqual,
          value: moment(values.dateRange.endDate, 'YYYY-MM-DD HH:mm').toISOString(),
          dateFormat: 'YYYY-MM-DD HH:mm',
        })
      );
    }

    ListTypes.forEach(listType => {
      const builder = new QueryBuilder({
        filters,
        pagination: new Pagination({ offset: 0, count: 10 }),
        sortBy: new SortField({
          property: listTypeToSortMap(listType),
          by: SortDirection.DESC,
        }),
      });
      const query = builder.build();
      dispatch(resourceActions.resourceRequested(listTypeToResourceTypeMap(listType), { query }));
    });

    // eslint-disable-next-line no-multi-assign
    previousCountArrived = previousCountInProcess = previousCountResolved = previousCountUndefined = 10;
  };

  const listTypeToPreviousCountMap = (listType: string) => {
    switch (listType) {
      case 'arrived':
        return previousCountArrived;
      case 'inProcess':
        return previousCountInProcess;
      case 'resolved':
        return previousCountResolved;
      case 'undefined':
        return previousCountUndefined;
      default:
        return previousCountArrived;
    }
  };

  const increasePreviousCount = (listType: string) => {
    if (listType === 'arrived') {
      previousCountArrived += 10;
    }
    if (listType === 'inProcess') {
      previousCountInProcess += 10;
    }
    if (listType === 'resolved') {
      previousCountResolved += 10;
    }
    if (listType === 'undefined') {
      previousCountUndefined += 10;
    }
  };

  const loadMore = (listType: string, maxCount: number, filterValues, isDateRangeChanged) => {
    const filters: any = [];
    if (filterValues.operation) {
      filters.push(
        new StringFilter({
          property: 'operation.id',
          value: filterValues.operation,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (filterValues.cargoTrackingNumber) {
      filters.push(
        new StringFilter({
          property: 'cargoTrackingNumber',
          value: filterValues.cargoTrackingNumber,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (filterValues.salesOrderReferenceNumber) {
      filters.push(
        new StringFilter({
          property: 'salesOrderReferenceNumber',
          value: filterValues.salesOrderReferenceNumber,
          op: StringFilterOperation.Equals,
        })
      );
    }
    if (isDateRangeChanged) {
      filters.push(
        new DateFilter({
          property: 'createdAt',
          op: DateFilterOperation.GreaterThanOrEqual,
          value: moment(filterValues.dateRange.startDate, 'YYYY-MM-DD HH:mm').toISOString(),
          dateFormat: 'YYYY-MM-DD HH:mm',
        })
      );
      filters.push(
        new DateFilter({
          property: 'createdAt',
          op: DateFilterOperation.LessThanOrEqual,
          value: moment(filterValues.dateRange.endDate, 'YYYY-MM-DD HH:mm').toISOString(),
          dateFormat: 'YYYY-MM-DD HH:mm',
        })
      );
    }
    if (maxCount > listTypeToPreviousCountMap(listType)) {
      const builder = new QueryBuilder({
        filters,
        pagination: new Pagination({ offset: listTypeToPreviousCountMap(listType), count: 10 }),
        sortBy: new SortField({
          property: listTypeToSortMap(listType),
          by: SortDirection.DESC,
        }),
      });
      const query = builder.build();
      dispatch(resourceActions.resourceRequested(listTypeToResourceTypeMap(listType), { query }));

      increasePreviousCount(listType);
    }
  };

  const listTypeToMaxCountMap = (listType: string) => {
    switch (listType) {
      case 'arrived':
        return arrivedReturnPackages?.data?.count || 0;
      case 'inProcess':
        return inProcessReturnPackages?.data?.count || 0;
      case 'resolved':
        return resolvedReturnPackages?.data?.count || 0;
      case 'undefined':
        return undefinedReturnPackages?.data?.count || 0;
      default:
        return 0;
    }
  };

  const listTypeToIsBusyMap = (listType: string) => {
    switch (listType) {
      case 'arrived':
        return arrivedReturnPackages?.isBusy;
      case 'inProcess':
        return inProcessReturnPackages?.isBusy;
      case 'resolved':
        return resolvedReturnPackages?.isBusy;
      case 'undefined':
        return undefinedReturnPackages?.isBusy;
      default:
        return false;
    }
  };

  const isResourceBusy =
    (arrivedReturnPackages?.isBusy && !modifiedReturnPackagesArrived) ||
    (inProcessReturnPackages?.isBusy && !modifiedReturnPackagesInProcess) ||
    (resolvedReturnPackages?.isBusy && !modifiedReturnPackagesResolved) ||
    (undefinedReturnPackages?.isBusy && !modifiedReturnPackagesUndefined);

  return (
    <Flex height="100vh" flexDirection="column">
      <ActionBar title={t(`${intlKey}.Title`)} breadcrumb={[{ title: t(`${intlKey}.Title`) }]} alignItems="flex-end">
        <Flex marginLeft="auto" marginBottom={12}>
          <ActionButton
            onClick={() => {
              setViewType(0);
              updateRouteOnViewChange(0);
            }}
            border="none"
            bg="transparent"
            flexShrink={0}
          >
            <Icon
              name="far fa-grip-horizontal"
              fontSize="24px"
              color={viewType === 0 ? 'palette.grey_dark' : 'palette.grey_lighter'}
            />
          </ActionButton>
          <ActionButton
            onClick={() => {
              setViewType(1);
              updateRouteOnViewChange(1);
            }}
            ml={8}
            border="none"
            bg="transparent"
            flexShrink={0}
          >
            <Icon
              name="far fa-list"
              fontSize="24px"
              color={viewType === 1 ? 'palette.grey_dark' : 'palette.grey_lighter'}
            />
          </ActionButton>
        </Flex>
      </ActionBar>
      <LayoutContent display="flex" flexDirection="column" flexGrow={1}>
        {viewType === 0 && (
          <>
            <Panel bg="palette.white" p="11px 16px" borderRadius="sm">
              <form>
                <Flex justifyContent="space-between" flexWrap="wrap">
                  <Flex gutter="11" flexWrap="wrap">
                    <Box width={208}>
                      <Select
                        options={operationOptions}
                        value={filterData.operation}
                        onChange={e =>
                          setFilterData({
                            ...filterData,
                            operation: e.currentTarget.value === 'all' ? '' : e.currentTarget.value,
                          })
                        }
                        placeholder={t(`${intlKey}.Filter.SelectOperation`)}
                      />
                    </Box>
                    <Input
                      value={filterData.cargoTrackingNumber}
                      onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
                        setFilterData({ ...filterData, cargoTrackingNumber: e.currentTarget.value })
                      }
                      width={208}
                      placeholder={t(`${intlKey}.Filter.CargoTrackingNumber`)}
                    />
                    <Input
                      value={filterData.salesOrderReferenceNumber}
                      onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
                        setFilterData({ ...filterData, salesOrderReferenceNumber: e.currentTarget.value })
                      }
                      width={208}
                      placeholder={t(`${intlKey}.Filter.SalesOrderReferenceNumber`)}
                    />
                    <Box width={275}>
                      <DatepickerExtended
                        showTime
                        popperInputTexts={{
                          startInput: t(`${intlKey}.Filter.StartDate`),
                          endInput: t(`${intlKey}.Filter.EndDate`),
                        }}
                        onChangeStartDate={date => {
                          setIsDateRangeChanged(true);
                          setFilterData({
                            ...filterData,
                            dateRange: { ...filterData.dateRange, startDate: date || new Date() },
                          });
                        }}
                        onChangeEndDate={date => {
                          setIsDateRangeChanged(true);
                          setFilterData({
                            ...filterData,
                            dateRange: { ...filterData.dateRange, endDate: date || new Date() },
                          });
                        }}
                      />
                    </Box>
                  </Flex>
                  <Button
                    float="right"
                    fontSize="13"
                    disabled={isResourceBusy}
                    onClick={e => {
                      e.preventDefault();
                      resetModifiedStates();
                      filterOrders(filterData, isDateRangeChanged);
                    }}
                  >
                    <Icon name="fas fa-filter" mr="6" />
                    {t(`${intlKey}.Filter.ApplyFilters`)}
                  </Button>
                </Flex>
              </form>
            </Panel>
            <Panel bg="palette.white" p="16px 22px" mt="18px" borderRadius="sm" flexGrow={1} flexShrink={0}>
              {isResourceBusy ? (
                <Box>
                  <Skeleton height="81px" />
                  <Skeleton height="81px" />
                  <Skeleton height="81px" />
                  <Skeleton height="81px" />
                  <Skeleton height="81px" />
                  <Skeleton height="81px" />
                </Box>
              ) : (
                <Flex flexGrow={1}>
                  {[
                    modifiedReturnPackagesArrived,
                    modifiedReturnPackagesInProcess,
                    modifiedReturnPackagesResolved,
                    modifiedReturnPackagesUndefined,
                  ].map((item: any, i) => {
                    if (item?.packages) {
                      return (
                        <PseudoBox
                          key={i.toString()}
                          width={320}
                          px="11"
                          borderRight="xs"
                          borderColor="palette.snow_lighter"
                          _last={{ borderRight: 0 }}
                          display="flex"
                          flexDirection="column"
                          height="100%"
                        >
                          <Box>
                            <Heading
                              fontFamily="heading"
                              fontSize="14"
                              letterSpacing="-0.26px"
                              color="palette.grey_darker"
                            >
                              {t(`${intlKey}.Grid.${item.type}`)}
                            </Heading>
                            <Box color="palette.grey_lighter">
                              {t(`${intlKey}.ReturnPackageCount`, {
                                packageCount: item.packageCount,
                              })}
                            </Box>
                            <Box color="palette.grey_lighter">
                              {t(`${intlKey}.OperationCount`, {
                                operationCount: item.operationCount || 0,
                              })}
                            </Box>
                          </Box>
                          <Box
                            id="order-item-list"
                            overflowX="hidden"
                            overflowY="auto"
                            flexGrow={1}
                            height="0px"
                            mt={16}
                          >
                            {item.packages &&
                              item.packages?.map((returnPackage, k, arr) =>
                                k + 1 === arr.length ? (
                                  <ReturnPackageLastItem
                                    key={returnPackage.id}
                                    item={returnPackage}
                                    state={item.type}
                                    isBusy={listTypeToIsBusyMap(ListTypes[i])}
                                    loadMore={() => {
                                      loadMore(
                                        ListTypes[i],
                                        listTypeToMaxCountMap(ListTypes[i]),
                                        filterData,
                                        isDateRangeChanged
                                      );
                                    }}
                                  />
                                ) : (
                                  <ReturnPackageItem key={returnPackage.id} item={returnPackage} state={item.type} />
                                )
                              )}
                          </Box>
                        </PseudoBox>
                      );
                    }
                    return null;
                  })}
                </Flex>
              )}
              {arrivedReturnPackages?.error && inProcessReturnPackages?.error && resolvedReturnPackages?.error && (
                <ErrorPanel title={t('ErrorPanel.ErrorMessage')} message={t('ErrorPanel.ReloadMessage')} />
              )}
            </Panel>
          </>
        )}
        {viewType === 1 && <ReturnManagementGrid />}
      </LayoutContent>
    </Flex>
  );
};

export default ReturnManagement;
