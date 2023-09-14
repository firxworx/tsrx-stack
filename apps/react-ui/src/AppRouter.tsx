import { Outlet, createBrowserRouter, type RouteObject } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { PostPage } from './pages/PostPage'
import { AboutPage } from './pages/AboutPage'
import { PageHeading } from './layout/PageLayout'
import { UsersPage } from './pages/UsersPage'
import { UserPage } from './pages/UserPage'

export interface AppNavLink {
  title: string
  href: string
}

export const navLinks: AppNavLink[] = [
  { title: 'Users', href: '/users' },
  { title: 'About', href: '/about' },
]

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout navLinks={navLinks} />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'posts/:id',
        element: <PostPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'users/:uid',
        element: <UserPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,

    // note react-router docs recommend to use a root error boundary e.g.
    // errorElement: <RootErrorBoundary />,

    children: [
      ...publicRoutes,
      {
        path: '*',
        element: <AppLayout navLinks={navLinks} />,
        children: [
          {
            path: '*',
            element: <NotFoundScreen />,
          },
        ],
      },
    ],
  },
]

export function NotFoundScreen(): JSX.Element {
  return (
    <div>
      <PageHeading title="Not Found" />
    </div>
  )
}

export function ErrorScreen(): JSX.Element {
  return (
    <div>
      <PageHeading title="Error" />
    </div>
  )
}

export const AppRouter = createBrowserRouter(rootRoutes)
