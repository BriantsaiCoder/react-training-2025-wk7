import { Outlet, Link } from 'react-router';
import useLogout from '../hook/useLogout';

function AdminLayout() {
  const { logout } = useLogout();

  return (
    <div>
      <nav className='navbar navbar-expand navbar-dark bg-dark px-3'>
        <Link className='navbar-brand' to='/admin/products'>
          後台管理系統
        </Link>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <Link className='nav-link' to='/admin/products'>
              產品列表
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/admin/orders'>
              訂單列表
            </Link>
          </li>
        </ul>
        <button className='btn btn-outline-light btn-sm ms-auto' onClick={logout}>
          登出
        </button>
      </nav>
      <main className='container py-4'>
        <Outlet />
      </main>
      <footer className='mt-5 text-center text-muted'>
        <p>© 2026 我的網站</p>
      </footer>
    </div>
  );
}

export default AdminLayout;
