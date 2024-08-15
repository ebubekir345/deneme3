import { ColumnSize, DataGridRow, FormatterProps, gridActions, PredefinedFilter } from '@oplog/data-grid';
import { Dialog, DialogTypes, Text, Toggle } from '@oplog/express';
import { resourceActions, resourceSelectors } from '@oplog/resource-redux';
import { StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { PickingTrolleySelectionConfigurationPickingType, PickingTrolleyType } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import GenericErrorModal from '../../../molecules/GenericErrorModal';

const intlKey = 'FlowManagement.Grid';
const titleKey = 'FlowManagement.Grid.Title';

export enum VehicleTypes {
  XL = 'XL',
  L = 'L',
  M = 'M',
  S = 'S',
  XS = 'XS',
  SingleItem = 'SingleItem',
  MultiItem = 'MultiItem',
  Heavy = 'Heavy',
  HOV = 'HOV',
  Oversize = 'Oversize',
  Standard = 'Standard',
  Virtual = 'Virtual',
  SingleItemSioc = 'SingleItemSioc',
}

interface IFlowManagementGrid {
  flowType: PickingTrolleySelectionConfigurationPickingType;
}

const FlowManagementGrid: React.FC<IFlowManagementGrid> = ({ flowType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedFlow, setSelectedFlow] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);

  const flowManagementGridPredefinedFilters: PredefinedFilter[] = [
    {
      filter: new StringFilter({
        property: 'pickingType',
        op: StringFilterOperation.Equals,
        value: flowType,
      }),
      selected: true,
      visibility: false,
    },
  ];

  const setPickingTrolleySelectionConfigurationStatusResponse = useSelector((state: StoreState) =>
    resourceSelectors.getResource(state.resources, ResourceType.SetPickingTrolleySelectionConfigurationStatus)
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.SetPickingTrolleySelectionConfigurationStatus));
    };
  }, []);

  useEffect(() => {
    dispatch(
      gridActions.gridPredefinedFiltersInitialized(GridType.FlowManagement, flowManagementGridPredefinedFilters)
    );
    dispatch(gridActions.gridFetchRequested(GridType.FlowManagement));
  }, [flowType]);

  useEffect(() => {
    if (setPickingTrolleySelectionConfigurationStatusResponse?.isSuccess) {
      setSelectedFlow(undefined);
      setIsDialogOpen(false);
    }
    if (setPickingTrolleySelectionConfigurationStatusResponse?.error) {
      setIsDialogOpen(false);
      setIsGenericErrorModalOpen(true);
    }
    dispatch(gridActions.gridFetchRequested(GridType.FlowManagement));
  }, [setPickingTrolleySelectionConfigurationStatusResponse?.data]);

  const FlowManagementGridColumns: Array<any> = [
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
      name:
        flowType === PickingTrolleySelectionConfigurationPickingType.Normal
          ? geti18nName('VehicleType', t, intlKey)
          : geti18nName('MissingVehicleType', t, intlKey),
      key: 'vehicleType',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, PickingTrolleyType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('VehicleVariation', t, intlKey),
      key: 'vehicleVariation',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) =>
        Object.keys(VehicleTypes).includes(props.value) ? enumFormatter(props) : props.value,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('IsEnabled', t, intlKey),
      key: 'isEnabled',
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
      name: geti18nName('LateCount', t, intlKey),
      key: 'lateCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CutOffCount', t, intlKey),
      key: 'cutOffCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Priority1', t, intlKey),
      key: 'priority1',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Priority2', t, intlKey),
      key: 'priority2',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Priority3', t, intlKey),
      key: 'priority3',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('NormalOrderCount', t, intlKey),
      key: 'normalOrderCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ActivePickingSalesOrderCount', t, intlKey),
      key: 'activePickingSalesOrderCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return `${value} ${t(`${intlKey}.Order`)}/${dependentValues.activePickingSalesOrderLineItemsCount} ${t(
          `${intlKey}.Product`
        )}`;
      },
    },
    {
      name: geti18nName('WaitingForPackingSalesOrderCount', t, intlKey),
      key: 'waitingForPackingSalesOrderCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value, dependentValues } = props;
        return `${value} ${t(`${intlKey}.Order`)}/${dependentValues.waitingForPackingSalesOrderLineItemsCount} ${t(
          `${intlKey}.Product`
        )}`;
      },
    },
    {
      name: geti18nName('WaitingForSLAMCargoPackageCount', t, intlKey),
      key: 'waitingForSLAMCargoPackageCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return `${value} ${t(`${intlKey}.Package`)}`;
      },
    },
    {
      name: geti18nName('WaitingForDispatchCargoPackageCount', t, intlKey),
      key: 'waitingForDispatchCargoPackageCount',
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
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.FlowManagement}
        columns={FlowManagementGridColumns}
        predefinedFilters={flowManagementGridPredefinedFilters}
      />
      <Dialog
        message={
          <Text fontSize="14" color="palette.black" fontFamily="heading">
            <Trans
              i18nKey={`${intlKey}.${selectedFlow && selectedFlow?.isEnabled ? 'SureToDisable' : 'SureToEnable'}`}
              values={{
                type: selectedFlow
                  ? `${flowType === PickingTrolleySelectionConfigurationPickingType.MissingItem
                    ? t(`${intlKey}.WithMissingItem`)
                    : ''
                  }${t(`Enum.${selectedFlow?.vehicleType}`)}${selectedFlow?.vehicleVariation ? ` - ${selectedFlow?.vehicleVariation}` : ''
                  }`
                  : '',
              }}
            />
          </Text>
        }
        isOpen={isDialogOpen}
        isLoading={setPickingTrolleySelectionConfigurationStatusResponse?.isBusy}
        onApprove={() => {
          dispatch(
            resourceActions.resourceRequested(ResourceType.SetPickingTrolleySelectionConfigurationStatus, {
              params: {
                pickingTrolleySelectionConfigurationId: selectedFlow.id,
                isEnabled: !selectedFlow.isEnabled,
              },
            })
          );
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

export default FlowManagementGrid;