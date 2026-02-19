import { useState } from 'react';
import axios from 'axios';
import { currency } from '../../Utils/filter';
import { emailRules, nameRules, telRules, addressRules } from '../../Utils/checkoutValidation';
import { useForm } from 'react-hook-form';
import { RotatingLines } from 'react-loader-spinner';
import useMessage from '../../hook/useMessage';
import useCart from '../../hook/useCart';
import useProducts from '../../hook/useProducts';
import useBootstrapModal from '../../hook/useBootstrapModal';
import SingleProductModal from '../../Components/SingleProductModal';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const { showSuccess, showError } = useMessage();
  const { cart, loadingCartId, addCart, updateCart, deleteCart, deleteCartAll, getCart } = useCart();
  const { products } = useProducts();
  const { show: showProductModal, hide: hideProductModal } = useBootstrapModal('productModal');

  const [product, setProduct] = useState({});
  const [loadingProductId, setLoadingProductId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  // 取得單一產品資料並開啟 Modal
  const handleSingleProductOverview = async (id) => {
    setLoadingProductId(id);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error('取得產品資料失敗', error);
    } finally {
      setLoadingProductId(null);
    }
    showProductModal();
  };

  const closeProductModal = () => hideProductModal();

  // 訂單送出
  const handleOrder = async (formData) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/order`;
      const data = {
        user: formData,
        message: formData.message,
      };
      await axios.post(url, { data });
      getCart();
      showSuccess('訂單送出成功！');
    } catch (error) {
      console.error(error);
      showError('訂單送出失敗！');
    }
  };

  return (
    // src/views/front/Checkout.jsx
    <div className='container'>
      {/* 產品列表 */}
      <table className='table align-middle'>
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td style={{ width: '200px' }}>
                <div
                  style={{
                    height: '100px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className='h6'>原價：{currency(product.origin_price)}</del>
                <div className='h5'>特價：{currency(product.price)}</div>
              </td>
              <td>
                <div className='btn-group btn-group-sm'>
                  <button
                    type='button'
                    className='btn btn-outline-secondary'
                    onClick={() => handleSingleProductOverview(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <div className='text-center'>
                        <RotatingLines color='grey' width={80} height={16} />
                      </div>
                    ) : (
                      '查看更多'
                    )}
                  </button>
                  <button
                    type='button'
                    className='btn btn-outline-danger'
                    onClick={() => addCart(product.id, 1)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <div className='text-center'>
                        <RotatingLines color='grey' width={80} height={16} />
                      </div>
                    ) : (
                      '加到購物車'
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>購物車列表</h2>
      <div className='text-end mt-4'>
        <button type='button' className='btn btn-outline-danger' onClick={() => deleteCartAll()}>
          清空購物車
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'></th>
            <th scope='col'>品名</th>
            <th scope='col'>數量/單位</th>
            <th scope='col'>小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button type='button' className='btn btn-outline-danger btn-sm' onClick={() => deleteCart(cartItem.id)}>
                  刪除
                </button>
              </td>
              <th scope='row'>{cartItem.product.title}</th>
              <td>
                <div className='input-group input-group-sm mb-3'>
                  <input
                    type='number'
                    className='form-control'
                    aria-label='Sizing example input'
                    aria-describedby='inputGroup-sizing-sm'
                    value={cartItem.qty}
                    onChange={(e) => updateCart(cartItem.id, cartItem.product_id, Number(e.target.value))}
                  />
                  <span className='input-group-text' id='inputGroup-sizing-sm'>
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className='text-end'>{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className='text-end' colSpan='3'>
              總計
            </td>
            <td className='text-end'>{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
      {/* 結帳頁面 */}
      <div className='my-5 row justify-content-center'>
        <form className='col-md-6' onSubmit={handleSubmit(handleOrder)}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              className='form-control'
              placeholder='例:user@example.com'
              defaultValue='test@gmail.com'
              {...register('email', emailRules)}
            />
            {errors.email && <p className='text-danger'>{errors.email.message}</p>}
          </div>

          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
              收件人姓名
            </label>
            <input
              id='name'
              name='name'
              type='text'
              className='form-control'
              placeholder='例:王小明'
              defaultValue='test'
              {...register('name', nameRules)}
            />
            {errors.name && <p className='text-danger'>{errors.name.message}</p>}
          </div>

          <div className='mb-3'>
            <label htmlFor='tel' className='form-label'>
              收件人電話
            </label>
            <input
              id='tel'
              name='tel'
              type='tel'
              className='form-control'
              placeholder='例:0912345678'
              defaultValue='0912346768'
              {...register('tel', telRules)}
            />
            {errors.tel && <p className='text-danger'>{errors.tel.message}</p>}
          </div>

          <div className='mb-3'>
            <label htmlFor='address' className='form-label'>
              收件人地址
            </label>
            <input
              id='address'
              name='address'
              type='text'
              className='form-control'
              placeholder='例:臺北市信義區信義路五段7號'
              defaultValue='kaohsiung'
              {...register('address', addressRules)}
            />
            {errors.address && <p className='text-danger'>{errors.address.message}</p>}
          </div>

          <div className='mb-3'>
            <label htmlFor='message' className='form-label'>
              留言
            </label>
            <textarea id='message' className='form-control' cols='30' rows='10' {...register('message')}></textarea>
          </div>
          <div className='text-end'>
            <button type='submit' className='btn btn-danger'>
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <SingleProductModal product={product} addCart={addCart} closeModal={closeProductModal} />
    </div>
  );
}

export default Checkout;
