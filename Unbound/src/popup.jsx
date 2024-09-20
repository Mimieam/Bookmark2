import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import { LocaleProvider } from '@douyinfe/semi-ui';

ReactDOM.createRoot(document.getElementById('root')).render(
  <LocaleProvider locale={en_GB}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LocaleProvider>
)
