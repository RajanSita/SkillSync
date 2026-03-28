import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = "/logo-trans.png";
document.head.appendChild(favicon);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
