import { useRef, useEffect } from 'react';
import * as bootstrap from 'bootstrap';

/**
 * useBootstrapModal
 * 封裝 Bootstrap Modal 初始化與控制
 * @param {string} modalId - Modal 的 DOM id（不含 #）
 */
export default function useBootstrapModal(modalId) {
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current = new bootstrap.Modal(`#${modalId}`, { keyboard: false });

    const modalEl = document.querySelector(`#${modalId}`);
    if (modalEl) {
      modalEl.addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    }
  }, [modalId]);

  const show = () => modalRef.current?.show();
  const hide = () => modalRef.current?.hide();

  return { modalRef, show, hide };
}
