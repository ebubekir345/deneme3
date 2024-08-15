import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { urls } from '../../../routers/urls';
import ActionBar from '../../organisms/ActionBar';
import { StoreState } from '../../../store/initState';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { GridType, ResourceType } from '../../../models';
import { Box, Button, Flex, Icon, Input, LayoutContent, Panel, Text } from '@oplog/express';
import { GetPendingStockCountingPlanDetailsOutputDTO, StockCountingType } from '../../../services/swagger';
import CreateCountingPlanGrid from './bones/CreateCountingPlanGrid';
import { gridSelectors } from '@oplog/data-grid';
import { QueryBuilder } from 'dynamic-query-builder-client';
import { useHistory } from 'react-router-dom';
import GenericErrorModal from '../../molecules/GenericErrorModal';

const intlKey = 'CreateCountingPlan';

const CreateCountingPlan: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [planName, setPlanName] = useState('');
  const [planType, setPlanType] = useState<StockCountingType>(StockCountingType.None);
  const [dynamicQueryOptions, setDynamicQueryOptions] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);

  const createCountingPlanAppliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(GridType.CreateStockCountingPlan, state.grid)
  );
  const getPendingStockCountingPlanDetailsResponse: Resource<GetPendingStockCountingPlanDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPendingStockCountingPlanDetails]
  );
  const createStockCountingPlanResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateStockCountingPlan]
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetPendingStockCountingPlanDetails));
      dispatch(resourceActions.resourceInit(ResourceType.CreateStockCountingPlan));
    };
  }, []);

  useEffect(() => {
    const builder = new QueryBuilder({
      filters: createCountingPlanAppliedFilters,
    });
    const query = builder.build();
    dispatch(resourceActions.resourceRequested(ResourceType.GetPendingStockCountingPlanDetails, { query }));
    setDynamicQueryOptions(query);
  }, [createCountingPlanAppliedFilters]);

  useEffect(() => {
    if (createStockCountingPlanResponse?.isSuccess) {
      history.replace(urls.otherCountings);
    }
    if (createStockCountingPlanResponse?.error) {
      setIsGenericErrorModalOpen(true);
    }
  }, [createStockCountingPlanResponse]);

  const createStockCountingPlan = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.CreateStockCountingPlan, {
        payload: {
          stockCountingPlanName: planName,
          stockCountingType: planType,
          dynamicQueryOptions: dynamicQueryOptions,
        },
      })
    );
  };

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.otherCountings },
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Countings`)}` },
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.CountingPlans`)}` },
  ];

  return (
    <>
      <ActionBar title={t(`${intlKey}.Title`)} breadcrumb={breadcrumb}>
        <Flex marginLeft="auto">
          <Button
            disabled={
              planName &&
              planType !== StockCountingType.None &&
              dynamicQueryOptions &&
              getPendingStockCountingPlanDetailsResponse?.data
                ? false
                : true
            }
            size="large"
            variant={planName && planType !== StockCountingType.None && dynamicQueryOptions ? 'primary' : 'dark'}
            onClick={createStockCountingPlan}
            isLoading={createStockCountingPlanResponse?.isBusy}
          >
            <Text mr={8}>{t(`${intlKey}.ActionBar.Button`)}</Text>
            <Icon name="fas fa-long-arrow-right" />
          </Button>
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel title={t(`${intlKey}.PlanDetails`)}>
          <Flex marginBottom={20}>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPlanName(e.currentTarget.value);
              }}
              value={planName}
              placeholder={t(`${intlKey}.PlanName`)}
              height="56px"
              width={320}
              border="none"
              borderRadius={3}
              fontWeight={500}
              letterSpacing="negativeMedium"
              color="#1C1C28"
              outline="none"
              padding="16"
              fontSize="13px"
              boxShadow="0px 6px 10px rgba(199, 199, 199, 0.15)"
              _focus={{
                outline: 'none',
              }}
            />

            <Flex position="relative" ml={14}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width={320}
                height={56}
                borderRadius={3}
                bg="palette.white"
                px={16}
                onClick={() => (isDropdownOpen ? setIsDropdownOpen(false) : setIsDropdownOpen(true))}
                position="relative"
                cursor="pointer"
                boxShadow="0px 6px 10px rgba(199, 199, 199, 0.15)"
              >
                <Text
                  color={planType === StockCountingType.None ? '#bcbcbc' : '#1C1C28'}
                  letterSpacing="negativeMedium"
                  fontSize={13}
                >
                  {planType === StockCountingType.None
                    ? t(`${intlKey}.DropdownPlaceholder`)
                    : t(`Enum.${Object.values(StockCountingType).find(type => type === planType)}`)}
                </Text>
                <Icon flexShrink={0} name="far fa-angle-down" fontSize="25px" color="palette.blue_lighter" />
              </Flex>
              <Box
                position="absolute"
                width="100%"
                zIndex={99999}
                borderRadius="0 0 3px 3px"
                overflow="auto"
                style={{ userSelect: 'none' }}
                mr={24}
                top={52}
                borderTop={isDropdownOpen ? '1px solid #cbd5e0' : 'none'}
                bg="palette.white"
              >
                {isDropdownOpen &&
                  Object.values(StockCountingType)
                    .filter(type => type !== StockCountingType.None)
                    .map((type, i, arr) => {
                      return (
                        <Flex
                          key={i.toString()}
                          bg="palette.white"
                          height="40px"
                          alignItems="center"
                          zIndex={4}
                          px={20}
                          borderRadius={arr.length - 1 === i ? '0 0 3px 3px' : '0'}
                          onClick={() => {
                            setPlanType(type);
                            setIsDropdownOpen(false);
                          }}
                          position="relative"
                        >
                          <Box fontWeight={500} color="palette.slate_dark" letterSpacing="-0.5px">
                            {t(`Enum.${type}`)}
                          </Box>
                        </Flex>
                      );
                    })}
              </Box>
            </Flex>
          </Flex>
        </Panel>
        <Panel title={t(`${intlKey}.AddFilter`)}>
          <Flex width={1} gutter={20}>
            <Box flex={4} width={1}>
              <Panel>
                <CreateCountingPlanGrid />
              </Panel>
            </Box>
            <Box flex={1}>
              <Panel title={t(`${intlKey}.PlanSummary`)}>
                <Flex
                  flexDirection="column"
                  bg="palette.white"
                  fontFamily="heading"
                  borderRadius="sm"
                  boxShadow="medium"
                  paddingY={24}
                  paddingX={20}
                >
                  <Text fontSize={16} fontWeight={800} letterSpacing="negativeMedium" color="#C0C1C9" mb={20}>
                    {t(`${intlKey}.PlanDetail.AffectedCount`)}
                  </Text>
                  <Text fontSize={11} fontWeight={700} color="#A0AEC0" mb={6}>
                    {t(`${intlKey}.PlanDetail.TotalProductAmount`)}
                  </Text>
                  <Text fontSize={16} fontWeight={800} color="#707070" mb={16}>
                    {getPendingStockCountingPlanDetailsResponse?.data?.totalProductAmount || '-'}
                  </Text>
                  <Text fontSize={11} fontWeight={700} color="#A0AEC0" mb={6}>
                    {t(`${intlKey}.PlanDetail.TotalCellAmount`)}
                  </Text>
                  <Text fontSize={16} fontWeight={800} color="#707070" mb={16}>
                    {getPendingStockCountingPlanDetailsResponse?.data?.totalCellAmount || '-'}
                  </Text>
                  <Text fontSize={11} fontWeight={700} color="#A0AEC0" mb={6}>
                    {t(`${intlKey}.PlanDetail.TotalZoneAmount`)}
                  </Text>
                  <Text fontSize={16} fontWeight={800} color="#707070" mb={16}>
                    {getPendingStockCountingPlanDetailsResponse?.data?.totalZoneAmount || '-'}
                  </Text>
                  <Text fontSize={11} fontWeight={700} color="#A0AEC0" mb={6}>
                    {t(`${intlKey}.PlanDetail.TotalOperationAmount`)}
                  </Text>
                  <Text fontSize={16} fontWeight={800} color="#707070" mb={52}>
                    {getPendingStockCountingPlanDetailsResponse?.data?.totalOperationAmount || '-'}
                  </Text>
                </Flex>
              </Panel>
            </Box>
          </Flex>
        </Panel>
      </LayoutContent>
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
    </>
  );
};

export default CreateCountingPlan;
