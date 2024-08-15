import { Flex, Icon } from '@oplog/express';
import React, { useState } from 'react';
import AddNewProblemModal from './AddNewProblemModal';

export interface IAddNewProblemProps {
  salesOrderId: string;
}

export const AddNewProblem: React.FC<IAddNewProblemProps> = ({ salesOrderId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Flex py={64} pr={16} onClick={() => setIsModalOpen(true)} cursor="pointer" data-testid="new-problem-button">
        <Flex
          width={40}
          height={40}
          bg="palette.softBlue"
          justifyContent="center"
          alignItems="center"
          boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.5)"
          borderRadius={10}
        >
          <Icon color="palette.white" name="fal fa-plus" fontSize={12} />
        </Flex>
      </Flex>
      <AddNewProblemModal salesOrderId={salesOrderId} isOpen={isModalOpen} onClose={onModalClose} />
    </>
  );
};

export default AddNewProblem;
