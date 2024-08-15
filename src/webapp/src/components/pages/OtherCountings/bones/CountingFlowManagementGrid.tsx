import { ColumnSize, DataGridRow, FormatterProps, gridActions } from '@oplog/data-grid';
import { Dialog, DialogTypes, Text, Toggle } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import {
  QualityStockCountingListSourceProcess,
  SetStockCountingListConfigurationStatusCommand,
  StockCountingSource,
  StockCountingType,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import GenericErrorModal from '../../../molecules/GenericErrorModal';

const intlKey = 'OtherCountings.CountingFlowManagementGrid';
const titleKey = 'OtherCountings.CountingFlowManagementGrid.Title';

const CountingFlowManagementGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedFlow, setSelectedFlow] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);

  const getCountingTypeStatusResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SetStockCountingListConfigurationStatus]
  );

  const setCountingTypeStatus = (params: SetStockCountingListConfigurationStatusCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.SetStockCountingListConfigurationStatus, { params }));
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.SetPickingTrolleySelectionConfigurationStatus));
    };
  }, []);

  useEffect(() => {
    if (getCountingTypeStatusResponse?.isSuccess) {
      setSelectedFlow(undefined);
      setIsDialogOpen(false);
      setTimeout(() => {
        dispatch(gridActions.gridFetchRequested(GridType.CountingFlowManagement));
      }, 500);
    }
    if (getCountingTypeStatusResponse?.error) {
      setIsDialogOpen(false);
      setIsGenericErrorModalOpen(true);
    }
  }, [getCountingTypeStatusResponse]);

  const countingFlowManagementGridColumns: Array<any> = [
    {
      name: '#',
      key: 'index',
      type: 'number',
      filterable: false,
      cellClass: 'index-column',
      locked: true,
      sortable: false,
      visibility: true,
      width: ColumnSize.Medium,
    },
    {
      name: geti18nName('CountingType', t, intlKey),
      key: 'source',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingSource),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('Variation', t, intlKey),
      key: 'process',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, QualityStockCountingListSourceProcess),
      formatter: (props: FormatterProps) =>
        props.value === QualityStockCountingListSourceProcess.None ? '-' : enumFormatter(props),
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('CountingVariation', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, StockCountingType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('IsEnabled', t, intlKey),
      key: 'isActive',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return (
          <Toggle
            checked={value}
            defaultIsChecked={value}
            onChange={e => {
              e.stopPropagation();
              setSelectedFlow(dependentValues);
              setIsDialogOpen(true);
            }}
          />
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('WaitingForCountingProductAmount', t, intlKey),
      key: 'amountOfProductsWaitingForCounting',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('WaitingForCountingCellAmount', t, intlKey),
      key: 'amountOfCellsWaitingForCounting',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('WaitingForCountingStockCountingListAmount', t, intlKey),
      key: 'amountOfStockCountListsWaitingForCounting',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ActiveStockCountingListAmount', t, intlKey),
      key: 'amountOfStockCountListsInProcess',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
  ];

  return (
    <>
      <GenericDataGrid
        intlKey={intlKey}
        titleKey={titleKey}
        gridKey={GridType.CountingFlowManagement}
        columns={countingFlowManagementGridColumns}
        predefinedFilters={[]}
      />
      <Dialog
        message={
          <Text fontSize="14" color="palette.black" fontFamily="heading">
            <Trans
              i18nKey={`${intlKey}.${selectedFlow && selectedFlow?.isActive ? 'SureToDisable' : 'SureToEnable'}`}
              values={{
                type: `${t(`Enum.${selectedFlow?.source}`)} - ${t(`Enum.${selectedFlow?.type}`)}`,
              }}
            />
          </Text>
        }
        isOpen={isDialogOpen}
        isLoading={getCountingTypeStatusResponse?.isBusy}
        onApprove={() => {
          setCountingTypeStatus({
            isActive: !selectedFlow.isActive,
            stockCountingListConfigurationId: selectedFlow.id,
          });
        }}
        onCancel={() => {
          setSelectedFlow(undefined);
          setIsDialogOpen(false);
        }}
        type={DialogTypes.Information}
        text={{
          approve: t(`Modal.Confirmation.Okay`),
          cancel: t(`Modal.Confirmation.Cancel`),
        }}
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.5,
        }}
      />
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
    </>
  );
};

export default CountingFlowManagementGrid;
