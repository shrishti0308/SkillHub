import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import { APPwithRouter } from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <APPwithRouter />
  </StrictMode>
)
