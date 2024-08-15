import { Icon } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

const OrderStatusModal: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [missingItemTransferState] = useMissingItemTransferStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={missingItemTransferState.modals.OrderStatus}
      width={575}
      headerText={t(`${intlKey}.MissingItemTransferStation.Order.Cancelled`)}
      subHeaderText={
        missingItemTransferState.isQuarantineToteInQurantineArea
          ? t(`${intlKey}.MissingItemTransferStation.Order.ScanToQuarantine2`)
          : t(`${intlKey}.MissingItemTransferStation.Order.ScanToQuarantine`)
      }
      icon={<Icon name="fal fa-exclamation-circle" fontSize="93px" color="palette.red_darker" />}
      contentBoxProps={{ p: '44', color: 'palette.hardBlue_darker' }}
      data-cy="order-status-modal"
    />
  );
};

export default OrderStatusModal;
