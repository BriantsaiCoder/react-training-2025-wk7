import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useCart from '../../hook/useCart';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addCart } = useCart({ autoFetch: false });

  useEffect(() => {
    const getProductById = async (id) => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error('取得產品資料失敗', error);
      }
    };
    getProductById(id);
  }, [id]);
  return !product ? (
    <div>沒有可用的產品資料。</div>
  ) : (
    <div className='container mt-4'>
      <div className='card' style={{ width: '18rem' }}>
        <img src={product.imageUrl} className='card-img-top' alt={product.title} />
        <div className='card-body'>
          <h5 className='card-title'>{product.title}</h5>
          <p className='card-text'>{product.description}</p>
          <p className='card-text'>
            <strong>分類:</strong> {product.category}
          </p>
          <p className='card-text'>
            <strong>單位:</strong> {product.unit}
          </p>
          <p className='card-text'>
            <strong>原價:</strong> {product.origin_price} 元
          </p>
          <p className='card-text'>
            <strong>現價:</strong> {product.price} 元
          </p>
          <button className='btn btn-primary' onClick={() => addCart(product.id)}>
            立即購買
          </button>
        </div>
      </div>
    </div>
  );
}
export default SingleProduct;
