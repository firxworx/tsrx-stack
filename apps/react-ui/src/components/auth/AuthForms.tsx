import type { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { zAuthPasswordCredentials } from '@rfx/common-data'
import { isRecord } from '@rfx/common-toolbox'
import { cn, FormInputField, Spinner, Button, useToast } from '@rfx/react-core'

import { apiQuery } from '../../api/query-client'
import { QUERY_KEYS } from '../../api/query-keys'

export interface AuthSignInFormProps {
  onSignInSuccess?: () => void
}

export interface AuthSignInForm extends z.infer<typeof zAuthPasswordCredentials> {}
export interface AuthSignInFormValues extends z.output<typeof zAuthPasswordCredentials> {}

const defaultSignInFormValues: AuthSignInFormValues = {
  email: '',
  password: '',
}

export function AuthSignInForm({ onSignInSuccess }: AuthSignInFormProps): JSX.Element {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    handleSubmit: registerForm,
    register,
    formState: { errors },
    reset,
  } = useForm<AuthSignInForm, AuthSignInFormValues>({
    resolver: zodResolver(zAuthPasswordCredentials),
    defaultValues: defaultSignInFormValues,
  })

  const {
    mutateAsync: signInAsync,
    isLoading,
    isError,
    error,
  } = apiQuery.auth.signIn.useMutation({
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.SESSION, data)
      queryClient.invalidateQueries(QUERY_KEYS.AUTH.SESSION)

      toast({ title: 'Success', description: `Welcome ${data.body.name}` })
      reset()
      onSignInSuccess?.()
    },
    onError: (_data, _vars, _context) => {
      toast({ title: 'Error', description: 'Authentication failed', variant: 'destructive' })
    },
  })

  const handleSignInSubmit: SubmitHandler<AuthSignInFormValues> = async (credentials): Promise<void> => {
    try {
      const response = await signInAsync({
        body: credentials,
      })

      queryClient.setQueryData(['auth', 'session'], response.body)
    } catch (error) {
      console.error('Sign In Error:', error)
    }
  }

  const serverError = error && isRecord(error.body) && 'message' in error.body && error.body?.['message']

  return (
    <form noValidate className="grid grid-cols-1 gap-3 xs:gap-4" onSubmit={registerForm(handleSignInSubmit)}>
      <div className="grid grid-cols-1 gap-3 xs:gap-4">
        <FormInputField type="email" {...register('email')} error={errors?.['email']?.message?.toString()} />
        <FormInputField type="password" {...register('password')} error={errors?.['password']?.message?.toString()} />
      </div>
      <div className="flex justify-end items-center pt-2">
        <Spinner className={cn('mr-3', isLoading ? 'block' : 'hidden')} size="sm" />
        <Button type="submit" disabled={isLoading}>
          Sign In
        </Button>
      </div>
      {isError && (
        <div className="flex p-2 gap-2 items-center rounded-md text-red-800 bg-red-100">
          <span className="py-1 px-2 bg-red-200 rounded-md leading-none text-xs">ERROR</span>
          <span className="pb-0.5 px-0 text-sm">{String(serverError || '')}</span>
        </div>
      )}
    </form>
  )
}
