import useLogout from '../hook/useLogout';

function LogoutConfirmModal({ show, onClose }) {
  const { logout } = useLogout();

  const handleConfirm = () => {
    onClose();
    logout();
  };

  if (!show) return null;

  return (
    <div className='modal fade show d-block' role='dialog' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>確認登出</h5>
            <button type='button' className='btn-close' onClick={onClose} />
          </div>
          <div className='modal-body'>
            <p className='mb-0'>確定要登出後台管理系統嗎？</p>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={onClose}>
              取消
            </button>
            <button type='button' className='btn btn-danger' onClick={handleConfirm}>
              確認登出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmModal;
