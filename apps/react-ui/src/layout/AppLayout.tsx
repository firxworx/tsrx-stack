import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import type { AppNavLink } from '../AppRouter'
import { AuthMenu } from '../components/auth/AuthMenu'
import { cn } from '@rfx/react-core'
import { HomeIcon } from 'lucide-react'

export interface AppLayoutProps {
  navLinks?: AppNavLink[]
  className?: string
}

export interface ContainerProps {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
}

export interface AppLayoutNavHeaderProps extends Pick<AppLayoutProps, 'navLinks'> {}

export const containerBaseClassName = 'flex flex-col w-full min-h-screen z-0 bg-slate-100'

export const AppLayout = React.memo(function AppLayout({ navLinks, className }: AppLayoutProps): JSX.Element {
  return (
    <div className={cn(containerBaseClassName, className)}>
      <AppLayoutNavHeader navLinks={navLinks} />
      <main className="flex-1 py-6 sm:pt-8 sm:pb-12">
        <Container>
          <Outlet />
        </Container>
      </main>
      <AppLayoutFooter />
    </div>
  )
})

export function Container({ className, as, children }: ContainerProps): JSX.Element {
  const ContainerComponent = as ?? 'div'
  return (
    <ContainerComponent className={cn('container mx-auto px-4 sm:px-6 max-w-6xl', className)}>
      {children}
    </ContainerComponent>
  )
}

export function Logo(): JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-2 px-3 rounded-lg transition-colors',
        'border border-slate-300 hover:border-slate-400/80',
        'text-sm font-normal bg-slate-50 text-slate-800 opacity-80',
      )}
    >
      <HomeIcon className="h-5 w-5 text-sky-900 group-hover:text-sky-700/80" aria-hidden="true" />
    </div>
  )
}

const focusClassName = cn(
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300',
  'focus-visible:rounded-md',
)

export function AppLayoutNavHeader({ navLinks }: AppLayoutNavHeaderProps): JSX.Element {
  return (
    <header className="isolate bg-slate-200">
      <Container className="flex items-center">
        <nav className="flex flex-1 items-center gap-2 sm:gap-4 h-14 [&>a]:text-sky-900">
          <Link
            to="/"
            aria-label="Logo Home Link"
            className={cn('group inline-block -ml-1 pl-1 pr-1 xs:-ml3 xs:pl-3 xs:pr-3', focusClassName)}
          >
            <Logo />
          </Link>
          {navLinks?.map((link) => (
            <Link
              key={`${link.title}${link.href}`}
              to={link.href}
              className={cn(
                'block py-2 px-1 xs:px-3 text-sm xs:text-base font-medium no-underline hover:underline',
                focusClassName,
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <aside>
          <AuthMenu />
        </aside>
      </Container>
    </header>
  )
}

export function AppLayoutFooter(): JSX.Element {
  return (
    <footer className="z-0 bg-slate-200">
      <Container className="py-4 text-center text-slate-800/75 text-sm">
        &copy; {new Date().getFullYear()}&nbsp;Placeholder
      </Container>
    </footer>
  )
}
