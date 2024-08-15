import React, { ReactNode } from 'react';
import ModalBox from '../TouchScreen/ModalBox';

interface IInfoPopup {
  isOpen: boolean;
  header: string | ReactNode;
  subHeader: string;
  icon: ReactNode;
}

const InfoPopup: React.FC<IInfoPopup> = ({ isOpen, header, subHeader, icon, children }) => {
  return (
    <ModalBox
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={header}
      subHeaderText={subHeader}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: '#767896',
      }}
      icon={icon}
    >
      {children || ''}
    </ModalBox>
  );
};

export default InfoPopup;
