import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../src/features/auth/context/AuthContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/global.css";
import { Provider } from 'react-redux'
import store from './app/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)