import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { CompareProvider } from '@/context/CompareProvider'
import { router } from '@/router'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Breedly could not start: the #root element is missing from index.html.')
}

createRoot(container).render(
  <StrictMode>
    <CompareProvider>
      <RouterProvider router={router} />
    </CompareProvider>
  </StrictMode>,
)
