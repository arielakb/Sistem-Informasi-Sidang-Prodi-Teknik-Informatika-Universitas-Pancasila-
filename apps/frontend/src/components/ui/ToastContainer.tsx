import Toast from './Toast';
import { useToastStore } from '../../stores/toastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
}