import { Box, Flex, Image } from '@oplog/express';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import lottie from 'lottie-web/build/player/lottie_light';

const intlKey = 'TouchScreen.PackingStation.RightBar';

const LandingPanel: React.FC = () => {
  const { t } = useTranslation();
  const lottieContainer = useRef<any>(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // eslint-disable-next-line global-require
      animationData: require('../../../lotties/scanBarcodeLottieAnimation.json'),
    });
  }, []);

  return (
    <Flex flexGrow={1} justifyContent="center" alignItems="center" flexDirection="column" color="palette.snow_darker">
      <Flex
        width={482}
        height={482}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        position="relative"
      >
        <Box width={1200} height={1200} ref={lottieContainer} position="absolute" opacity={0.15} />
        <Box mb={22} zIndex={1}>
          <Image width={183} height={200} src="/images/picking-tote.png" alt="cargo-package" />
        </Box>
        <Box
          width={230}
          fontSize="26"
          fontWeight={500}
          letterSpacing="negativeLarge"
          zIndex={1}
          textAlign="center"
          data-cy="scan-picking-tote"
        >
          {t(`${intlKey}.ScanPickingTote`)}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LandingPanel;
