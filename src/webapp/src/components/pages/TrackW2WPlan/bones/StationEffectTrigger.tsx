import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import {
  WallToWallStockCountingCountsOutputDTO,
  WallToWallStockCountingPlansOutputDTO,
} from '../../../../services/swagger';
import useCommonStore from '../../../../store/global/commonStore';
import { StoreState } from '../../../../store/initState';
import { clearDqbFromUrl, onTabChange } from '../../../../utils/url-utils';
import useRouteProps from '../../../../utils/useRouteProps';
import { TrackW2WPlanTabs } from '../TrackW2WPlan';

interface IStationEffectTrigger {
  setStockCountingPlans: Function;
  setIsDialogOpen: Function;
  setStockCountingPlanId: Function;
  setIsRefreshButtonClickable: Function;
  setIsWarningModalOpen: Function;
  isRefreshButtonClickable: boolean;
  stockCountingPlanId: string;
  tabs: object[];
  getCurrentData: (tab: string) => void;
}

const StationEffectTrigger: FC<IStationEffectTrigger> = ({
  setStockCountingPlans,
  setIsDialogOpen,
  setStockCountingPlanId,
  setIsRefreshButtonClickable,
  setIsWarningModalOpen,
  isRefreshButtonClickable,
  stockCountingPlanId,
  tabs,
  getCurrentData,
}) => {
  const dispatch = useDispatch();
  const { id, tab }: { id: any; tab: any } = useParams();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const getAnalyticsResponse: Resource<WallToWallStockCountingCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWallToWallStockCountingCounts]
  );
  const getActiveWallToWallStockCountingPlansResponse: Resource<WallToWallStockCountingPlansOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetActiveWallToWallStockCountingPlans]
  );
  const finishWallToWallStockCountingPlanResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.FinishWallToWallStockCountingPlan]
  );

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(TrackW2WPlanTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    setIsDialogOpen(false);
    dispatch(resourceActions.resourceRequested(ResourceType.GetActiveWallToWallStockCountingPlans));
    const index = Object.values(TrackW2WPlanTabs).findIndex(path => path === location.pathname.split('/')[3]);
    setActiveTab(index === -1 ? 0 : index);
    setTabLength(tabs.length);
    setStockCountingPlanId(id);
    return () => {
      routeProps.history.replace(clearDqbFromUrl(location.pathname));
    };
  }, []);

  useEffect(() => {
    getActiveWallToWallStockCountingPlansResponse?.data?.wallToWallStockCountingPlans &&
      setStockCountingPlans(getActiveWallToWallStockCountingPlansResponse.data.wallToWallStockCountingPlans);
  }, [getActiveWallToWallStockCountingPlansResponse]);

  useEffect(() => {
    getAnalyticsResponse?.isSuccess && stockCountingPlanId && setIsDialogOpen(true);
  }, [getAnalyticsResponse]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!isRefreshButtonClickable) {
      setTimeout(() => {
        setIsRefreshButtonClickable(true);
      }, 5000);
    }
  }, [isRefreshButtonClickable]);

  useEffect(() => {
    stockCountingPlanId && stockCountingPlanId !== ':id' && getCurrentData(tab);
  }, [location.pathname.split('/')[2]]);

  useEffect(() => {
    if (finishWallToWallStockCountingPlanResponse?.isSuccess) {
      setStockCountingPlanId('');
      setStockCountingPlans([]);
      setIsDialogOpen(false);
      dispatch(resourceActions.resourceRequested(ResourceType.GetActiveWallToWallStockCountingPlans));
    } else if (finishWallToWallStockCountingPlanResponse?.error?.code === 400) setIsWarningModalOpen(true);
  }, [finishWallToWallStockCountingPlanResponse]);

  return <></>;
};

export default StationEffectTrigger;
