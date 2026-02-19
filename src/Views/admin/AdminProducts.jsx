import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Product_list from '../../Components/Product_list';
import ProductModal from '../../Components/ProductModal';
import { useNavigate } from 'react-router';
import useMessage from '../../hook/useMessage';
import useProductModal from '../../hook/useProductModal';

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const { showError } = useMessage();

  // 取得產品資料
  const getData = async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('取得產品失敗：', err.response?.data?.message);
      showError('產品資料取得失敗！');
    }
  };

  const {
    modalType,
    templateData,
    INITIAL_TEMPLATE_DATA,
    handleModalFileChange,
    handleModalInputChange,
    handleImageChange,
    handleAddImage,
    handleRemoveImage,
    openModal,
    closeModal,
    updateProductData,
    deleteProductData,
  } = useProductModal(getData);

  // 檢查登入狀態
  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      getData();
    } catch (error) {
      console.error('Token 驗證失敗：', error.response?.data);
      navigate('/login');
    }
  };

  useEffect(() => {
    const token = Cookies.get('hexToken');
    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }
    checkLogin();
  }, []);
  return (
    <>
      <Product_list
        products={products}
        openModal={openModal}
        INITIAL_TEMPLATE_DATA={INITIAL_TEMPLATE_DATA}
        pagination={pagination}
        getData={getData}
      />
      <ProductModal
        modalType={modalType}
        templateData={templateData}
        handleModalFileChange={handleModalFileChange}
        handleModalInputChange={handleModalInputChange}
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        deleteProductData={deleteProductData}
        updateProductData={updateProductData}
        closeModal={closeModal}
      />
    </>
  );
}
export default AdminProducts;
