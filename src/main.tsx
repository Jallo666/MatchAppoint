import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import './lib/dayjs';
import './style.css';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
