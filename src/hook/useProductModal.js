import { useState } from 'react';
import axios from 'axios';
import useMessage from './useMessage';
import useBootstrapModal from './useBootstrapModal';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export const INITIAL_TEMPLATE_DATA = {
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

/**
 * useProductModal
 * 封裝後台產品 Modal 的所有狀態與操作
 * @param {Function} onDataChange - 資料異動後的回呼（通常是重新取得產品列表）
 */
export default function useProductModal(onDataChange) {
  const [modalType, setModalType] = useState('');
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);
  const { show, hide } = useBootstrapModal('productModal');
  const { showSuccess, showError } = useMessage();

  // 表單輸入處理
  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 圖片上傳處理
  const handleModalFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file-to-upload', file);
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
      setTemplateData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  // 副圖網址輸入處理
  const handleImageChange = (index, value) => {
    setTemplateData((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages[index] = value;
      if (value !== '' && index === newImages.length - 1 && newImages.length < 5) {
        newImages.push('');
      }
      if (value === '' && newImages.length > 1 && newImages[newImages.length - 1] === '') {
        newImages.pop();
      }
      return { ...prev, imagesUrl: newImages };
    });
  };

  // 新增副圖欄位
  const handleAddImage = () => {
    setTemplateData((prev) => ({ ...prev, imagesUrl: [...prev.imagesUrl, ''] }));
  };

  // 移除最後一個副圖欄位
  const handleRemoveImage = () => {
    setTemplateData((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages.pop();
      return { ...prev, imagesUrl: newImages };
    });
  };

  // 開啟 Modal
  const openModal = (product, type) => {
    setTemplateData((prev) => ({ ...prev, ...product }));
    setModalType(type);
    show();
  };

  // 關閉 Modal
  const closeModal = () => hide();

  // 新增 / 更新產品
  const updateProductData = async (id) => {
    const isEdit = modalType === 'edit';
    const url = isEdit
      ? `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      : `${API_BASE}/api/${API_PATH}/admin/product`;

    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: templateData.imagesUrl.filter((url) => url !== ''),
      },
    };

    try {
      if (isEdit) {
        await axios.put(url, productData);
        showSuccess('產品更新成功！');
      } else {
        await axios.post(url, productData);
        showSuccess('產品新增成功！');
      }
      closeModal();
      onDataChange?.();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      showError(`${isEdit ? '更新' : '新增'}失敗：${errorMsg}`);
    }
  };

  // 刪除產品
  const deleteProductData = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      showSuccess('產品刪除成功！');
      closeModal();
      onDataChange?.();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      showError(`刪除失敗：${errorMsg}`);
    }
  };

  return {
    modalType,
    templateData,
    INITIAL_TEMPLATE_DATA,
    handleModalInputChange,
    handleModalFileChange,
    handleImageChange,
    handleAddImage,
    handleRemoveImage,
    openModal,
    closeModal,
    updateProductData,
    deleteProductData,
  };
}
