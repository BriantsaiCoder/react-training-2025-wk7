import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

/**
 * useProducts
 * 封裝前台產品列表取得邏輯
 */
export default function useProducts() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.error('取得產品資料失敗', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return { products, getProducts };
}
