import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import Grid from '../../atoms/Grid';
import DetailsColumn from './bones/DetailsColumn';
import { ProblemScanStatusColumn } from '../../molecules/TouchScreen';
import { StoreState } from '../../../store/initState';
import { GetSalesOrderDetailsForProblemOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { roles } from '../../../auth/roles';
import { urls } from '../../../routers/urls';
import { ProblemType } from '../../molecules/TouchScreen/ProblemScanStatusColumn';
import { config } from '../../../config';
import useProblemSolverStore from '../../../store/global/problemSolverStore';
import { DiscriminatorTypes } from '../../molecules/TouchScreen/StationBox';

const ProblemDetails: React.FC = () => {
  const dispatch = useDispatch();
  let { id } = useParams<{ id: any }>();
  id = decodeURI(id);
  const [{ auth0UserInfo }, { userHasRole }] = useCommonStore();
  const [{ station }, { setStation }] = useProblemSolverStore();
  const history = useHistory();
  const problemDetails: Resource<GetSalesOrderDetailsForProblemOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetProblemDetails]
  );

  useEffect(() => {
    const stationString = localStorage.getItem('stationAddress');
    const stationObject = typeof stationString === 'string' ? JSON.parse(stationString) : undefined;
    if (stationObject && stationObject.discriminator === DiscriminatorTypes.ProblemSolverAddress) {
      setStation(stationObject);
    } else {
      history.push(urls.stationLogin);
    }
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetProblemDetails));
    };
  }, []);

  // TODO: Fix this rerouting mechanism
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
  }, [auth0UserInfo]);

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetProblemDetails, {
        problemReferenceNumber: id,
      })
    );
  }, [id]);
  useEffect(() => {
    if (problemDetails?.isSuccess) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetSalesOrderStateDetail, {
          payload: problemDetails?.data?.salesOrderId,
        })
      );
    }
  }, [problemDetails]);
  return (
    <Grid gridTemplateColumns="460px 1fr" height="100vh" fontFamily="touchScreen" bg="palette.softGrey">
      <ProblemScanStatusColumn type={ProblemType.SalesOrderProblem} />
      <DetailsColumn />
    </Grid>
  );
};

export default ProblemDetails;
