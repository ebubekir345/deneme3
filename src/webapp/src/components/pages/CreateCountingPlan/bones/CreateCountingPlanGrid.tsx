import { ColumnSize } from '@oplog/data-grid';
import { Image, Flex, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridType } from '../../../../models';
import { geti18nName } from '../../../../utils/formatters';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'CreateCountingPlan.Grid';
const titleKey = 'CreateCountingPlan.Grid.Title';

const CreateCountingPlanGrid: React.FC = () => {
  const { t } = useTranslation();
  const createCountingPlanGridColumns: Array<any> = [
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
      name: geti18nName('AddressLabel', t, intlKey),
      key: 'addressLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ZoneLabel', t, intlKey),
      key: 'zoneLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CellLabel', t, intlKey),
      key: 'cellLabel',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Section', t, intlKey),
      key: 'section',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Side', t, intlKey),
      key: 'side',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Level', t, intlKey),
      key: 'level',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('OperationName', t, intlKey),
      key: 'operationName',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('ProductSKU', t, intlKey),
      key: 'productSKU',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('Amount', t, intlKey),
      key: 'amount',
      type: 'number',
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
      gridKey={GridType.CreateStockCountingPlan}
      columns={createCountingPlanGridColumns}
      predefinedFilters={[]}
      noRowsView={() => (
        <Flex flexDirection="column" alignItems="center">
          <Image width={471} height={351} src="/images/create-cargo-plan.png" alt="create-cargo-plan" />
          <Text color="#4A4A4A" fontWeight={600} fontSize={12} mt={32}>
            {t(`${intlKey}.EmptyFilterMessage`)}
          </Text>
        </Flex>
      )}
    />
  );
};

export default CreateCountingPlanGrid;
