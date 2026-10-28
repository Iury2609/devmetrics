import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { HomePage } from '../pages/HomePage'
import { ProfilePage } from '../pages/ProfilePage'
import { ComparePage } from '../pages/ComparePage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/u/:username', element: <ProfilePage /> },
      { path: '/comparar', element: <ComparePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
