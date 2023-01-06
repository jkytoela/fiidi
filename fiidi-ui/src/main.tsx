import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './routes/root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './twind';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!); // eslint-disable-line
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
