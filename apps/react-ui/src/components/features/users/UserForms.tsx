import React, { useState } from 'react'
import { useForm, type SubmitHandler, FormProvider, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { PencilIcon, UsersIcon, XIcon } from 'lucide-react'

import { zCreateUserDto, zUpdateUserDto, type UserDto } from '@rfx/common-data'
import { isRecord } from '@rfx/common-toolbox'

import { apiQuery } from '../../../api/query-client'
import { Button, Spinner, Modal, useToast, FormSelectField, cn, FormInputField } from '@rfx/react-core'

import { getErrorMessage } from '../../../lib/error-utils'

export interface CreateUserFormProps {
  hasTitle?: boolean
  hasBorder?: boolean
  onSubmitSuccess?: () => void
}

export interface CreateUserFormModalTriggerProps {}

export interface EditUserFormProps {
  user: UserDto
  hasTitle?: boolean
  hasBorder?: boolean
  onSubmitSuccess?: () => void
}

export interface EditUserFormModalTriggerProps {
  user: UserDto
}

export interface DeleteUserButtonProps {
  userUid: string
  className?: string
  onDeleteSuccess?: () => void
}

export interface CreateUserForm extends z.infer<typeof zCreateUserDto> {}
export interface CreateUserFormValues extends z.output<typeof zCreateUserDto> {}

export interface UpdateUserForm extends z.infer<typeof zUpdateUserDto> {}
export interface UpdateUserFormValues extends z.output<typeof zUpdateUserDto> {}

export interface UserFormFieldsProps {
  formContext: 'create' | 'update'
}

export function CreateUserForm({
  hasTitle = true,
  hasBorder = true,
  onSubmitSuccess,
}: CreateUserFormProps): JSX.Element {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const reactHookForm = useForm<CreateUserForm, CreateUserFormValues>({
    resolver: zodResolver(zCreateUserDto),
  })

  const { handleSubmit: registerForm, reset } = reactHookForm

  const {
    mutateAsync: createUserAsync,
    isLoading,
    isError,
    error,
  } = apiQuery.users.create.useMutation({
    onSuccess: (data) => {
      toast({ title: 'Success', description: `Created user ${data.body.email}` })

      reset() // resets the form to blank/initial values
      onSubmitSuccess?.()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleFormSubmit: SubmitHandler<CreateUserFormValues> = async (data) => {
    await createUserAsync({ body: data })
  }

  const serverError = error && isRecord(error.body) && 'message' in error.body && error.body?.['message']

  return (
    <div
      className={cn('max-w-lg', {
        ['p-4 sm:p-6 rounded-md border bg-white border-slate-300']: !!hasBorder,
        ['']: !hasBorder,
      })}
    >
      <FormProvider {...reactHookForm}>
        <form onSubmit={registerForm(handleFormSubmit)} className="grid grid-cols-1 gap-4">
          {hasTitle ? <h2 className="font-semibold">Add New User</h2> : null}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
            <UserFormFields formContext="create" />
          </div>
          <div className="flex justify-end items-center pt-2">
            <Spinner className={cn('mr-3', isLoading ? 'block' : 'hidden')} size="sm" />
            <Button type="submit" disabled={isLoading}>
              Save User
            </Button>
          </div>
          {isError && (
            <div className="flex gap-2 items-center text-red-800">
              <span className="py-1 px-2 bg-red-200 rounded-sm leading-none text-xs">ERROR</span>
              <span className="pb-0.5 px-0 text-sm">{String(serverError || '')}</span>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export function EditUserForm({
  user,
  hasTitle = true,
  hasBorder = true,
  onSubmitSuccess,
}: EditUserFormProps): JSX.Element {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const reactHookForm = useForm<CreateUserForm, CreateUserFormValues>({
    resolver: zodResolver(zUpdateUserDto),
    defaultValues: user,
  })

  const { handleSubmit: registerForm, reset } = reactHookForm

  const {
    mutateAsync: updateUserAsync,
    isLoading,
    error,
    isError,
  } = apiQuery.users.update.useMutation({
    onSuccess: (data) => {
      // ensure the rendered form values are in sync with the recent server response
      reset(data.body)

      toast({ title: 'Saved', description: `Saved user ${data.body.email}` })
      onSubmitSuccess?.()
    },
    onError: (error, _vars, _ctx) => {
      toast({ title: 'Error', description: `Error saving user: ${getErrorMessage(error)}` })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleFormSubmit: SubmitHandler<UpdateUserFormValues> = async (data) => {
    await updateUserAsync({ body: data, params: { uid: user.uid } })
  }

  const serverError = error && isRecord(error.body) && 'message' in error.body && error.body?.['message']

  return (
    <div
      className={cn('max-w-lg', {
        ['p-4 sm:p-6 rounded-md border bg-white border-slate-300']: !!hasBorder,
        ['']: !hasBorder,
      })}
    >
      <FormProvider {...reactHookForm}>
        <form onSubmit={registerForm(handleFormSubmit)} className="grid grid-cols-1 gap-4">
          {hasTitle ? <h2 className="font-semibold">Edit User</h2> : null}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
            <UserFormFields formContext="update" />
          </div>
          <div className="flex justify-end items-center pt-2">
            <Spinner className={cn('mr-3', isLoading ? 'block' : 'hidden')} size="sm" />
            <Button type="submit" disabled={isLoading}>
              Save User
            </Button>
          </div>
          {isError && (
            <div className="flex gap-2 items-center text-red-800">
              <span className="py-1 px-2 bg-red-200 rounded-sm leading-none text-xs">ERROR</span>
              <span className="pb-0.5 px-0 text-sm">{String(serverError || '')}</span>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export const CreateUserFormModalTrigger = React.memo(function CreateUserFormModalTrigger(
  _props: CreateUserFormModalTriggerProps,
): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Button asChild>
        <Button variant="primary" className="group">
          <UsersIcon className="inline-block h-3 w-3 xs:h-4 xs:w-4 mr-2" />
          <span>Add User</span>
        </Button>
      </Modal.Button>
      <Modal.Content title="Create User">
        <CreateUserForm hasTitle={false} hasBorder={false} onSubmitSuccess={() => setIsModalOpen(false)} />
      </Modal.Content>
    </Modal>
  )
})

export const EditUserFormModalTrigger = React.memo(function EditUserFormModalTrigger({
  user,
}: EditUserFormModalTriggerProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Button asChild>
        <Button variant="toolbar" className="group rounded p-2 hover:bg-slate-100 transition-colors">
          <span className="sr-only">Edit User</span>
          <PencilIcon
            className="h-5 w-5 text-slate-400 group-hover:text-sky-800 transition-colors"
            aria-hidden="true"
          />
        </Button>
      </Modal.Button>
      <Modal.Content title="Edit User">
        <EditUserForm user={user} hasTitle={false} hasBorder={false} onSubmitSuccess={() => setIsModalOpen(false)} />
      </Modal.Content>
    </Modal>
  )
})

export function UserFormFields({ formContext }: UserFormFieldsProps): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const zDto = formContext === 'create' ? zCreateUserDto : zUpdateUserDto
  type Dto = z.infer<typeof zDto>

  return (
    <>
      {Object.keys(zDto.shape).map((key) =>
        key === 'role' ? (
          <FormSelectField
            key={key}
            error={errors?.[key as keyof Dto]?.message?.toString()}
            options={[
              ['user', 'User'],
              ['admin', 'Admin'],
            ]}
            {...register(key as keyof Dto)}
          />
        ) : (
          <FormInputField
            key={key}
            type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
            {...register(key as keyof Dto)}
            error={errors?.[key as keyof Dto]?.message?.toString()}
          />
        ),
      )}
    </>
  )
}

export function DeleteUserButton({ userUid, className, onDeleteSuccess }: DeleteUserButtonProps): JSX.Element {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate: deleteUser } = apiQuery.users.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])

      toast({ title: 'Success', description: 'User deleted' })
      onDeleteSuccess?.()
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Error deleting user: ${getErrorMessage(error)}` })
    },
  })

  return (
    <Button
      variant="toolbar"
      className={className}
      onClick={() =>
        deleteUser({
          params: { uid: userUid },
          body: {}, // @todo @temp workaround for https://github.com/ts-rest/ts-rest/issues/383
        })
      }
    >
      <span className="sr-only">Delete User</span>
      <XIcon className="w-5 h-5 text-slate-400 group-hover:text-red-800/70 transition-colors" aria-hidden="true" />
    </Button>
  )
}
