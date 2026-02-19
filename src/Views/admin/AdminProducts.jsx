import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import Product_list from '../../Components/Product_list';
import ProductModal from '../../Components/ProductModal';
import { useNavigate } from 'react-router';
import useMessage from '../../hook/useMessage';
// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const INITIAL_TEMPLATE_DATA = {
  id: '',
  title: '',
  category: '',
  origin_price: '',
  price: '',
  unit: '',
  description: '',
  content: '',
  is_enabled: false,
  imageUrl: '',
  imagesUrl: [],
};
function AdminProducts() {
  const navigate = useNavigate();
  // 產品資料狀態
  const [products, setProducts] = useState([]);
  // Modal 控制相關狀態
  const productModalRef = useRef(null);
  const [modalType, setModalType] = useState(''); // "create", "edit", "delete"
  const [pagination, setPagination] = useState({});
  // 產品表單資料模板
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);
  const { showSuccess, showError } = useMessage();

  const handleModalFileChange = async (e) => {
    const url = `${API_BASE}/api/${API_PATH}/admin/upload`;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file-to-upload', file);

      let res = await axios.post(url, formData);
      const uploadedImageUrl = res.data.imageUrl;

      setTemplateData((prevTemplateData) => ({
        ...prevTemplateData,
        imageUrl: uploadedImageUrl,
      }));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  // 表單輸入處理
  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 圖片處理
  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;

      // 填寫最後一個空輸入框時，自動新增空白輸入框
      if (value !== '' && index === newImages.length - 1 && newImages.length < 5) {
        newImages.push('');
      }

      // 清空輸入框時，移除最後的空白輸入框
      if (value === '' && newImages.length > 1 && newImages[newImages.length - 1] === '') {
        newImages.pop();
      }

      return { ...prevData, imagesUrl: newImages };
    });
  };

  // 新增圖片
  const handleAddImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ''],
    }));
  };

  // 移除圖片
  const handleRemoveImage = () => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

  // 檢查登入狀態
  const checkLogin = async () => {
    try {
      // 驗證 Token 是否有效
      const res = await axios.post(`${API_BASE}/api/user/check`);
      const { success } = res.data;
      console.log('Token 驗證結果：', success);
      // 取得產品資料
      getData();
    } catch (error) {
      console.error('Token 驗證失敗：', error.response?.data);
      navigate('/login');
    }
  };
  // 取得產品資料
  const getData = async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      // console.log('產品資料：', response.data);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('取得產品失敗：', err.response?.data?.message);
      showError('產品資料取得失敗！');
    }
  };

  // 新增/更新產品
  const updateProductData = async (id) => {
    // 決定 API 端點和方法
    let url;
    let method;

    if (modalType === 'edit') {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = 'put';
    } else if (modalType === 'create') {
      url = `${API_BASE}/api/${API_PATH}/admin/product`;
      method = 'post';
    }

    // 準備要送出的資料（注意格式！）
    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price), // 轉換為數字
        price: Number(templateData.price), // 轉換為數字
        is_enabled: templateData.is_enabled ? 1 : 0, // 轉換為數字
        imagesUrl: templateData.imagesUrl.filter((url) => url !== ''), // 過濾空白
      },
    };

    try {
      let response;
      if (method === 'put') {
        response = await axios.put(url, productData);
        console.log('產品更新成功：', response.data);
        showSuccess('產品更新成功！');
        // alert('產品更新成功！');
      } else {
        response = await axios.post(url, productData);
        console.log('產品新增成功：', response.data);
          showSuccess('產品新增成功！');
        // alert('產品新增成功！');
      }

      // 關閉 Modal 並重新載入資料
      closeModal();
      getData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error(`${modalType === 'edit' ? '更新' : '新增'}失敗：`, errorMsg);
      showError(`${modalType === 'edit' ? '更新' : '新增'}失敗：${errorMsg}`);
    }
  };
  // 刪除產品
  const deleteProductData = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      console.log('產品刪除成功：', response.data);
      showSuccess('產品刪除成功！');

      // 關閉 Modal 並重新載入資料
      closeModal();
      getData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error('刪除失敗：', errorMsg);
      showError(`刪除失敗：${errorMsg}`);
    }
  };
  useEffect(() => {
    // 從 Cookie 取得 Token
    const token = Cookies.get('hexToken');

    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    document.querySelector('#productModal').addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    checkLogin();
  }, []);
  // 使用 ref 控制 Modal
  // 開啟 Modal 函式
  const openModal = (product, type) => {
    setTemplateData((prevData) => ({
      ...prevData,
      ...product,
    }));

    // 設定 Modal 類型並顯示
    setModalType(type);
    productModalRef.current.show();
  };

  // 關閉 Modal 函式
  const closeModal = () => {
    productModalRef.current.hide();
  };
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
