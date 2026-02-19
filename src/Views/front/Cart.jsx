import { currency } from '../../Utils/filter';
import useCart from '../../hook/useCart';

function Cart() {
  const { cart, updateCart, deleteCart, deleteCartAll } = useCart();

  return (
    // src/views/front/Cart.jsx
    <div className='container'>
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
                    defaultValue={cartItem.qty}
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
    </div>
  );
}

export default Cart;
