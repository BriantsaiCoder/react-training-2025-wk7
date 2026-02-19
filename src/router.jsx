// src/router.jsx
import { createHashRouter } from 'react-router';
import FrontendLayout from './Layout/FrontendLayout';
import Home from './Views/front/Home';
import Products from './Views/front/Products';
import SingleProduct from './Views/front/SingleProduct';
import Cart from './Views/front/Cart';
import Checkout from './Views/front/Checkout';
import NotFound from './Views/front/NotFound';
import AdminProducts from './Views/admin/AdminProducts';
import AdminOrders from './Views/admin/AdminOrders';
import Login from './Views/Login';
import AdminLayout from './Layout/AdminLayout';
import ProtectedRoute from './Components/ProtectedRoute';


export const router = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true, // 預設首頁
        element: <Home />,
      },
      {
        path: 'product',
        element: <Products />,
      },
      {
        path: 'product/:id', // 動態參數
        element: <SingleProduct />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: '*', // 404 頁面
    element: <NotFound />,
  },
]);
