import { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  return (
    <div className="toast">
      <div className={`toast-inner ${type}`}>
        <span>{icon}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16 }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const ToastContainer = () => (
    <div style={{ position: 'fixed', top: 70, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};

export default Toast;
