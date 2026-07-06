import { useToastStore } from '@/store/admin/toasts'

export function useToast() {
  const store = useToastStore()

  return {
    success: (msg)  => store.show(msg, 'success'),
    error:   (msg)  => store.show(msg, 'error'),
    warning: (msg)  => store.show(msg, 'warning'),
    info:    (msg)  => store.show(msg, 'info'),
    show:    (msg, type) => store.show(msg, type),
  }
}
