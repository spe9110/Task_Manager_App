import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import store from './store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient();

// Use Vite's import.meta.env.MODE to check the environment
const isDev = import.meta.env.MODE === 'development';

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>
    </Provider>
    {isDev && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
)
