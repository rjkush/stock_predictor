import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';
import * as tf from '@tensorflow/tfjs';

console.log('Starting application...'); // Debug log

// Initialize TensorFlow.js
tf.setBackend('webgl').then(() => {
  console.log('TensorFlow.js initialized with WebGL backend');
}).catch(error => {
  console.warn('WebGL not available, falling back to CPU:', error);
  tf.setBackend('cpu');
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
