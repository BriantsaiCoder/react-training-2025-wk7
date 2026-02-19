import { Outlet, Link } from 'react-router';
function AdminLayout() {
  return (
    <div>
      <header>
        <ul className='nav'>
          <li className='nav-item'>
            <Link className='nav-link' to='/admin/products'>
              後台產品列表
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/admin/orders'>
              產品訂單列表
            </Link>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className='mt-5 text-center'>
        <p>© 2026 我的網站</p>
      </footer>
    </div>
  );
}

export default AdminLayout;
