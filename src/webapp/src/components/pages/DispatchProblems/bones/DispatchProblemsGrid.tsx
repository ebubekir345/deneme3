import { DataGridRow, dateTimeFormatter, FormatterProps, gridActions } from '@oplog/data-grid';
import { SortDirection, SortField, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { GridType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import { ProblemState, ProblemType } from '../../../../services/swagger';
import {
  appendImageToTextFieldFormatter,
  enumFormatter,
  getEnumOptions,
  geti18nName,
  OrderDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';
import useCommonStore from '../../../../store/global/commonStore';
import { roles } from '../../../../auth/roles';
import { PseudoBox } from '@oplog/express';
import QuickFilterBar from '../../../molecules/QuickFilterBar';
import { useDispatch } from 'react-redux';

const intlKey = 'Problems.DispatchProblemsGrid';
const titleKey = 'Problems.DispatchProblemsGrid.Title';

const dispatchProblemsGridInitialSort: SortField = new SortField({
  property: 'openedAt',
  by: SortDirection.DESC,
});

const DispatchProblemsFilters = {
  AllProblems: 'AllProblems',
  InProgress: ProblemState.InProgress,
  Resolved: ProblemState.Resolved,
};

const DispatchProblemsGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const [activeQuickFilters, setActiveQuickFilters] = useState<string>(DispatchProblemsFilters.InProgress);

  useEffect(() => {
    applyQuickFilter(activeQuickFilters);
  }, [])

  const quickFilterButtons = Object.keys(DispatchProblemsFilters).map(status => ({
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

    dispatch(gridActions.gridPaginationOffsetReset(GridType.DispatchProblemsGrid));
    dispatch(gridActions.gridFiltersSubmitted(GridType.DispatchProblemsGrid, appliedFilter, []));
    dispatch(gridActions.gridFetchRequested(GridType.DispatchProblemsGrid));
  };

  const dispatchProblemsGrid: Array<any> = [
    {
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => appendImageToTextFieldFormatter(props, 'operationImageUrl'),
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ReferenceNo', t, intlKey),
      key: 'salesOrderReferenceNumber',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: OrderDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProblemRefNo', t, intlKey),
      key: 'referenceNumber',
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
      name: geti18nName('ProblemType', t, intlKey),
      key: 'type',
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
      name: geti18nName('IssueDate', t, intlKey),
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
      name: geti18nName('Personal', t, intlKey),
      key: 'resolvedUser',
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
    <>
      <QuickFilterBar filterButtons={quickFilterButtons} />
      <GenericDataGrid
        titleKey={t(titleKey)}
        intlKey={intlKey}
        gridKey={GridType.DispatchProblemsGrid}
        columns={dispatchProblemsGrid}
        predefinedFilters={[]}
        sortField={dispatchProblemsGridInitialSort}
      />
    </>
  );
};

export default DispatchProblemsGrid;
