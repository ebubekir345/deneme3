import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';

const useRouteProps = () => {
  const routeProps = {
    match: useRouteMatch(),
    history: useHistory(),
    location: useLocation()
  }
  return routeProps;
}

export default useRouteProps;