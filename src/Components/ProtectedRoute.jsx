import { useState, useEffect } from 'react';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router';

const API_BASE = import.meta.env.VITE_API_BASE;

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (err) {
      console.log('權限檢查失敗：', err.response?.data?.message);
      setIsAuth(false);
    } finally {
      setLoading(false); // 無論成功或失敗都結束載入
    }
  };

  useEffect(() => {
    // 檢查登入狀態
    const token = Cookies.get('hexToken');
    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }
    // 路由守衛的實際驗證點
    checkAdmin();
  }, []);

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <RotatingLines />
      </div>
    ); // 載入中，避免跳轉
  if (!isAuth) return <Navigate to='/login' />;

  return children;
}

export default ProtectedRoute;
