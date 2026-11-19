import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export { company, fullAddress, links } from './data/site.js';

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
