import React, { forwardRef, useId } from 'react'
import clsx from 'clsx'
import { cn } from '../utils/style-utils'

export interface FormSelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  options: [string, string][]
  label?: string
  description?: string
  error?: string
  wrapClassName?: string
}

function capitalizeFirstCharacter(input: string): string {
  return input ? `${input.charAt(0).toUpperCase()}${input.slice(1)}` : ''
}

const labelClassName = clsx(
  'font-normal text-sm focus-within:font-semibold transition-all',
  'group-focus-within:font-semibold group-focus-within:text-sky-900',
)

const inputClassName = clsx(
  'peer block w-full py-2 sm:py-1.5 px-2 rounded-md shadow-sm', // h-9 36px
  'border-0 ring-slate-300 ring-1 ring-inset outline:none',
  'text-base xs:text-sm sm:leading-6 text-slate-900',
  'placeholder:text-slate-400',
  'focus:ring-2 focus:ring-inset focus:ring-sky-300 focus:aria-[invalid=true]:ring-red-300 focus:outline-none',
)

/**
 * Form Select with label and error message.
 * Refs are forwarded to the underlying select element.
 *
 * Options are provided via `options` prop as an array of `[value, label]` tuples.
 *
 * If a `label` prop is not provided the input uses the `name` to generate a label.
 */
export const FormSelectField = forwardRef<HTMLSelectElement, FormSelectFieldProps>(function FormSelectField(
  { id, label, options, description, error, wrapClassName, className, ...restProps },
  ref: React.Ref<HTMLSelectElement>,
): JSX.Element {
  const reactId = useId()
  const ssrId = id || `${restProps.name}-${reactId}`

  const inputLabel = label || capitalizeFirstCharacter(restProps.name)

  return (
    <div className={cn('group flex flex-col gap-2', wrapClassName)}>
      <label
        htmlFor={ssrId}
        className={cn(labelClassName, {
          'text-red-800 group-focus-within:text-red-700': !!error,
        })}
      >
        {inputLabel}
      </label>
      <select
        ref={ref}
        id={ssrId}
        className={cn(inputClassName, className)}
        aria-invalid={error ? 'true' : undefined}
        {...restProps}
      >
        {options.map(([value, label]) => (
          <option key={`${value}${label}`} value={value}>
            {label}
          </option>
        ))}
      </select>
      {description ? <div className="text-xs"> - {description}</div> : null}
      {error ? <div className="text-xs text-red-800">{error}</div> : null}
    </div>
  )
})
