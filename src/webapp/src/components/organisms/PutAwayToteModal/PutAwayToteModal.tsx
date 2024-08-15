/* eslint-disable import/no-named-as-default */
import { Box, Flex, Icon, Modal, ModalContent, Panel, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import { ToteDetailsOutputDTO } from '../../../services/swagger';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import PutAwayToteGrid from '../../pages/PutAwayManagement/bones/PutAwayToteGrid';

export interface IPutAwayToteModal {
  toteLabel: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PutAwayToteModal: React.FC<IPutAwayToteModal> = ({ toteLabel, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const putAwayToteDetails: Resource<ToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPutAwayToteDetails]
  );

  const getPutAwayToteDetails = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetPutAwayToteDetails, params));
  };

  useEffect(() => {
    if (isOpen) {
      getPutAwayToteDetails({ toteLabel });
    }
  }, [isOpen]);

  const headerContent = () => {
    const toteCount = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-tags" fontSize={16} />
        <Text ml={16}>{putAwayToteDetails?.data?.amount ? putAwayToteDetails?.data?.amount : 'N/A'}</Text>
      </Flex>
    );

    const contentArr: JSX.Element[] = [];
    contentArr.push(toteCount);

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
          title={putAwayToteDetails?.data?.toteLabel || 'N/A'}
          content={headerContent()}
          onClose={() => onClose()}
          isBusy={putAwayToteDetails?.isBusy}
        />
        <Panel marginTop={12} overflow="auto">
          <PutAwayToteGrid toteLabel={toteLabel || ''} />
        </Panel>
      </ModalContent>
    </Modal>
  );
};

export default PutAwayToteModal;
