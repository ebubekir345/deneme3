import React, { useCallback, useEffect, useRef } from 'react';
import { Flex, Box } from '@oplog/express';
import lottie from 'lottie-web/build/player/lottie_light';

import BarcodeIcon, { StatusEnum } from './BarcodeIcon';

export interface IScanStatusBox {
  status: StatusEnum;
}

const ScanStatusBox: React.FC<IScanStatusBox> = ({ children, status }) => {
  const lottieContainer = useRef<any>(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // eslint-disable-next-line global-require
      animationData: require('../../../../lotties/loadingAnimation.json'),
    });
  }, [status]);

  const selectBoxShadow = useCallback(
    (arg: StatusEnum) => {
      switch (arg) {
        case StatusEnum.Success:
          return '0 0 20px palette.hardGreen';
        case StatusEnum.Cancelled:
          return '0 0 20px palette.red_darker';
        case StatusEnum.WrongBarcode:
          return '0 0 20px palette.red_darker';
        case StatusEnum.ShipmentFailure:
          return '0 0 20px palette.orange_darker';
        default:
          return 'none';
      }
    },
    [status]
  );
  return (
    <Flex
      minHeight={612}
      width={1}
      px={30}
      py={45}
      borderRadius={8}
      bg="palette.softGrey"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      transition="0.5s ease"
      boxShadow={selectBoxShadow(status)}
    >
      {status === StatusEnum.Loading ? (
        <Box ref={lottieContainer} width={120} height={120} data-testid="lottieAnimation" />
      ) : (
        <BarcodeIcon status={status} />
      )}
      {children}
    </Flex>
  );
};

export default ScanStatusBox;
