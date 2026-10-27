import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import About from '@/pages/About'
import BreedDetails from '@/pages/BreedDetails'
import BreedExplorer from '@/pages/BreedExplorer'
import CompareBreeds from '@/pages/CompareBreeds'
import LandingPage from '@/pages/LandingPage'
import NotFound from '@/pages/NotFound'

/**
 * `/` is the landing page and the first screen users see.
 * Every route renders inside the shared layout (navigation + footer).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'breeds', element: <BreedExplorer /> },
      { path: 'breeds/:slug', element: <BreedDetails /> },
      { path: 'compare', element: <CompareBreeds /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
