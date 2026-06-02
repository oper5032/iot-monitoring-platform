import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loginOk, setLoginOk] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const response = await api.get('/api/auth/me');

      if (response.data.res_code === 'success') {
        setLoginOk(true);
      } else {
        setLoginOk(false);
      }
    } catch (err) {
      console.log(err);
      setLoginOk(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        로그인 확인 중...
      </div>
    );
  }

  if (!loginOk) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;