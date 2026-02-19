import { useNavigate } from 'react-router';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`);
      console.log('登出成功:', response.data);
      // 刪除 hexToken cookie（將過期時間設為過去）
      document.cookie = `hexToken=;expires=${new Date(0).toUTCString()};path=/`;
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
