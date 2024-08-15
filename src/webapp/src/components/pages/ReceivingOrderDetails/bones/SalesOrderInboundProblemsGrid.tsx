import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { roles } from '../../../../auth/roles';
import { GridType } from '../../../../models';
import { InboundProblemType, ProblemState } from '../../../../services/swagger';
import {
  enumFormatter,
  getEnumOptions,
  geti18nName,
  ReceivingWaybillDetailsLinkFormatterWithWaybillId,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { useHistory } from 'react-router-dom';
import useCommonStore from '../../../../store/global/commonStore';
import { urls } from '../../../../routers/urls';
import { ProblemTypeParam } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';

const intlKey = 'ReceivingOrderDetails.SalesOrderInboundProblemsGrid';
const titleKey = 'ReceivingOrderDetails.SalesOrderInboundProblemsGrid.Title';

interface ISalesOrderInboundProblemsGrid {
  purchaseOrderId: string;
  operationId: string;
  operationName: string;
  orderId: string;
  referenceNumber: string;
  source: string;
}

const SalesOrderInboundProblemsGrid: React.FC<ISalesOrderInboundProblemsGrid> = ({
  operationId,
  operationName,
  orderId,
  referenceNumber,
  source,
}) => {
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const { t } = useTranslation();
  const history = useHistory();
  const SalesOrderInboundProblemsGridColumns: Array<any> = [
    {
      name: geti18nName('ProblemRefNo', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return (
          <PseudoBox
            onClick={() =>
              userHasMinRole(roles.ProblemSolver) &&
              window.open(
                urls.inboundProblemDetails
                  .replace(':sourceType', encodeURI(ProblemTypeParam.Quarantine))
                  .replace(':id', encodeURI(value)),
                '_blank'
              )
            }
            color={userHasMinRole(roles.ProblemSolver) ? 'text.link' : 'text.h1'}
            width={1}
            _hover={userHasMinRole(roles.ProblemSolver) ? { cursor: 'pointer' } : undefined}
          >
            {value}
          </PseudoBox>
        );
      },
    },
    {
      name: geti18nName('Waybill', t, intlKey),
      key: 'waybillReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) =>
        ReceivingWaybillDetailsLinkFormatterWithWaybillId(
          props.dependentValues.waybillId,
          operationId,
          operationName,
          orderId,
          referenceNumber,
          source
        )(props),
    },
    {
      name: geti18nName('OpenedAt', t, intlKey),
      key: 'openedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Source', t, intlKey),
      key: 'source',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProblemType', t, intlKey),
      key: 'type',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, InboundProblemType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('State', t, intlKey),
      key: 'state',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ProblemState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ResolvedAt', t, intlKey),
      key: 'resolvedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('ResolvedBy', t, intlKey),
      key: 'resolvedBy',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ResolutionInfo', t, intlKey),
      key: 'resolutionNote',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.SalesOrderInboundProblemsGrid}
      columns={SalesOrderInboundProblemsGridColumns}
      predefinedFilters={[]}
      apiArgs={[orderId]}
    />
  );
};

export default SalesOrderInboundProblemsGrid;
