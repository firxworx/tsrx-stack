import React from 'react'
import { cn } from '@rfx/react-core'

export interface PageLayoutProps extends React.PropsWithChildren {}

export interface PageHeadingProps {
  title: string
  description?: string
  className?: string
}

export function PageLayout({ children }: PageLayoutProps): JSX.Element {
  return (
    <div className="flex w-full">
      <div className="w-full">{children}</div>
    </div>
  )
}

/**
 * Simple h1 page heading.
 */
export function PageHeading({ title, description, className }: PageHeadingProps): JSX.Element {
  return (
    <>
      <h1 className={cn('text-4xl tracking-tight font-bold mb-8', className)}>{title}</h1>
      {description ? <p className="text-lg mb-8">{description}</p> : null}
    </>
  )
}
