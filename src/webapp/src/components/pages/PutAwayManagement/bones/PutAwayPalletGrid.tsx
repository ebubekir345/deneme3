import { ColumnSize, DataGridRow, FormatterProps, ImageFormatter } from '@oplog/data-grid';
import { Box, formatUtcToLocal, Tooltip } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import {
  PutAwayReceivedItemsOutputDTO,
  PutAwayReceivedPalletItemsExpirationDateOutputDTO,
} from '../../../../services/swagger';
import {
  chipFormatter,
  ChipFormatterProps,
  geti18nName,
  ProductDetailsLinkFormatterForOtherRoutes,
} from '../../../../utils/formatters';
import Badge from '../../../atoms/Badge';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'PutAwayManagement.PutAwayToteGrid';
const titleKey = 'PutAwayManagement.PutAwayToteGrid.Title';

interface IPutAwayPalletGrid {
  palletLabel: string;
}

const PutAwayToteGrid: FC<IPutAwayPalletGrid> = ({ palletLabel }) => {
  const { t } = useTranslation();
  const putAwayPalletGridColumns: Array<any> = [
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
      name: geti18nName('Operation', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => chipFormatter(props),
      getRowMetaData: (row: PutAwayReceivedItemsOutputDTO) => {
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
      name: geti18nName('SKU', t, intlKey),
      key: 'sku',
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
      name: geti18nName('ProductName', t, intlKey),
      key: 'productName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ProductDetailsLinkFormatterForOtherRoutes,
      getRowMetaData: (row: DataGridRow) => row,
    },
    {
      name: geti18nName('ProductImageUrl', t, intlKey),
      key: 'productImageUrl',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: ImageFormatter,
    },
    {
      name: geti18nName('ProductAmount', t, intlKey),
      key: 'productAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Zone', t, intlKey),
      key: 'zoneLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Problem', t, intlKey),
      key: 'hasExpirationDateProblem',
      type: 'boolean',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
      formatter: (props: FormatterProps) => {
        if (props.value) {
          return (
            <Tooltip
              maxWidth={1000}
              action={['hover']}
              withPortal={true}
              followCursor
              content={props.dependentValues.expirationDates.map(
                (i: PutAwayReceivedPalletItemsExpirationDateOutputDTO) => (
                  <Box>
                    {i.amount} {t(`PutAwayManagement.PutAwayToteGrid.Items`)}{' '}
                    {formatUtcToLocal(i.expirationDate as any, 'dd.MM.yyyy')}
                  </Box>
                )
              )}
              placement="bottom"
            >
              <Box width={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                <Badge label={t(`PutAwayManagement.PutAwayManagementWaitingPalletsGrid.Exp`)} bg="palette.red" />
              </Box>
            </Tooltip>
          );
        }
        return '-';
      },
      getRowMetaData: (row: DataGridRow) => row,
    },
  ];

  return (
    <GenericDataGrid
      titleKey={t(titleKey)}
      intlKey={intlKey}
      gridKey={GridType.PutAwayReceivedItemsByPallet}
      columns={putAwayPalletGridColumns}
      predefinedFilters={[]}
      apiArgs={[palletLabel]}
      isModalGrid={true}
      hideHeader
      filtersDisabled
      gridCss={`
      .react-grid-Container .react-grid-Main .react-grid-Grid {
        min-height: 500px !important;
      }
      .react-grid-Header {
        top: 0px !important;
      }
      `}
    />
  );
};

export default PutAwayToteGrid;
