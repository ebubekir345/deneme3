import { DataGridRow, dateTimeFormatter, FormatterProps } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import React from 'react';
import { roles } from '../../../../auth/roles';
import { GridType } from '../../../../models';
import { useTranslation } from 'react-i18next';
import { InboundProblemType, ProblemState } from '../../../../services/swagger';
import { enumFormatter, getEnumOptions, geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { useHistory } from 'react-router-dom';
import useCommonStore from '../../../../store/global/commonStore';
import { urls } from '../../../../routers/urls';
import { ProblemTypeParam } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';

const intlKey = 'ReceivingWaybillDetails.WaybillDetailsProblemsGrid';
const titleKey = 'ReceivingWaybillDetails.WaybillDetailsProblemsGrid.Title';

interface IWaybillDetailsProblemsGrid {
  id: string;
}

const WaybillDetailsProblemsGrid: React.FC<IWaybillDetailsProblemsGrid> = ({ id }) => {
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const history = useHistory();
  const { t } = useTranslation();
  const WaybillDetailsProblemsGridColumns: Array<any> = [
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
              history.push(
                urls.inboundProblemDetails
                  .replace(':sourceType', encodeURI(ProblemTypeParam.Quarantine))
                  .replace(':id', encodeURI(value))
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
      name: geti18nName('SourcePackage', t, intlKey),
      key: 'inboundBoxLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
      gridKey={GridType.WaybillDetailsProblemsGrid}
      columns={WaybillDetailsProblemsGridColumns}
      predefinedFilters={[]}
      apiArgs={[id]}
    />
  );
};

export default WaybillDetailsProblemsGrid;
