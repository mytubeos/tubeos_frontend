import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1A1A2E', color: '#F9FAFB', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' },
          success: { iconTheme: { primary: '#10B981', secondary: '#F9FAFB' } },
          error:   { iconTheme: { primary: '#F43F5E', secondary: '#F9FAFB' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
