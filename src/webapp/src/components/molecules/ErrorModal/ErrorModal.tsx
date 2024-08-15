import React from 'react';
import { Flex, Icon } from '@oplog/express';
import ModalBox from '../TouchScreen/ModalBox';

interface ErrorModalProps {
  isOpen: boolean;
  header: string;
  subHeader: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, header, subHeader, children }) => {
  return (
    <ModalBox
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={header}
      subHeaderText={subHeader}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: 'palette.hardBlue_darker',
      }}
      icon={
        <Icon
          name="fal fa-exclamation-circle"
          fontSize="93px"
          color="palette.red_darker"
        />
      }
      data-cy="error-modal"
    >
      {children || ''}
    </ModalBox>
  );
};

export default ErrorModal;
