import { Outlet, Link } from 'react-router';
function FrontendLayout() {
  return (
    <div>
      <nav className='navbar navbar-expand navbar-dark bg-dark px-3'>
        <Link className='navbar-brand' to='/'>
          我的網站
        </Link>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <Link className='nav-link' to='/'>
              首頁
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/product'>
              產品列表
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/cart'>
              購物車
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/checkout'>
              結帳
            </Link>
          </li>
        </ul>
        <Link className='btn btn-outline-light btn-sm ms-auto' to='/login'>
          登入
        </Link>
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

export default FrontendLayout;
