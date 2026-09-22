import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render( //means React looks for the HTML element:
  <StrictMode>
    <App />
  </StrictMode>,
)
