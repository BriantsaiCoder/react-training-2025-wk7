import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`);
      console.log('登出成功:', response.data);
      // 刪除 hexToken cookie
      Cookies.remove('hexToken', { path: '/' });
      // 清除 axios 預設授權標頭
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    } catch (error) {
      console.error('登出失敗:', error.response);
      alert('登出失敗，請稍後再試');
    }
  };

  return { logout };
}

export default useLogout;
