import { ColumnSize, DataGridRow, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  LostItemProblemState,
  PickingQuarantineTotesOutputDTO,
  ProblemType,
  SalesOrderState,
} from '../../../../services/swagger';
import useCommonStore from '../../../../store/global/commonStore';
import {
  chipFormatter,
  ChipFormatterProps,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  OrderDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import { roles } from '../../../../auth/roles';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { urls } from '../../../../routers/urls';
import {
  quarantineToteDetailsFromRouteIdLinkFormatter,
  pickingToteDetailsFromRouteIdLinkFormatter
} from '../../../../utils/formatters/toteDetailsFromRouteIdLinkFormatter';

const intlKey = 'PickingManagement.QuarantineTotesGrid';
const titleKey = 'PickingManagement.QuarantineTotesGrid.Title';

const PickingManagementQuarantineTotesGrid: React.FC = () => {
  const { t } = useTranslation();
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();

  const pickingManagementQuarantineTotesGridColumns: Array<any> = [
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
      name: geti18nName('SalesOrderRefNo', t, intlKey),
      key: 'salesOrderRefNo',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: OrderDetailsLinkFormatterForOtherRoutes,
    },
    {
      name: geti18nName('QuarantineToteLabel', t, intlKey),
      key: 'quarantineToteLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: quarantineToteDetailsFromRouteIdLinkFormatter
    },
    {
      name: geti18nName('PickingToteLabel', t, intlKey),
      key: 'pickingToteLabel',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: pickingToteDetailsFromRouteIdLinkFormatter
    },
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PickingQuarantineTotesOutputDTO) => {
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
      name: geti18nName('ProblemRefNo', t, intlKey),
      key: 'problemRefNo',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        const { value } = props;
        return (
          <PseudoBox
            as={userHasMinRole(roles.ProblemSolver) ? 'a' : 'span'}
            href={userHasMinRole(roles.ProblemSolver) ? urls.problemDetails.replace(':id', props.value) : undefined}
            target={userHasMinRole(roles.ProblemSolver) ? '_blank' : undefined}
            width={1}
          >
            {value}
          </PseudoBox>
        );
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProblemReason', t, intlKey),
      key: 'problemReason',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, ProblemType),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('ProblemState', t, intlKey),
      key: 'problemState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, LostItemProblemState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
    {
      name: geti18nName('SalesOrderState', t, intlKey),
      key: 'salesOrderState',
      type: 'enum',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      options: getEnumOptions(t, SalesOrderState),
      formatter: enumFormatter,
      getRowMetaData: () => {
        return t;
      },
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PickingManagementQuarantineTotes}
      columns={pickingManagementQuarantineTotesGridColumns}
      predefinedFilters={[]}
    />
  );
};

export default PickingManagementQuarantineTotesGrid;
