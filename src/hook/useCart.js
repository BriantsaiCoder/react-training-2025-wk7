import { useState, useEffect } from 'react';
import axios from 'axios';
import useMessage from './useMessage';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

/**
 * useCart
 * 封裝購物車相關操作：取得、新增、更新、刪除
 * @param {Object} options - { autoFetch: boolean } 是否在掛載時自動取得購物車
 */
export default function useCart({ autoFetch = true } = {}) {
  const [cart, setCart] = useState([]);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const { showError } = useMessage();

  const getCart = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const response = await axios.get(url);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const data = { product_id: id, qty };
      await axios.post(url, { data });
      getCart();
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoadingCartId(null);
    }
  };

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;
      const data = { product_id: productId, qty };
      await axios.put(url, { data });
      getCart();
    } catch (error) {
      console.log(error.response?.data);
      showError('更新購物車失敗！');
    }
  };

  const deleteCart = async (cartId) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response?.data);
      showError('刪除購物車失敗！');
    }
  };

  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response?.data);
      showError('清空購物車失敗！');
    }
  };

  useEffect(() => {
    if (autoFetch) getCart();
  }, [autoFetch]);

  return { cart, loadingCartId, getCart, addCart, updateCart, deleteCart, deleteCartAll };
}
