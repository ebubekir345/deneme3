import { Box } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { DiscriminatorTypes } from '../TouchScreen/StationBox';

export enum ErrorOverlayRotationX {
  right = 'right',
  left = 'left',
}

export enum ErrorOverlayRotationY {
  top = 'top',
  bottom = 'bottom',
}

interface IErrorOverlay {
  isOpen: boolean;
  delay?: number;
  width?: string | number;
  height?: string | number;
  rotationX?: ErrorOverlayRotationX;
  rotationY?: ErrorOverlayRotationY;
}

const ErrorOverlay = ({ isOpen, delay, width, height, rotationX, rotationY }: IErrorOverlay) => {
  const [isOpenOverlay, setIsOpenOverlay] = useState(isOpen ? isOpen : false);

  useEffect(() => {
    if (isOpen) {
      setIsOpenOverlay(true);

      const stationString = localStorage.getItem('stationAddress');
      const station = stationString ? JSON.parse(stationString) : undefined;

      if ([DiscriminatorTypes.RasStowStation, DiscriminatorTypes.RasPickStation].includes(station.discriminator)) {
        const audio = new Audio('/sounds/Error.mp3');
        audio.play();
      } else
        Array.from({ length: 3 }).forEach((_, i) =>
          setTimeout(() => {
            const audio = new Audio('/sounds/wrong-barcode-scanned.wav');
            audio.play();
          }, i * 1000)
        );

      setTimeout(
        () => {
          setIsOpenOverlay(false);
        },
        delay ? delay * 1000 : 3000
      );
    } else {
      setIsOpenOverlay(false);
    }
  }, [isOpen]);

  return (
    <>
      {isOpenOverlay && (
        <Box
          style={{
            right: rotationX === ErrorOverlayRotationX.right && (0 as any),
            bottom: rotationY === ErrorOverlayRotationY.bottom && (0 as any),
          }}
          width={width ? width : '100vw'}
          height={height ? height : '100vh'}
          backgroundColor="palette.red_darker"
          opacity="0.7"
          position="absolute"
          zIndex="1"
        />
      )}
    </>
  );
};

export default ErrorOverlay;
