import { Flex } from '@oplog/express';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { urls } from '../../../routers/urls';
import useProblemSolverStore from '../../../store/global/problemSolverStore';
import Grid from '../../atoms/Grid';
import { ProblemScanStatusColumn } from '../../molecules/TouchScreen';
import { ProblemType } from '../../molecules/TouchScreen/ProblemScanStatusColumn';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';

const ProblemSolver: React.FC = () => {
  const [, { setStation }] = useProblemSolverStore();
  const history = useHistory();
  useEffect(() => {
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.ProblemSolverAddress) {
      setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }
  }, []);
  return (
    <Grid gridTemplateColumns="460px 1fr" height="100vh" fontFamily="touchScreen" bg="palette.softGrey">
      <ProblemScanStatusColumn type={ProblemType.SalesOrderProblem} />
      <Flex bg="palette.softGrey" width={1} />
    </Grid>
  );
};

export default ProblemSolver;
