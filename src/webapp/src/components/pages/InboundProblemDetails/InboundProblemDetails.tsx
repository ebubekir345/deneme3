import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { roles } from '../../../auth/roles';
import { config } from '../../../config';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import useCommonStore from '../../../store/global/commonStore';
import Grid from '../../atoms/Grid';
import { ProblemScanStatusColumn } from '../../molecules/TouchScreen';
import { ProblemType } from '../../molecules/TouchScreen/ProblemScanStatusColumn';
import DetailsForInboundProblem from './bones/DetailsForInboundProblem';

const InboundProblemDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: any }>();
  const [{ auth0UserInfo }, { userHasMinRole }] = useCommonStore();
  const history = useHistory();
  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetInboundProblemDetails));
    };
  }, []);

  useEffect(() => {
    if (auth0UserInfo[config.auth.userRole] && !userHasMinRole(roles.ProblemSolver)) {
      history.push(urls.home);
    }
  }, [auth0UserInfo]);

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetInboundProblemDetails, {
        inboundProblemId: decodeURI(id),
      })
    );
  }, [id]);

  return (
    <Grid gridTemplateColumns="460px 1fr" height="100vh" fontFamily="touchScreen" bg="palette.softGrey">
      <ProblemScanStatusColumn type={ProblemType.InboundProblem} />
      <DetailsForInboundProblem />
    </Grid>
  );
};

export default InboundProblemDetails;
