import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './common/auth'
import { ToastContainer, Flip } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
      <ToastContainer
          position="bottom-right"
          autoClose={5000}
          closeOnClick={false}
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={true}
          transition={Flip}
      />
  </React.StrictMode>,
)
