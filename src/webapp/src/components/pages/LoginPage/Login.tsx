import React, { useEffect } from 'react';
import { useAuth0 } from '../../../auth/auth0';
import { urls } from '../../../routers/urls';

const Login: React.FC = () => {
  const { loginWithRedirect, loading } = useAuth0();

  useEffect(() => {
    if (!loading) {
      loginWithRedirect({ appState: urls.orderManagement });
    }
  }, [loading]);
  return null;
};
export default Login;
