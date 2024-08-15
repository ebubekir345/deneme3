import { Button, Flex, FormControl, Modal, ModalHeader, Text, Textarea } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';

const intlKey = 'OrderDetails.OrderDetailsNotesTab';

interface AddNoteModalProps {
  isOpen: boolean;
  setModal: Function;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, setModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id }: { id: any } = useParams();
  const [noteText, setNoteText] = useState('');
  const [isOverCount, setIsOverCount] = useState(true);
  const textLimit = 1000;

  useEffect(() => {
    if (noteText.length > textLimit) {
      setIsOverCount(true);
    } else {
      setIsOverCount(false);
    }
  }, [noteText]);

  const handleSave = () => {
    if (noteText.length > 0) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.CreateSalesOrderNote, {
          params: {
            note: noteText,
            salesOrderId: id,
          },
        })
      );
      handleClear();
    }
  };

  const handleClear = () => {
    setNoteText('');
    setIsOverCount(false);
    setModal(false);
  };

  return (
    <Modal
      onClose={() => handleClear()}
      isOpen={isOpen}
      contentBoxProps={{
        padding: '30',
        color: '#767896',
      }}
      flexDirection="column"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.5,
      }}
    >
      <ModalHeader color="palette.grey" fontWeight="800">
        {t(`${intlKey}.AddNewNote`)}
      </ModalHeader>
      <Flex justifyContent="center" py={14}>
        <FormControl textAlign="left" width={500}>
          <Text textAlign="left" fontWeight={800} fontSize={18}>
            {t(`${intlKey}.NotContent`)}
          </Text>
          <Textarea
            onChange={e => setNoteText(e.target.value)}
            my={12}
            rows={4}
            placeholder={t(`${intlKey}.YouCanAddNoteHere`)}
            borderRadius={8}
            borderColor={isOverCount ? 'palette.red' : 'palette.grey'}
            color={isOverCount ? 'palette.red' : 'palette.grey'}
            resize="none"
          />
          <Flex justifyContent="right">
            <Text
              width="100%"
              textAlign="right"
              fontWeight={400}
              fontSize={10}
              color={isOverCount ? 'palette.red' : 'palette.grey'}
            >
              {noteText.length} / {textLimit}
            </Text>
          </Flex>

          <Flex flexDirection="column">
            <Flex flexDirection="row" justifyContent="center" my={12}>
              <Button kind="outline" variant="light" mr={12} onClick={() => handleClear()}>
                {t(`${intlKey}.CloseModal`)}
              </Button>
              <Button variant="success" onClick={() => handleSave()}>
                {t(`${intlKey}.NoteSaveButton`)}
              </Button>
            </Flex>
          </Flex>
        </FormControl>
      </Flex>
    </Modal>
  );
};

export default AddNoteModal;
