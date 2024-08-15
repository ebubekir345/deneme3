import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { WallToWallStockCountingPlansOutputDTO } from '../../../../services/swagger';
import useCommonStore from '../../../../store/global/commonStore';
import { StoreState } from '../../../../store/initState';
import { clearDqbFromUrl, onTabChange } from '../../../../utils/url-utils';
import useRouteProps from '../../../../utils/useRouteProps';
import { W2WPlanReportsTabs } from '../W2WPlanReports';

interface IStationEffectTrigger {
  setStockCountingPlans: Function;
  setIsDialogOpen: Function;
  setStockCountingPlanId: Function;
  setIsWarningModalOpen: Function;
  setIsSummaryModalOpen: Function;
  stockCountingPlanId: string;
  tabs: object[];
  getCurrentData: (tab: string) => void;
}

const StationEffectTrigger: FC<IStationEffectTrigger> = ({
  setStockCountingPlans,
  setIsDialogOpen,
  setStockCountingPlanId,
  setIsWarningModalOpen,
  setIsSummaryModalOpen,
  stockCountingPlanId,
  tabs,
  getCurrentData,
}) => {
  const dispatch = useDispatch();
  const { id, tab }: { id: any; tab: any } = useParams();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const getCompletedWallToWallStockCountingPlansResponse: Resource<WallToWallStockCountingPlansOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCompletedWallToWallStockCountingPlans]
  );
  const applyWallToWallStockCountingPlanToStockResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.ApplyWallToWallStockCountingPlanToStock]
  );

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(W2WPlanReportsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    setIsDialogOpen(false);
    setIsSummaryModalOpen(false);
    dispatch(resourceActions.resourceRequested(ResourceType.GetCompletedWallToWallStockCountingPlans));
    const index = Object.values(W2WPlanReportsTabs).findIndex(path => path === location.pathname.split('/')[3]);
    setActiveTab(index === -1 ? 0 : index);
    setTabLength(tabs.length);
    setStockCountingPlanId(id);
    return () => {
      routeProps.history.replace(clearDqbFromUrl(location.pathname));
    };
  }, []);

  useEffect(() => {
    if (getCompletedWallToWallStockCountingPlansResponse?.data?.wallToWallStockCountingPlans) {
      setStockCountingPlans(getCompletedWallToWallStockCountingPlansResponse.data.wallToWallStockCountingPlans);
      setIsDialogOpen(false);
    }
  }, [getCompletedWallToWallStockCountingPlansResponse]);

  useEffect(() => {
    if (applyWallToWallStockCountingPlanToStockResponse?.isSuccess)
      dispatch(resourceActions.resourceRequested(ResourceType.GetCompletedWallToWallStockCountingPlans));
    else if (
      applyWallToWallStockCountingPlanToStockResponse?.error?.code === 400 ||
      applyWallToWallStockCountingPlanToStockResponse?.error?.code === 404
    ) {
      setIsDialogOpen(false);
      setIsWarningModalOpen(true);
    }
  }, [applyWallToWallStockCountingPlanToStockResponse]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    stockCountingPlanId && stockCountingPlanId !== ':id' && getCurrentData(tab);
  }, [location.pathname.split('/')[2]]);

  return <></>;
};

export default StationEffectTrigger;
