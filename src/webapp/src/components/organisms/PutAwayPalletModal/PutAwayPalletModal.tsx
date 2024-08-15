/* eslint-disable import/no-named-as-default */
import { Flex, Icon, Modal, ModalContent, Panel, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { PalletSummaryOutputDTO } from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import { clearDqbFromUrl } from '../../../utils/url-utils';
import Badge from '../../atoms/Badge';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import PutAwayPalletGrid from '../../pages/PutAwayManagement/bones/PutAwayPalletGrid';

export interface IPutAwayPalletModal {
  palletLabel: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PutAwayToteModal: FC<IPutAwayPalletModal> = ({ palletLabel, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const putAwayPalletDetails: Resource<PalletSummaryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PalletsGetSummary]
  );

  useEffect(() => {
    if (isOpen) dispatch(resourceActions.resourceRequested(ResourceType.PalletsGetSummary, { palletLabel }));
    else history.replace(clearDqbFromUrl(location.pathname));
  }, [isOpen]);

  const headerContent = () => {
    const productCount = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-tags" fontSize={16} />
        <Text ml={16}>{putAwayPalletDetails?.data?.amount ? putAwayPalletDetails?.data?.amount : 'N/A'}</Text>
      </Flex>
    );
    const zoneProblem = (
      <Badge label={t(`PutAwayManagement.PutAwayManagementWaitingPalletsGrid.ZoneProblem`)} bg="palette.red" />
    );

    const contentArr: JSX.Element[] = [];
    contentArr.push(productCount);
    putAwayPalletDetails?.data?.hasZoneProblem && contentArr.push(zoneProblem);

    return contentArr;
  };

  return (
    <Modal
      showOverlay
      showCloseButton={false}
      maxWidth={1300}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_light"
      boxShadow="none"
    >
      <ModalContent p={24} display="flex" flexDirection="column">
        <ModalFancyHeader
          title={putAwayPalletDetails?.data?.palletLabel || 'N/A'}
          content={headerContent()}
          onClose={() => onClose()}
          isBusy={putAwayPalletDetails?.isBusy}
        />
        <Panel marginTop={12} overflow="auto">
          <PutAwayPalletGrid palletLabel={palletLabel || ''} />
        </Panel>
      </ModalContent>
    </Modal>
  );
};

export default PutAwayToteModal;
