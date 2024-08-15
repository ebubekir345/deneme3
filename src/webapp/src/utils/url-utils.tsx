import { TabItem } from '@oplog/express';
import { RouterProps } from 'react-router';

export function getRouteParams(props: RouterProps): any {
  const routeProps = props as any;
  if (routeProps && routeProps.match && routeProps.match.params) {
    return routeProps.match.params;
  }
  return undefined;
}

export function getRouteParam(props: RouterProps, key: string): any {
  const routeParams = getRouteParams(props);
  if (routeParams) {
    return routeParams[key];
  }
  return undefined;
}

export function getPathFromUrl(path: string): string {
  if (path) {
    const pieces = path.split('/');
    if (pieces.length > 0) {
      return pieces[pieces.length - 1];
    }
  }

  return '';
}

export function checkRoute(props: RouterProps, route: string) {
  return props && route && props.history.location && props.history.location.pathname === route;
}

export function clearDqbFromUrl(url: string): string {
  const urlPieces = url.split('?');
  if (urlPieces.length > 1) {
    return urlPieces[0];
  }
  return url;
}

export function onTabChange(activeTab: string, routeProps: RouterProps) {
  if (routeProps && routeProps.history.location) {
    const urlPieces = clearDqbFromUrl(routeProps.history.location.pathname).split('/');
    const tabRouteParam = getRouteParam(routeProps, 'tab');
    if (tabRouteParam) {
      const index = urlPieces.findIndex(x => x === tabRouteParam);
      urlPieces[index] = activeTab;
    } else {
      urlPieces.push(activeTab);
    }
    if (urlPieces[urlPieces.length - 1] === undefined) urlPieces[urlPieces.length - 1] = "tab"
    routeProps.history.push(`${urlPieces.join('/')}`);
  }
}

export function onSubTabChange(activeTab: string, routeProps: RouterProps) {
  if (routeProps && routeProps.history.location) {
    const urlPieces = clearDqbFromUrl(routeProps.history.location.pathname).split('/');
    const tabRouteParam = getRouteParam(routeProps, 'subTab');
    if (tabRouteParam) {
      const index = urlPieces.findIndex(x => x === tabRouteParam);
      urlPieces[index] = activeTab;
    } else {
      urlPieces.push(activeTab);
    }
    routeProps.history.push(`${urlPieces.join('/')}`);
  }
}

export function onViewChange(activeView: string, routeProps: RouterProps) {
  if (routeProps && routeProps.history.location) {
    const urlPieces = clearDqbFromUrl(routeProps.history.location.pathname).split('/');
    const viewRouteParam = getRouteParam(routeProps, 'view');
    if (viewRouteParam) {
      const index = urlPieces.findIndex(x => x === viewRouteParam);
      urlPieces[index] = activeView;
    } else {
      urlPieces.push(activeView);
    }
    routeProps.history.push(`${urlPieces.join('/')}`);
  }
}

export function resolveActiveIndex(tabItems: Array<TabItem>, tabIds: any, routeProps: RouterProps) {
  const tabKeys = Object.keys(tabIds);
  let activeTab = tabIds[0];
  const tab = getRouteParam(routeProps, 'tab');
  tabKeys.forEach(tabKey => {
    if (tab === tabIds[tabKey]) {
      activeTab = tabIds[tabKey];
    }
  });

  const activeIndex = tabItems.findIndex(t => t.id === activeTab);
  return activeIndex < 0 ? 0 : activeIndex;
}
