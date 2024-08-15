import definitions, { AppRouteConfigParams } from './definitions';

const routes: Array<AppRouteConfigParams> = Object.keys(definitions).map(k => {
  const route: AppRouteConfigParams = definitions[k];
  route.enabled = route.enabled !== undefined ? route.enabled : true;
  route.protectedRoute = route.protectedRoute !== undefined ? route.protectedRoute : true;
  route.key = route.key ? route.key : route.url.replace('/', '');
  route.scopes = route.scopes ? route.scopes : [];
  route.role = route.role ? route.role : '';
  return route;
});

export { routes };
