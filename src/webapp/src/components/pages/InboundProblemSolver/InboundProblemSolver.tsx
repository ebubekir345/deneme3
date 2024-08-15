import React, { useEffect } from 'react';
import Grid from '../../atoms/Grid';
import { Flex } from '@oplog/express';
import { useHistory } from 'react-router-dom';
import { ProblemScanStatusColumn } from '../../molecules/TouchScreen';
import useCommonStore from '../../../store/global/commonStore';
import { roles } from '../../../auth/roles';
import { urls } from '../../../routers/urls';
import { ProblemType } from '../../molecules/TouchScreen/ProblemScanStatusColumn';
import { config } from '../../../config';

const InboundProblemSolver: React.FC = () => {
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const history = useHistory();
  useEffect(() => {
    if (auth0UserInfo[config.auth.userRole] && !userHasMinRole(roles.ProblemSolver)) {
      history.push(urls.home);
    }
  }, [auth0UserInfo]);
  return (
    <Grid gridTemplateColumns="460px 1fr" height="100vh" fontFamily="touchScreen" bg="palette.softGrey">
      <ProblemScanStatusColumn type={ProblemType.InboundProblem} />
      <Flex bg="palette.softGrey" width={1} />
    </Grid>
  );
};

export default InboundProblemSolver;
