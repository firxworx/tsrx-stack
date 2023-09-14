import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon } from 'lucide-react'
import { RemoveScroll } from 'react-remove-scroll' // this package is used internally by radix-ui

import { useToast } from '../hooks/useToast'
import { cn } from '../utils/style-utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(function ToastViewport({ className, ...props }, ref): JSX.Element {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 gap-y-1',
        'sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        RemoveScroll.classNames.fullWidth, // bumps the toast over so it doesn't jank as bad when modal/dialog is closed
        className,
      )}
      {...props}
    />
  )
})

const toastBaseClassName = cn(
  'group relative flex w-full items-center justify-between pointer-events-auto space-x-2 overflow-hidden',
  'rounded-md border border-slate-300/50 p-4 pr-6 shadow-lg transition-all',
  'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
  'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out',
  'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
  'data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
)

const toastVariants = cva(toastBaseClassName, {
  variants: {
    variant: {
      default: 'border bg-yellow-50 text-slate-800',
      destructive: 'destructive group border-red-300 bg-red-100 text-red-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(function Toast({ className, variant, ...props }, ref): JSX.Element {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
})

const toastActionBaseClassName = cn(
  'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3',
  'text-sm font-medium transition-colors hover:bg-slate-100',
  'focus:outline-none focus:ring-1 focus:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',
  'group-[.destructive]:border-slate-300/40 group-[.destructive]:hover:border-red-200/30',
  'group-[.destructive]:hover:bg-red-100 group-[.destructive]:hover:text-red-800',
  'group-[.destructive]:focus:ring-red-200/50',
)

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(function ToastAction({ className, ...props }, ref) {
  return <ToastPrimitives.Action ref={ref} className={cn(toastActionBaseClassName, className)} {...props} />
})

const toastCloseButtonBaseClassName = cn(
  'absolute right-2 top-2 rounded-md p-2 text-slate-600/50 opacity-0 transition-opacity',
  'hover:text-slate-600 focus:opacity-100 focus:outline-none focus:ring-1',
  'group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50',
  'group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
)

const ToastCloseButton = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(function ToastCloseButton({ className, ...props }, ref) {
  return (
    <ToastPrimitives.Close ref={ref} className={cn(toastCloseButtonBaseClassName, className)} toast-close="" {...props}>
      <XIcon className="h-4 w-4" />
    </ToastPrimitives.Close>
  )
})

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(function ToastTitle({ className, ...props }, ref): JSX.Element {
  return (
    <ToastPrimitives.Title ref={ref} className={cn('text-base font-semibold [&+div]:text-sm', className)} {...props} />
  )
})

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(function ToastDescription({ className, ...props }, ref): JSX.Element {
  return <ToastPrimitives.Description ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
})

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastCloseButton,
  ToastAction,
}

export function Toaster(): JSX.Element {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1.5">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastCloseButton />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
