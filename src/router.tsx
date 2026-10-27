import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'

import LandingPage from '@/pages/LandingPage'
import BreedExplorer from '@/pages/BreedExplorer'
import BreedDetails from '@/pages/BreedDetails'
import CompareBreeds from '@/pages/CompareBreeds'

export const router = createBrowserRouter([
  // Landing page - the first screen users see
  {
    path: '/',
    element: <LandingPage />,
    errorElement: () => <div>Error loading page</div>,
  },

  // Breed explorer page
  {
    path: '/breeds',
    element: <BreedExplorer />,
    errorElement: () => <div>Error loading page</div>,
  },

  // Breed details page - uses dynamic segment :slug
  {
    path: '/breeds/:slug',
    element: <BreedDetails />,
    errorElement: () => <div>Error loading page</div>,
  },

  // Breed comparison page
  {
    path: '/compare',
    element: <CompareBreeds />,
    errorElement: () => <div>Error loading page</div>,
  },

  // Fallback - redirect to landing page
  {
    path: '*',
    element: <LandingPage />,
  },
])