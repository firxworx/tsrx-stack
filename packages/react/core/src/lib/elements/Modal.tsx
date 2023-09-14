import { useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '../utils/style-utils'

/*
 * radix-ui note
 * ----------------
 * - radix-ui uses third party react-remove-scroll under the hood to manage scrollbar, lock, etc for modals
 * - this is very intrusive and not customizable -- even radix-ui hacks and adds workarounds on their own website (!)
 * - this package can rewrite the entire body style, add/inject <style> and styles, **and** use !important (!)
 *
 * - this can impact toast notifications, modals, menus (which default to modal behaviour), etc
 *   especially when combied (e.g. a toast that appears to confirm a modal action and the modal is then closed)
 *
 * - in some cases you may find you need to use { RemoveScroll } from 'react-remove-scroll' to fix offset issues:
 *   `import { RemoveScroll } from 'react-remove-scroll'`
 * - for example `RemoveScroll.classNames.zeroRight` will return `right-scroll-bar-position` and can be merged with
 *   component styles as required
 *
 * - radix-ui Dialog isn't particularly flexible with triggering modals nor layered/stacked modals
 * - for production apps it is probably best to use an alternate modal implementation for modals/dialogs
 */

/**
 * Modal/Dialog convenience wrapper of Radix UI Dialog primitives: `@radix-ui/react-dialog`.
 *
 * Unfortunately radix-ui uses 'react-remove-scroll' under the hood which can have issues with scrollbar
 * offset, is _extremely_ intrusive, and not particularly customizable.
 *
 * For now the app's styling has been revised to accommodate the dialog behaviour, including removing the
 * always-on scrollbar. There is still some jank and disappearing backgrounds however this is a consequence of
 * radix-ui's implementation.
 */
export function Modal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}): JSX.Element {
  const handleOpenChange = useCallback(() => {
    // dang this happens too late to influence the modal layout...
    // if (document?.documentElement?.style) {
    //   if (open) {
    //     document.documentElement.style.overflowY = 'scroll'
    //     // document.body.style.marginRight = open ? '0px' : ''
    //   } else {
    //     document.documentElement.style.overflowY = 'auto'
    //     document.body.style.marginRight = open ? '0px' : ''
    //   }
    // }

    onOpenChange?.(!open)
  }, [open, onOpenChange])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      // modal={false} // setting to false is not ideal for a dialog however it resolves scrollbar/offset issues
    >
      {children}
    </Dialog.Root>
  )
}

const overlayClassName = cn(
  'fixed inset-0 bg-black/50',
  'data-[state=closed]:animate-[dialog-overlay-hide_200ms] data-[state=open]:animate-[dialog-overlay-show_200ms]',
)

const contentClassName = cn(
  'fixed left-1/2 top-1/2 p-6 sm:p-8 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md',
  'text-slate-900 shadow bg-white',
  'data-[state=closed]:animate-[dialog-content-hide_200ms]',
  'data-[state=open]:animate-[dialog-content-show_200ms]',
)

function ModalContent({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          overlayClassName,
          // RemoveScroll.classNames.zeroRight // #$@#
        )}
      />
      <Dialog.Content
        className={cn(
          contentClassName,
          // RemoveScroll.classNames.zeroRight // #@!$
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <Dialog.Title className="text-xl font-medium">{title}</Dialog.Title>
          <Dialog.Close className="text-slate-400 hover:text-slate-500">
            <XIcon className="w-5 h-5" />
          </Dialog.Close>
        </div>
        <div>{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

Modal.Button = Dialog.Trigger
Modal.Close = Dialog.Close
Modal.Content = ModalContent
