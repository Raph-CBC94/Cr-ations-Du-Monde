import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  const iconForVariant = (variant?: string) => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />;
      case 'destructive':
        return <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />;
      default:
        return <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3">
              {iconForVariant(props.variant)}
              <div className="grid gap-1">
                {title && <ToastTitle className="font-serif text-base">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm leading-relaxed">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="p-4 sm:bottom-6 sm:right-6 sm:top-auto md:max-w-[420px]" />
    </ToastProvider>
  );
}
