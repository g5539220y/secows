import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 如果您想开始测量应用的性能，可以传递一个函数
// 来记录结果（例如：reportWebVitals(console.log)）
// 或者发送到分析端点。了解更多：https://bit.ly/CRA-vitals
reportWebVitals();