// utils/logEvent.ts
import { RasMetricType } from "../services/swagger/api";
import { config } from '../config';
import { useDispatch } from "react-redux";

interface LogEventParams {
  metricType: RasMetricType;
  station: string;
  stationType: string;
  toteLabel?: string; 
}

export function logEvent({ metricType, station, stationType, toteLabel }: LogEventParams) {
  const dispatch = useDispatch();
  const logData = {
    MetricType: metricType,
    Time: new Date().toISOString(),
    Station: station,
    StationType: stationType,
    ...(toteLabel && { ToteLabel: toteLabel }),
  };

  const endpoint = `${config.api.url}/api/v1/Ras.rasStationMetric`;


  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
    keepalive: true, 
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Log data sent successfully.');
  })
  .catch(error => console.error('Failed to send log data:', error));
}
