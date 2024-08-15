import { Icon, Modal, ModalContent, Panel } from '@oplog/express';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { GridType } from '../../../../models';
import { geti18nName } from '../../../../utils/formatters';
import { clearDqbFromUrl } from '../../../../utils/url-utils';
import GenericDataGrid from '../../../atoms/GenericDataGrid';

const intlKey = 'TrackW2WPlan.SkuModalGrid';
const titleKey = 'TrackW2WPlan.SkuModalGrid.Title';

export interface ISkuModal {
  cellId: string;
  stockCountingPlanId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SkuModal: FC<ISkuModal> = ({ cellId, stockCountingPlanId, isOpen, onClose }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    !isOpen && history.replace(clearDqbFromUrl(location.pathname));
  }, [isOpen]);

  const skuModalGridColumns: Array<any> = [
    {
      name: geti18nName('Barcode', t, intlKey),
      key: 'barcodes',
      type: 'string',
      filterable: true,
      locked: true,
      sortable: false,
      visibility: true,
    },
    {
      name: geti18nName('StockQuantityBeforeCount', t, intlKey),
      key: 'beforeCountingAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('1stCountResult', t, intlKey),
      key: 'firstCountAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('2ndCountResult', t, intlKey),
      key: 'secondCountAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('3rdCountResult', t, intlKey),
      key: 'thirdCountAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('CheckCountResult', t, intlKey),
      key: 'controlCountAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('FinalCountResult', t, intlKey),
      key: 'afterCountingAmount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
    {
      name: geti18nName('NumberOfDamagedItems', t, intlKey),
      key: 'damagedItemCount',
      type: 'number',
      filterable: true,
      locked: true,
      sortable: true,
      visibility: true,
    },
  ];

  return (
    <Modal
      showOverlay
      size="6xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_light"
      boxShadow="none"
      showCloseButton
      closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
    >
      <ModalContent p={24} display="flex" flexDirection="column" mt={32}>
        <Panel marginTop={12} overflowY="overlay" overflowX="hidden">
          <GenericDataGrid
            titleKey={t(titleKey)}
            intlKey={intlKey}
            gridKey={GridType.QueryWallToWallStockCountingProducts}
            columns={skuModalGridColumns}
            predefinedFilters={[]}
            apiArgs={[stockCountingPlanId, cellId]}
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
        </Panel>
      </ModalContent>
    </Modal>
  );
};

export default SkuModal;
