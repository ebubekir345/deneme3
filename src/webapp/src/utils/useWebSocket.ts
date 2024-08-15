import { useEffect, useState } from 'react';
import { default as useWS } from 'react-use-websocket';
import { config } from '../config';

export enum PodMessageType {
  POD_READY = 4,
  CURRENT_PICK = 12,
  POD_LEAVING = 17,
}
export enum SlotButton {
  'alt+g,alt+G',
  'alt+h,alt+H',
  'alt+j,alt+J',
  'alt+k,alt+K',
  'alt+l,alt+L',
  'alt+m,alt+M',
}
export enum MessageTypes {
  TurnOnButtons,
  TurnOffButtons,
  TurnOnAllButtons,
  TurnOffAllButtons,
}
export const slotLimit = 6;
export const terminalWebSocketUrl = config.api.terminalWebSocketUrl;

export default function useWebSocket(webSocketUrl: string) {
  const [data, setData] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const { lastJsonMessage, readyState, sendJsonMessage } = useWS(webSocketUrl, {
    shouldReconnect: closeEvent => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 60000, // 1 minute, if no response is received, the connection will be closed
      interval: 30000, // every 30 seconds, a ping message will be sent
    },
  });
  const sendMessage = (message: any) => {
    sendJsonMessage(message);
  };

  useEffect(() => {
    setData(lastJsonMessage);
    setState(readyState);
  }, [lastJsonMessage, readyState]);

  return [data, state, sendMessage];
}
