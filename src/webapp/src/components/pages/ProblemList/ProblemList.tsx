import React, { useEffect } from 'react';
import Grid from '../../atoms/Grid';
import OrderProblemList from './bones/OrderProblemList';
import { useHistory } from 'react-router-dom';
import { ProblemScanStatusColumn } from '../../molecules/TouchScreen';
import useCommonStore from '../../../store/global/commonStore';
import { roles } from '../../../auth/roles';
import { urls } from '../../../routers/urls';
import { ProblemType } from '../../molecules/TouchScreen/ProblemScanStatusColumn';
import { config } from '../../../config';
import useProblemSolverStore from '../../../store/global/problemSolverStore';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';

const ProblemList: React.FC = () => {
  const [{ auth0UserInfo }, { userHasRole }] = useCommonStore();
  const [{ station }, { setStation }] = useProblemSolverStore();
  const history = useHistory();

  useEffect(() => {
    if (
      auth0UserInfo[config.auth.userRole] &&
      !(
        userHasRole(roles.ProblemSolver) ||
        userHasRole(roles.TenantOwner) ||
        userHasRole(roles.SupportAdmin) ||
        userHasRole(roles.TenantAdmin)
      )
    ) {
      history.push(urls.home);
    }
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.ProblemSolverAddress) {
      setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }
  }, [auth0UserInfo]);

  return (
    <Grid gridTemplateColumns="460px 1fr" height="100vh" fontFamily="touchScreen" bg="palette.softGrey">
      <ProblemScanStatusColumn type={ProblemType.SalesOrderProblem} />
      <OrderProblemList />
    </Grid>
  );
};

export default ProblemList;
