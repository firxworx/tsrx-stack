import React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '../utils/style-utils'

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<SVGElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  wrapClassName?: string
}

export const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      xxs: 'h-3 w-3',
      xs: 'h-4 w-4',
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
    color: {
      grayscale: 'text-[#505050]',
      primary: 'text-P-primary',
      secondary: 'text-P-secondary',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'grayscale',
  },
})

/**
 * Animated busy/loading spinner.
 *
 * Specify `size` 'xxs', 'xs', 'sm', 'md' (default), or 'lg' at 3, 4, 5, 6, or 8 tailwind units respectively.
 *
 * If a `className` prop is provided it is merged with the classes of the underlying animated spinner SVG.
 * The `wrapClassName` prop is merged with the wrapping flex div.
 *
 * The spinner is a classic design  based on a svg+css animation example found in the tailwindcss docs for the
 * `animate` utilities.
 */
export const Spinner: React.FC<SpinnerProps> = ({ size, color, className, wrapClassName }) => {
  return (
    <div className={cn('flex items-center', wrapClassName)} role="status" aria-live="polite" aria-label="Loading…">
      <svg
        className={cn(spinnerVariants({ size, color, className }))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}
