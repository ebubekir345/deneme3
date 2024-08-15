import { Icon } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

const OrderStatusModal: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useHovPackingStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={packingState.modals.OrderStatus}
      width={575}
      headerText={
        packingState.isMissing
          ? t(`${intlKey}.PackingStation.Order.Missing`)
          : t(`${intlKey}.PackingStation.Order.Cancelled`)
      }
      subHeaderText={t(`${intlKey}.PackingStation.Order.ScanToQuarantine`)}
      icon={
        <Icon
          name="fal fa-exclamation-circle"
          fontSize="93px"
          color="palette.red_darker"
        />
      }
      contentBoxProps={{ padding: '44px', color: 'palette.hardBlue_darker'}}
      data-cy="order-status-modal"
    />
  );
};

export default OrderStatusModal;
