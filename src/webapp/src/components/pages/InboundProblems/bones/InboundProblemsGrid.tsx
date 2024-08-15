import { DataGridRow, dateTimeFormatter, FormatterProps, gridActions, ImageFormatter } from '@oplog/data-grid';
import { PseudoBox } from '@oplog/express';
import { SortDirection, SortField, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { InboundProblemType, ProblemState } from '../../../../services/swagger';
import useCommonStore from '../../../../store/global/commonStore';
import { geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import { roles } from '../../../../auth/roles';
import { urls } from '../../../../routers/urls';
import { ProblemTypeParam } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';
import { getEnumOptions, enumFormatter } from '../../../../utils/formatters';
import QuickFilterBar from '../../../molecules/QuickFilterBar';
import { useDispatch } from 'react-redux';

const intlKey = 'InboundProblems.InboundProblemsGrid';
const titleKey = 'InboundProblems.InboundProblemsGrid.Title';

const inboundProblemsGridInitialSort: SortField = new SortField({
  property: 'receivedAt',
  by: SortDirection.DESC,
});

const InboundProblemsFilters = {
  AllProblems: 'AllProblems',
  InProgress: ProblemState.InProgress,
  Resolved: ProblemState.Resolved,
};

const InboundProblemsGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const [activeQuickFilters, setActiveQuickFilters] = useState<string>(InboundProblemsFilters.InProgress);

  useEffect(() => {
    applyQuickFilter(activeQuickFilters);
  }, [])

  const quickFilterButtons = Object.keys(InboundProblemsFilters).map(status => ({
    key: status,
    title: t(`Problems.PickingProblems.QuickFilters.${status}`),
    isSelected: activeQuickFilters === status,
    onClick: () => {
      setActiveQuickFilters(status);
      applyQuickFilter(status);
    },
  }));

  const applyQuickFilter = (status: string) => {
    let appliedFilter = status === 'AllProblems' ? [] : [
      new StringFilter({
        property: 'state',
        op: StringFilterOperation.Equals,
        value: status,
        id: status,
      }),
    ];

    dispatch(gridActions.gridPaginationOffsetReset(GridType.InboundProblemsGrid));
    dispatch(gridActions.gridFiltersSubmitted(GridType.InboundProblemsGrid, appliedFilter, []));
    dispatch(gridActions.gridFetchRequested(GridType.InboundProblemsGrid));
  };

  const inboundProblemsGrid: Array<any> = [
    {
      name: geti18nName('ReferenceNo', t, intlKey),
      key: 'referenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      getRowMetaData: (row: DataGridRow) => row,
      formatter: (props: FormatterProps) => {
        const { dependentValues, value } = props;
        return (
          <PseudoBox
            as={userHasMinRole(roles.ProblemSolver) ? 'a' : 'span'}
            href={
              userHasMinRole(roles.ProblemSolver)
                ? urls.inboundProblemDetails
                  .replace(':sourceType', ProblemTypeParam.Quarantine)
                  .replace(':id', dependentValues?.referenceNumber)
                : undefined
            }
            target={userHasMinRole(roles.ProblemSolver) ? '_blank' : undefined}
            width={1}
          >
            {value}
          </PseudoBox>
        );
      },
    },
    {
      name: geti18nName('ProblemType', t, intlKey),
      key: 'inboundProblemType',
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
      name: geti18nName('ReceivedAt', t, intlKey),
      key: 'receivedAt',
      type: 'moment',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: dateTimeFormatter,
    },
    {
      name: geti18nName('Waybill', t, intlKey),
      key: 'waybill',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Barcodes', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('InboundBoxLabel', t, intlKey),
      key: 'inboundBoxLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ItemAmount', t, intlKey),
      key: 'itemAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ContainerLabel', t, intlKey),
      key: 'containerLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ImageUrl', t, intlKey),
      key: 'imageUrl',
      type: 'string',
      filterable: false,
      locked: true,
      sortable: false,
      visibility: true,
      formatter: ImageFormatter,
    },
    {
      name: geti18nName('OpenedBy', t, intlKey),
      key: 'openedBy',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
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
  ];

  return (
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.InboundProblemsGrid}
        columns={inboundProblemsGrid}
        predefinedFilters={[]}
        sortField={inboundProblemsGridInitialSort}
      />
    </>
  );
};

export default InboundProblemsGrid;
