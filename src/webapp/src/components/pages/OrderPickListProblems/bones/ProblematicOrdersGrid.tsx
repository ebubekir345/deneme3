import { DataGridRow, FormatterProps } from '@oplog/data-grid';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  CutOffStatus,
  DeliveryTypeTag,
  GetSalesOrdersWithPickListProblemsOutputDTO,
  ProblemType,
  SalesChannel,
  SalesOrderPickingPriority,
} from '../../../../services/swagger';
import { columnProps } from '../../../../utils/columnProps';
import {
  chipFormatter,
  ChipFormatterProps,
  coloredBadgeFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  OrderDetailsLinkFormatterForOtherRoutes,
  priorityFormatter,
} from '../../../../utils/formatters';
import Badge from '../../../atoms/Badge';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { DeliveryTypeColors } from '../../PickingManagement/bones/PickingManagementWaitingOrdersGrid';

const intlKey = 'Problems.PickingProblemsGrid';
const titleKey = 'OrderPickListProblems.ProblematicOrdersGrid.Title';

const ProblematicOrdersGrid: FC = () => {
  const { t } = useTranslation();

  const problematicOrdersGridColumns: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      ...columnProps,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: GetSalesOrdersWithPickListProblemsOutputDTO) => {
        return {
          chipBackgroundColor: 'palette.white',
          chipShadow: 'large',
          textColor: 'palette.grey_dark',
          imageSize: '15px',
          imageBorderRadius: 'full',
          imageShadow: 'large',
          text: row.operationName,
          imageUrl: row.operationImageUrl,
          isUpperCase: true,
        } as ChipFormatterProps;
      },
    },
    {
      name: geti18nName('ReferenceNo', t, intlKey),
      key: 'salesOrderReferenceNumber',
      type: 'string',
      ...columnProps,
      formatter: OrderDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('LineItemCount', t, intlKey),
      key: 'lineItemCount',
      type: 'number',
      ...columnProps,
    },
    {
      name: geti18nName('ProblemType', t, intlKey),
      key: 'problemType',
      type: 'enum',
      ...columnProps,
      options: getEnumOptions(t, ProblemType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ProblemRefNo', t, intlKey),
      key: 'problemReferenceNumber',
      type: 'string',
      ...columnProps,
    },
    {
      name: geti18nName('CutOff', t, intlKey),
      key: 'cutOffStatus',
      type: 'enum',
      ...columnProps,
      options: getEnumOptions(t, CutOffStatus),
      formatter: (props: FormatterProps) => {
        const { value } = props;
        if (value !== 'None')
          return (
            <Badge
              bg={value === 'Late' ? 'palette.red' : 'palette.purple'}
              label={value === 'Late' ? t('Enum.Late') : t('Enum.CutOff')}
            />
          );
        else return '-';
      },
    },
    {
      name: geti18nName('Priority', t, intlKey),
      key: 'pickingPriority',
      type: 'enum',
      ...columnProps,
      options: getEnumOptions(t, SalesOrderPickingPriority),
      formatter: (props: FormatterProps) => priorityFormatter(t, props),
    },
    {
      name: geti18nName('SalesChannel', t, intlKey),
      key: 'salesChannel',
      type: 'enum',
      ...columnProps,
      options: getEnumOptions(t, SalesChannel),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('DeliveryType', t, intlKey),
      key: 'deliveryType',
      type: 'enum',
      ...columnProps,
      options: getEnumOptions(t, DeliveryTypeTag),
      formatter: (props: FormatterProps) => coloredBadgeFormatter(props, DeliveryTypeColors),
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.QuerySalesOrdersWithPickListProblems}
      columns={problematicOrdersGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default ProblematicOrdersGrid;
