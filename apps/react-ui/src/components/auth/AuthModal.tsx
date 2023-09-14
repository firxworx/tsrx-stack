import React, { useState } from 'react'
import { LockIcon } from 'lucide-react'

import { AuthSignInForm } from './AuthForms'
import { Modal, Button } from '@rfx/react-core'

export interface AuthModalTriggerProps {}

/**
 * Self-contained auth form modal and trigger button combination. Renders a button that opens the modal.
 */
export const AuthModalTrigger = React.memo(function AuthFormModalTrigger(_props: AuthModalTriggerProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Button asChild>
        <Button variant="nav" className="group">
          <LockIcon className="inline-block h-3 w-3 xs:h-4 xs:w-4 mr-2" />
          <span className="whitespace-nowrap">Sign In</span>
        </Button>
      </Modal.Button>
      <Modal.Content title="Sign In">
        <AuthSignInForm onSignInSuccess={() => setIsModalOpen(false)} />
      </Modal.Content>
    </Modal>
  )
})
