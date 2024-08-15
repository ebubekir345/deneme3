import {
  ColumnSize,
  DataGridColumnType,
  DataGridRow,
  FormatterProps,
  gridActions,
  GridContainer,
  GridContainerProps,
  gridSelectors,
} from '@oplog/data-grid';
import { Dialog, DialogTypes, Flex, Icon, PseudoBox } from '@oplog/express';
import { resourceActions, resourceSelectors } from '@oplog/resource-redux';
import { Pagination, QueryBuilder } from 'dynamic-query-builder-client';
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { store } from '../../App';
import { ResourceType } from '../../models';
import { StoreState } from '../../store/initState';
import { geti18nName } from '../../utils/formatters';

const intlKey = 'DataGrid.ExcelToExport';
const excelToExportRowLimit = 1000000;

interface IGenericDataGrid extends Omit<GridContainerProps, 'getCellActions'> {
  getCellActions?: { icon: string; text: string; callback: (values, dependentValues) => void }[];
  isModalGrid?: boolean;
}

const GenericDataGrid: React.FC<IGenericDataGrid> = (props): ReactElement => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [limitExceededDialogOpen, setLimitExceededDialogOpen] = useState(false);

  const appliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(props.gridKey, state.grid)
  );

  const predefinedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridPreDefinedFilters(props.gridKey, state.grid)
  );

  const excelToExportResponse = useSelector((state: StoreState) =>
    resourceSelectors.getResource(state.resources, ResourceType.ExportToExcel)
  );

  const gridRowCount =
    useSelector((state: StoreState) => gridSelectors.getGridFooterPagination(props.gridKey, state.grid)?.rowCount) || 0;

  const onExcelExport = () => {
    if (gridRowCount < excelToExportRowLimit) {
      const appliedPredefinedFilters = predefinedFilters
        .filter(predefinedFilter => predefinedFilter.selected)
        .map(predefinedFilter => predefinedFilter.filter);

      const builder = new QueryBuilder({
        filters: [...appliedFilters, ...appliedPredefinedFilters],
      });
      const query = builder.build();

      dispatch(
        resourceActions.resourceRequested(ResourceType.ExportToExcel, {
          reportName: props.gridKey,
          referenceId: props.apiArgs ? props.apiArgs[0] : '',
          dqb: query,
        })
      );
    } else {
      setLimitExceededDialogOpen(true);
    }
  };

  const onCloseDialog = () => {
    dispatch(resourceActions.resourceInit(ResourceType.ExportToExcel));
  };

  const excelToExportDialogs = [
    {
      type: DialogTypes.Success,
      icon: 'fas fa-check',
      message: t(`${intlKey}.Success`),
      isOpen: excelToExportResponse?.isSuccess || false,
      onApprove: onCloseDialog,
      showCloseButton: true,
      isLoading: excelToExportResponse?.isBusy,
      onCancel: onCloseDialog,
    },
    {
      type: DialogTypes.Danger,
      icon: 'fas fa-times',
      message: t(`${intlKey}.Error`),
      isOpen: excelToExportResponse?.error || false,
      onApprove: onCloseDialog,
      showCloseButton: true,
      isLoading: excelToExportResponse?.isBusy,
      onCancel: onCloseDialog,
    },
    {
      type: DialogTypes.Information,
      message: t(`${intlKey}.Loading`),
      isOpen: excelToExportResponse?.isBusy || false,
      onApprove: undefined,
      showCloseButton: false,
      isLoading: excelToExportResponse?.isBusy,
      onCancel: undefined,
    },
    {
      type: DialogTypes.Information,
      icon: undefined,
      message: t(`${intlKey}.LimitExceeded`, {
        rowCount: gridRowCount,
        excelToExportRowLimit: excelToExportRowLimit,
      }),
      isOpen: limitExceededDialogOpen,
      onApprove: () => setLimitExceededDialogOpen(false),
      showCloseButton: false,
      isLoading: undefined,
      onCancel: undefined,
    },
  ];

  const modifiedColumns = () => {
    const { getCellActions } = props;
    if (getCellActions) {
      return [
        ...props.columns,
        {
          name: geti18nName('Title', t, 'DataGrid.Actions'),
          key: '',
          type: 'component' as DataGridColumnType,
          filterable: false,
          locked: true,
          sortable: false,
          visibility: true,
          formatter: (props: FormatterProps) => {
            const { value, dependentValues } = props;
            return (
              <Flex flexWrap="wrap">
                {(getCellActions as any)?.map((cellAction, i) => (
                  <PseudoBox
                    key={i.toString()}
                    _hover={{ color: 'palette.red', cursor: 'pointer' }}
                    onClick={() => cellAction.callback(value, dependentValues)}
                    marginRight={8}
                  >
                    <Icon name={cellAction.icon} marginRight={4} />
                    {cellAction.text}
                  </PseudoBox>
                ))}
              </Flex>
            );
          },
          getRowMetaData: (row: DataGridRow) => row,
          width: ColumnSize.XLarge,
        },
      ];
    }
    return props.columns;
  };

  useEffect(() => {
    !props.isModalGrid &&
      window.addEventListener(
        'popstate',
        () => {
          setTimeout(() => {
            if (location.search) {
              dispatch(
                gridActions.gridPaginationChanged(
                  props.gridKey,
                  new Pagination({
                    offset: Number(
                      location.search
                        .split('offset')[2]
                        .split('%3D')[1]
                        .split('%26')[0]
                    ),
                    count: Number(
                      location.search
                        .split('count')[2]
                        .split('%3D')[1]
                        .split('%22%7D')[0]
                    ),
                  })
                )
              );
              dispatch(gridActions.gridFetchRequested(props.gridKey, props.apiArgs && [props.apiArgs]));
            }
          }, 0);
        },
        { once: true }
      );
  }, [location.search]);

  return (
    <>
      <GridContainer
        {...props}
        intl={props.intl}
        columns={modifiedColumns()}
        filterButtonVariant="alternative"
        history={history}
        store={store}
        withoutPageHeader
        remoteExportToExcel
        onExcelExportButtonClick={onExcelExport}
        getCellActions={undefined}
      />
      {excelToExportDialogs.map((dialog, i) => (
        <Dialog
          key={i.toString()}
          type={dialog.type}
          text={{
            approve: t(`${intlKey}.Approved`),
          }}
          icon={dialog.icon}
          message={dialog.message}
          isOpen={dialog.isOpen}
          onApprove={dialog.onApprove}
          isLoading={dialog.isLoading}
          showCloseButton={dialog.showCloseButton}
          onCancel={dialog.onCancel}
        />
      ))}
    </>
  );
};

export default injectIntl(GenericDataGrid);
