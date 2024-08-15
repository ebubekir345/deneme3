import { Box, Flex } from '@oplog/express'; // Assuming these are correct imports for your project
import lottie from 'lottie-web/build/player/lottie_light';
import React, { useEffect, useRef } from 'react';
// Import the animation data
import loadingAnimation from '../../lotties/loadingAnimation.json'; // Adjust the path as necessary
const Loading: React.FC = () => {
  const lottieContainer = useRef(null); // Use useRef to reference the container for the Lottie animation
  useEffect(() => {
    if (lottieContainer.current) {
      const animationInstance = lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
      });

      return () => {
        animationInstance.destroy();
      };
    }

    // Return undefined if lottieContainer.current is falsy
    return undefined;
  }, []);
  return (
    <Flex flexDirection="column" height="100vh" flexGrow={1} justifyContent="center" alignItems="center">
      <Box ref={lottieContainer} width={140} height={140} />
    </Flex>
  );
};
export default Loading;
